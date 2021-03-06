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
import {API_BASE_URL} from "@env"

const LoginScreen = ({navigation}) => {
  const { auth0, userInfo, setUserInfo, accessToken, setAccessToken } = useContext(AppContext);

  const checkSignupStatus = async (token, info) => {
    console.log("API_BASE_URL:" + API_BASE_URL)
    const statusRequest = await fetch(`${API_BASE_URL}/signup-status`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    const res = await statusRequest.json().catch(err => {
      console.log(`Error: ${err}`)
    });
    
    if (res?.signedUp && res?.type == 'client') {
      console.log(res)
      // Update userInfo with userId
      let updatedUserInfo = {
        ...info,
        id: res.id
      }
      setUserInfo(updatedUserInfo)

      return true;
    } else {
      console.log('user not signed up');
      return false;
    }
  };

  const signupUser = async (userData, token) => {
    const reqBody = JSON.stringify(userData);
    const signupRequest = await fetch(`${API_BASE_URL}/clients/signup`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: reqBody,
    });

    if (signupRequest.status === 200) {
      return true;
    } else {
      console.log('failed to signup user');
      return false;
    }
  };

  const handleLogin = () => {
    //if (accessToken === null) {
    if (true) {
      auth0.webAuth
        .authorize({
          scope: 'openid profile name email',
          audience: 'https://api.vysio.ca',
        })
        .then(async credentials => {
          setAccessToken(credentials.accessToken);

          const info = await auth0.auth.userInfo({
            token: credentials.accessToken,
          });

          const signedUp = await checkSignupStatus(credentials.accessToken, info);

          if (signedUp) {
            // Send to referral screen
            navigation.reset({
              index: 0,
              routes: [{name: 'Referral'}],
            });
          } else {
            console.log('Not signed up');
            Alert.alert(
              'Login Failed',
              'No user exists for this email, please signup first',
              [
                {
                  text: 'OK',
                },
              ],
            );
          }
        })
        .catch(error => console.log(error));
    }
  };

  const handleSignup = () => {
    //if (accessToken === null) {
    if (true) {
      auth0.webAuth
        .authorize({
          scope: 'openid profile name email',
          audience: 'https://api.vysio.ca',
          prompt: 'login'
        })
        .then(async credentials => {
          setAccessToken(credentials.accessToken);

          const info = await auth0.auth.userInfo({
            token: credentials.accessToken,
          });
          setUserInfo(info);

          const signedUp = await checkSignupStatus(credentials.accessToken);
          console.log('Signed up: ' + signedUp);

          if (!signedUp) {
            // Signup user
            const signupData = {
              firstName: info.givenName,
              lastName: info.familyName,
              email: info.email,
            };
            const signup = await signupUser(signupData, credentials.accessToken);

            if (signup.status != 200) {
              Alert.alert(
                'Signup Failed',
                'Failed to sign up new user',
                [
                  {
                    text: 'OK',
                  },
                ],
              );
            } else {
              // Update userInfo with userId
              let updatedUserInfo = {
                ...userInfo,
                id: signup.id
              }
              setUserInfo(updatedUserInfo)

              // Send to referral screen
              navigation.reset({
                index: 0,
                routes: [{name: 'Referral'}],
              });
            }
          } else {
            console.log('Already signed up: Please login');
            Alert.alert(
              'Please Login',
              'Already Signed Up, Please Login',
              [
                {
                  text: 'OK',
                },
              ],
            );
          }
        })
        .catch(error => console.log(error));
    }
  };

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
