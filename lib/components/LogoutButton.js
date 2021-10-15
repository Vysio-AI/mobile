import React, {useContext} from 'react';
import {
  View,
  TouchableOpacity,
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
    <TouchableOpacity
      onPress={handleLogout}
      style={tailwind('w-full h-16 text-white font-semibold flex flex-row items-center justify-center border-b border-t')}
    >
      <LogoutIcon style={tailwind('w-12 h-12 text-gray-500 px-1')} />
      <Text style={tailwind('font-semibold text-lg px-1')}>
        Log Out
      </Text>
    </TouchableOpacity>
  )
}

export default LogoutButton;
