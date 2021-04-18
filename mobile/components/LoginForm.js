import React from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text, Platform } from 'react-native';

function LoginForm({
    email,
    password,
    setPassword,
    setEmail,
    login,
    createAccount
}) {
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder='your@email.com'
                keyboardType='email-address'
                autoCapitalize='none'
                autoCorrect={false}
                value={email}
                onChangeText={text=>setEmail(text)}
                placeholderTextColor='#fff'
            />
            <TextInput
                style={styles.input}
                placeholder='password'
                autoCapitalize='none'
                autoCorrect={false}
                value={password}
                onChangeText={text=>setPassword(text)}
                placeholderTextColor='#fff'
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={login}>
                <Text style={styles.text}>Sign in</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={createAccount}>
                <Text style={styles.text}>Create account</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center'
    },
    input: {
        height: 40,
        backgroundColor: '#8793A6',
        borderRadius: 10,
        width: '90%',
        marginTop: 15,
        color: '#fff',
        padding: 10
    },
    button: {
        backgroundColor: '#ABC837',
        width: '90%',
        padding: 10,
        marginTop: 20,
        borderRadius: 15
    },
    text: {
        color: '#000',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '200',
        fontFamily: Platform.OS === 'android' ? 'sans-serif-light' : undefined,
    }
});

export default LoginForm;