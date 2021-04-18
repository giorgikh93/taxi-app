import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, Platform } from 'react-native';

function DriverOrPassenger({ onPassengerPress, onDriverPress }) {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={[styles.choiceContainer]} onPress={onDriverPress}>
                <Text style={styles.text}>I'm driver </Text>
                <Image style={styles.selectionImage} source={require('../images/steeringwheel.png')} />
            </TouchableOpacity>
            <View style={{ height: 5, width: '100%', backgroundColor: '#fff' }}></View>
            <TouchableOpacity style={styles.choiceContainer} onPress={onPassengerPress}>
                <Text style={styles.text}>I'm passenger </Text>
                <Image style={styles.selectionImage} source={require('../images/passenger.png')} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3A3743'
    },
    choiceContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'

    },
    selectionImage: {
        height: 200,
        width: 200
    },
    text: {
        color: "#fff",
        fontSize: 32,
        marginBottom: 20,
        fontWeight: '200',
        fontFamily: Platform.OS === 'android' ? 'sans-serif-light' : undefined
    }
});

export default DriverOrPassenger;