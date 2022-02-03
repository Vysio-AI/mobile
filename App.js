/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  Button,
  View,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import tailwind from 'tailwind-rn';
import DeviceInfo from 'react-native-device-info';
import Auth0 from 'react-native-auth0';
import Config from 'react-native-config';

// Import context
import AppContext from './lib/AppContext';

// Import Screens
import MainScreen from './lib/screens/MainScreen';
import LoginScreen from './lib/screens/LoginScreen';
import ReferralScreen from './lib/screens/ReferralScreen';

// import {io} from 'socket.io-client';

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

// const socket = io('localhost:3000');

const App = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  useAppState({
    onChange: onAppStateChange
  })

  // useEffect(() => {
  //   socket.on('connect', () => {
  //     Alert.alert("Socket connected");
  //   });
  // });

  return (
    <AppContext.Provider value={{
      auth0: auth0,
      userInfo: userInfo,
      setUserInfo: setUserInfo,
      accessToken: accessToken,
      setAccessToken: setAccessToken,
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
