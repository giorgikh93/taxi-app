

import React, { useEffect, useState, useRef } from 'react';
import {
    StyleSheet,
    View,
    Linking,
    Platform,
    PermissionsAndroid,
    ActivityIndicator
} from 'react-native';
import MapView, { Marker, Polyline, } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import apiKey from '../google_api_key'
import _ from 'lodash'
import PolyLine from '@mapbox/polyline'
import AppButton from '../components/AppButton';
import socketIO from 'socket.io-client'
import ErorrMessage from '../components/ErorrMessage';
import {useStateValue} from '../StateProvider'

const Driver = () => {

    const [latitude, setLatitude] = useState(null)
    const [longitude, setLongitude] = useState(null)
    const [pointCoords, setPointCoords] = useState([])
    const [error, setError] = useState(false)
    const [lookingForPassenger, setLookingForPassenger] = useState(false)
    const [buttonText, setButtontext] = useState('Find Passenger')
    const [passengerFound, setPassengerFound] = useState(false)
    const [routeResponse, setRouteResponse] = useState()
    const mapRef = useRef()
    const [{token}] = useStateValue();


    useEffect(() => {
        async function getLocation() {
            let granted = false;
            if (Platform.OS === 'ios') {
                granted = true
            } else {
                granted = await checkAndroidPermissions()
            }
            if (granted) {
                const watchId = Geolocation.getCurrentPosition(position => {
                    setLatitude(position.coords.latitude)
                    setLongitude(position.coords.longitude)
                }, error => setError(error.message),
                    { enableHighAccuracy: true, timeout: 20000, maximumAge: 2000 }

                )
            }
        }
        getLocation()
        return function () {
            Geolocation.clearWatch(watchId)
        }

    }, [])


    const checkAndroidPermissions = async () => {
        try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                title: 'Taxi App',
                message: 'Taxi app needs to use your location to show routes and get taxis'
            })
            if (granted === PermissionsAndroid.RESULTS.GRANTED) return true
            else return false
        } catch (error) {
            console.log(error, 'error while getting permissions')
        }
    }


    const lookForPassenger = async () => {

        !lookingForPassenger && setLookingForPassenger(true)
        const socket = socketIO.connect("http://192.168.0.103:3000");
        socket.on("connect", () => {
            socket.emit('lookingForPassenger')

        })

        socket.on('taxiRequest', (routeResponse) => {
            setLookingForPassenger(false),
                setButtontext('Passenger found,accept ride?'),
                setPassengerFound(true),
                setRouteResponse(routeResponse)
            getRouteDirections(routeResponse.geocoded_waypoints[0].place_id)
        })

    }

    const getRouteDirections = async (placeId) => {
        try {
            const response = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${latitude},${longitude}&destination=place_id:${placeId}&key=${apiKey}`)
            const json = await response.json();
            const points = PolyLine.decode(json.routes[0].overview_polyline.points);
            const pointsCoords = points.map(point => {
                return { latitude: point[0], longitude: point[1] }
            })
            setPointCoords(pointsCoords)
            setRouteResponse(json)
            mapRef.current.fitToCoordinates(pointCoords)
        } catch (error) {
            console.log(error)
        }
    }


    function acceptPassenger() {
        const socket = socketIO.connect("http://192.168.0.103:3000");
        socket.emit('driverLocation', { latitude, longitude })

        const passengerLocation = pointCoords[pointCoords.length - 1];
        if (Platform.OS === 'ios') {
            Linking.openURL(`http://maps.apple.com/?daddr=${passengerLocation.latitude},${passengerLocation.longitude}`)
        } else {
            Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${passengerLocation.latitude},${passengerLocation.longitude}`)
        }
    }
    return (
        !latitude && !longitude ?
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size='large' color='dodgerblue' />
                {error && <ErorrMessage error='An error has occured' />}
            </View> :
            <View style={styles.container}>
                <MapView
                    mapRef={mapRef}
                    style={styles.mapStyle}
                    initialRegion={{
                        latitude: latitude,
                        longitude: longitude,
                        latitudeDelta: 0.015,
                        longitudeDelta: 0.0121,
                    }}
                    showsUserLocation={true}
                >
                    <Polyline
                        coordinates={pointCoords}
                        strokeWidth={4}
                        strokeColor='red'
                    />
                    {pointCoords.length > 1 &&
                        <Marker coordinate={pointCoords[pointCoords.length - 1]}
                        />}

                </MapView>
                <AppButton
                    text={buttonText} onPress={() => passengerFound ? acceptPassenger() : lookForPassenger()}
                    loading={lookingForPassenger}
                />
            </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject
    },
    mapStyle: {
        ...StyleSheet.absoluteFillObject
    },
    destinationInput: {
        height: 40,
        borderWidth: 0.5,
        marginTop: 50,
        marginLeft: 5,
        marginRight: 5,
        padding: 5,
        backgroundColor: '#fff',
    },
    predictionWrapper: {
        backgroundColor: '#fff',
        marginLeft: 5,
        marginRight: 5,

    }

});

export default Driver;
