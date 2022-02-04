import React, {useState, useContext} from 'react';
import tailwind from 'tailwind-rn';
import {
  SafeAreaView,
  Text,
  Button,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Image
} from 'react-native';
import LogoutButton from '../components/LogoutButton';
import AppContext from '../AppContext';

const SettingsScreen = ({navigation}) => {
  const {userInfo} = useContext(AppContext);

  return (
    <SafeAreaView style={tailwind('w-full h-full flex flex-col px-3 bg-gray-50')}>
      <ScrollView style={tailwind('w-full h-full')}>
        <View style={tailwind('flex flex-row items-center p-2')}>
          <Image
            style={tailwind('w-12 h-12 rounded-full')}
            source={{
              uri: userInfo?.picture,
            }}
          />
          <View style={tailwind('flex flex-row pr-4')}>
            <Text style={tailwind('text-xl font-semibold capitalize pl-2 pr-1')}>{userInfo?.givenName}</Text>
            <Text style={tailwind('text-xl font-semibold capitalize')}>{userInfo?.familyName}</Text>
          </View>
        </View>
        <LogoutButton />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
