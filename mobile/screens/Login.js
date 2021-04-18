import React from 'react';
import { View, StyleSheet, Text, Platform, Image, ActivityIndicator } from 'react-native';
import LoginForm from '../components/LoginForm'
import useAuth from '../hooks/useAuth'

function Login(props) {

    const { login, createAccount, email, setEmail, password, setPassword, loading } = useAuth();

    return (
        <View style={styles.container}>
            {loading ?
                <View style={{flex:1,justifyContent:'center'}}>
                    <ActivityIndicator size='large' animating={loading} color='dodgerblue' />
                </View>
                :
                <>
                    <Text style={styles.header}>Taxi App</Text>
                    <LoginForm
                        email={email}
                        password={password}
                        setPassword={setPassword}
                        setEmail={setEmail}
                        login={login}
                        createAccount={createAccount}
                    />
                    <View style={{ alignItems: 'center' }}>
                        <Image source={require('../images/greencar.png')} style={styles.image} />
                    </View>
                </>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3A3743'
    },
    header: {
        fontSize: 30,
        color: '#C1D76D',
        marginTop: 30,
        textAlign: 'center',
        fontFamily: Platform.OS === 'android' ? 'sans-serif-light' : undefined,
        fontWeight: '200',
        opacity: 0.7
    },
    image: {
        height: 300,
        width: 300
    }
});

export default Login;