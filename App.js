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

const auth0 = new Auth0({
  domain: 'petermarshall.us.auth0.com',
  clientId: 'SnjygAyEh3ufh8uXz0gmRM2F6O79Lf2J',
});

const Stack = createNativeStackNavigator();

// const socket = io('localhost:3000');

const App = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

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
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Referral" component={ReferralScreen} />
          <Stack.Screen name="Main" component={MainScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppContext.Provider>
  );
};

export default App;
