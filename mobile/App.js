

import React, { useState, } from 'react';
import {
  StyleSheet,
  View,
  Button

} from 'react-native';
import Driver from './screens/Driver'
import Login from './screens/Login';
import Passenger from './screens/Passenger'
import { useStateValue } from './StateProvider'
import DriverOrPassenger from './components/DriverOrPassenger'
const App = () => {
  const [isDriver, setIsDriver] = useState(false);
  const [isPassenger, setIsPassenger] = useState(false)
  const [{ token }] = useStateValue()



  function renderState() {
    if (token === '') return <Login />
    if (isPassenger) return <Passenger />
    if (isDriver) return <Driver />
    else {
      return (
        <View style={styles.container}>
          <DriverOrPassenger onDriverPress={() => setIsDriver(true)} onPassengerPress={() => setIsPassenger(true)} />
        </View>
      );
    }
  }

  return (
    renderState()
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  button: {
    marginVertical: 20
  }

});

export default App;
