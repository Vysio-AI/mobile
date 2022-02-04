import React, {useContext} from 'react';
import {
  View,
  Pressable,
  Text
} from 'react-native';
import tailwind from 'tailwind-rn';
import {LogoutIcon} from 'react-native-heroicons/outline';
import AppContext from '../AppContext';

const LogoutButton = () => {
  const {auth0, setAccessToken, setUserInfo} = useContext(AppContext);

  const handleLogout = () => {
    auth0.webAuth
      .clearSession({})
      .then(success => {
        setAccessToken(null);
        setUserInfo(null);
      })
      .catch(error => {
        console.log('Log out cancelled');
      });
  };

  return (
    <Pressable
      onPress={handleLogout}
      style={tailwind('w-28 h-12 text-white font-semibold flex flex-row items-center justify-center bg-gray-100 rounded-lg border border-2 border-gray-300')}
    >
      <LogoutIcon style={tailwind('w-12 h-12 text-black px-1')} />
      <Text style={tailwind('font-semibold text-base text-black px-1')}>
        Sign Out
      </Text>
    </Pressable>
  )
}

export default LogoutButton;
