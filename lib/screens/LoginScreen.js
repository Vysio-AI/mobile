import React, {useState, useEffect, useContext} from 'react';
import {
  SafeAreaView,
  Text,
  Button,
  View,
  TouchableOpacity,
  Alert,
  Image
} from 'react-native';

import tailwind from 'tailwind-rn';
import Auth0 from 'react-native-auth0';
import Config from 'react-native-config';
import AppContext from '../AppContext';

const LoginScreen = ({navigation}) => {
  const { auth0, userInfo, setUserInfo, accessToken, setAccessToken } = useContext(AppContext);

  const handleLogin = () => {
    if (accessToken === null) {
      auth0.webAuth
        .authorize({scope: 'openid profile name'})
        .then(credentials => {
          setAccessToken(credentials.accessToken);
          navigation.reset({
            index: 0,
            routes: [{name: 'Referral'}],
          });
        })
        .catch(error => console.log(error));
    }
  };

  const handleSignup = () => {
    if (accessToken === null) {
      auth0.webAuth
        .authorize({scope: 'openid profile name'})
        .then(credentials => {
          setAccessToken(credentials.accessToken);
          navigation.reset({
            index: 0,
            routes: [{name: 'Referral'}],
          });
        })
        .catch(error => console.log(error));
    }
  };

  useEffect(() => {
    if (accessToken !== null) {
      auth0.auth
        .userInfo({
          token: accessToken,
        })
        .then(info => {
          setUserInfo(info);
        })
        .catch(console.error);
    }
  }, [accessToken, auth0.auth, setUserInfo]);

  return (
  <SafeAreaView style={tailwind('h-full w-full flex flex-col items-center justify-start')}>
    <View style={tailwind('flex flex-col items-center justify-center')}>
      <Image
        style={tailwind('w-40 mt-32')}
        resizeMode="contain"
        source={require('../../images/vysio-logo.png')}
      />
      <TouchableOpacity
        style={tailwind('bg-gray-200 border border-gray-300 rounded-lg w-32 h-14 flex items-center justify-center')}
        onPress={handleLogin}>
        <Text style={tailwind('text-gray-500 font-semibold text-lg')}>Sign in</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={tailwind('bg-blue-400 border border-blue-500 rounded-lg w-32 h-14 flex items-center justify-center mt-2')}
        onPress={handleSignup}>
        <Text style={tailwind('text-white font-semibold text-lg')}>Sign up</Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
  );
};
 
 export default LoginScreen;
