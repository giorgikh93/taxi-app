import React from 'react';
import { View, StyleSheet,Text } from 'react-native';

function ErorrMessage({error}) {
  return (
      <View style={styles.container}>
          <Text style={styles.text}>{error}</Text>
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
       width:'100%',
       alignItems:'center',
       backgroundColor:'black',
       padding:20,
   },
   text:{
       color:'red',
       fontSize:20
   }
});

export default ErorrMessage;