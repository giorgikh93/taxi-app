import React from 'react';
import { View, StyleSheet,TouchableOpacity,Text,ActivityIndicator } from 'react-native';

function AppButton({text,onPress,loading}) {
    return (
        <TouchableOpacity style={styles.bottomButton} onPress={onPress}>
            <View >
                <Text style={styles.bottomButtonText}>{text}</Text>
               {loading && <ActivityIndicator animating={loading} size='large'color='#fff'/>}
            </View>
        </TouchableOpacity>
    );
}

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
});

export default AppButton;