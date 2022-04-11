/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import {
  Platform,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Auth0 from 'react-native-auth0';

// Import context
import AppContext from './lib/AppContext';

// Import Screens
import MainScreen from './lib/screens/MainScreen';
import LoginScreen from './lib/screens/LoginScreen';
import ReferralScreen from './lib/screens/ReferralScreen';
import SessionScreen from './lib/screens/SessionRunningScreen';

import {io} from 'socket.io-client';

// BLE Setup
import { BleManager } from 'react-native-ble-plx'

// React-query setup
import NetInfo from '@react-native-community/netinfo'
import useAppState from 'react-native-appstate-hook'
import {
  onlineManager,
  focusManager, 
  QueryClient,
  QueryClientProvider
} from 'react-query'

// Auto-refetch on reconnect
onlineManager.setEventListener(setOnline => {
  return NetInfo.addEventListener(state => {
    setOnline(state.isConnected)
  })
})

// Refetch on App Focus
function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active')
  }
}

const auth0 = new Auth0({
  domain: 'petermarshall.us.auth0.com',
  clientId: 'SnjygAyEh3ufh8uXz0gmRM2F6O79Lf2J',
});

const Stack = createNativeStackNavigator();

const queryClient = new QueryClient();

const manager = new BleManager();

const socket = io('https://api.vysio.ca');

const App = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [deviceUUID, setDeviceUUID] = useState(null);
  const [serviceUUID, setServiceUUID] = useState(null);

  useAppState({
    onChange: onAppStateChange
  })

  useEffect(() => {
    socket.on('connect', () => {
      console.log("Socket connected");
    });
  }, []);

  return (
    <AppContext.Provider value={{
      auth0: auth0,
      userInfo: userInfo,
      setUserInfo: setUserInfo,
      accessToken: accessToken,
      setAccessToken: setAccessToken,
      BleManager: manager,
      deviceUUID: deviceUUID,
      setDeviceUUID: setDeviceUUID,
      serviceUUID: serviceUUID,
      setServiceUUID: setServiceUUID,
      socket: socket
    }}>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false
            }}
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Referral" component={ReferralScreen} />
            <Stack.Screen name="Main" component={MainScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </QueryClientProvider>
    </AppContext.Provider>
  );
};

export default App;
