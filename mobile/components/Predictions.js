import React from 'react'
import { Text,View } from 'react-native'

function Predictions({ prediction }) {
    return (
        <View style={{padding:2,borderBottomWidth:1}}>
            <Text >{prediction.description}</Text>
        </View>
    )
}
export default Predictions;