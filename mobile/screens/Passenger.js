

import React, { useEffect, useState, useRef } from 'react';
import {
    StyleSheet,
    View,
    TextInput,
    TouchableHighlight,
    Keyboard,
    Image,
    ActivityIndicator
} from 'react-native';
import socketIO from 'socket.io-client'
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import apiKey from '../google_api_key'
import Predictions from '../components/Predictions';
import _ from 'lodash'
import PolyLine from '@mapbox/polyline'
import AppButton from '../components/AppButton';
import ErorrMessage from '../components/ErorrMessage'


const Passenger = () => {
    const [latitude, setLatitude] = useState(null)
    const [longitude, setLongitude] = useState(null)
    const [destination, setDestination] = useState('')
    const [predictions, setPredictions] = useState([])
    const [routeResponse, setRouteResponse] = useState()
    const [pointCoords, setPointCoords] = useState([])
    const [loading, setLoading] = useState(false)
    const [driverOnTheWay, setDriverOnTheWay] = useState(false);
    const [driverLocation, setDriverLocation] = useState([])
    const [error, setError] = useState(false)
    const mapRef = useRef()


    useEffect(() => {
        const watchId = Geolocation.watchPosition(position => {
            setLatitude(position.coords.latitude)
            setLongitude(position.coords.longitude)
        }, error => setError(error.message),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 2000 }
        )

        return function () {
            Geolocation.clearWatch(watchId)
        }
    }, [])


    const onDestinationDebouncedChange = async (dest) => {
        setDestination(dest);
        if (dest.length > 3) {
            const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${apiKey}&input=${dest}&location=${latitude}, ${longitude}&radius=2000`
            try {
                const result = await fetch(apiUrl)
                const json = await result.json();
                setPredictions(json.predictions)
            } catch (error) {
                console.log(error)
            }
        }

    }
    const requestDriver = async () => {
        setLoading(true)
        const socket = socketIO.connect("http://192.168.0.103:3000")
        await socket.on('connect', () => {
            console.log('client connected');
            socket.emit('taxiRequest', routeResponse)
        })
        socket.on("driverLocation", driverLocation => {
            // mapRef.current.fitToCoordinates(pointCoords,{edgePadding:{top:20,bottom:20,left:20,right:20}})
            setDriverLocation([driverLocation])
            setLoading(false),
                setDriverOnTheWay(true);

        })
    }

    const getRouteDirections = async (placeId, destinationName) => {
        try {
            const response = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${latitude},${longitude}&destination=place_id:${placeId}&key=${apiKey}`)
            const json = await response.json();
            const points = PolyLine.decode(json.routes[0].overview_polyline.points);
            const pointsCoords = points.map(point => {
                return { latitude: point[0], longitude: point[1] }
            })
            setPointCoords(pointsCoords)
            setPredictions([])
            setDestination(destinationName)
            setRouteResponse(json)
            Keyboard.dismiss();
            mapRef.current.fitToCoordinates(pointCoords)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        !latitude && !longitude ?
            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                <ActivityIndicator size='large' color='dodgerblue' />
                {error && <ErorrMessage error='An error has occured'/>}

            </View>
            :
            <View style={styles.container}>
                <MapView
                    provider={PROVIDER_GOOGLE}
                    mapRef={mapRef}
                    style={styles.mapStyle}
                    initialRegion={{
                        latitude: latitude,
                        longitude: longitude,
                        latitudeDelta: 0.015,
                        longitudeDelta: 0.0121,
                    }}
                    showsUserLocation
                >
                    <Polyline
                        coordinates={pointCoords}
                        strokeWidth={4}
                        strokeColor='red'
                    />
                    {pointCoords.length > 1 &&
                        <Marker coordinate={pointCoords[pointCoords.length - 1]}
                        />}
                    {driverOnTheWay &&
                        <Marker coordinate={driverLocation[driverLocation.length - 1]}>
                            <Image
                                source={require('../images/car.png')}
                                style={{ width: 40, height: 40 }}
                            />
                        </Marker>}

                </MapView>

                <TextInput
                    style={styles.destinationInput}
                    placeholder='Enter destination'
                    value={destination}
                    onChangeText={text => onDestinationDebouncedChange(text)}
                />
                <View style={styles.predictionWrapper}>
                    {predictions.map((prediction, key) =>
                        <TouchableHighlight key={key} onPress={() => getRouteDirections(prediction.place_id, prediction.description)}>
                            <Predictions prediction={prediction} />
                        </TouchableHighlight>
                    )}
                </View>
                {pointCoords.length > 0 &&
                    <AppButton text='Find Driver' onPress={() => requestDriver()} loading={loading} />
                }
            </View>
    );
};

const styles = StyleSheet.create({
    bottomButton: {
        backgroundColor: 'black',
        padding: 13,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 'auto',
        marginBottom: 10,
        alignSelf: 'center',
        borderRadius: 10

    },
    bottomButtonText: {
        color: '#fff',
        fontSize: 20
    },
    container: {
        ...StyleSheet.absoluteFillObject
    },
    mapStyle: {
        ...StyleSheet.absoluteFillObject,
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

export default Passenger;
