import React, { useState } from 'react';
import { Alert } from 'react-native'
import client from '../client'
import { useStateValue } from '../StateProvider'

function useAuth(props) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const[loading,setLoading] = useState(false)
    const [{},dispatch] = useStateValue()


    async function login() {
        try {
            setLoading(true)
            const result = await client.post('/auth/login', { email, password })
            const { token } = result.data
            setEmail('');
            setPassword('')
            dispatch({type:'SET__TOKEN', payload:token})
            setLoading(false)
        } catch (error) {
            Alert.alert('An error has occured', error.response.data.message)
            console.log(error.response, 'error')
            setLoading(false)
        }
    }
    async function createAccount() {
        try {
            setLoading(true)
            if(email ===''||password==='') return Alert.alert('Email and password is required','Please fill all required fields')
            const result = await client.post('/auth/signup', { email, password })
             if(result.status ===200) await login()   
            setEmail('');
            setPassword('')
            setLoading(false)
        } catch (error) {
            Alert.alert('An error has occured', error.response.data)
            console.log(error.response, 'error')
            setLoading(false)
        }
    }
    return { login, createAccount, email, setEmail, password, setPassword,loading }

}


export default useAuth;