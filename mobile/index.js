/**
 * @format
 */
import React from 'react'
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { StateProvider } from './StateProvider'
import reducer, { initialState } from './reducer'


AppRegistry.registerComponent(appName, () => (props) => (
    <StateProvider reducer={reducer} initialState={initialState}>
        < App {...props} />
    </StateProvider>),
    () => App

);
