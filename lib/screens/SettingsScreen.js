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
        <Image
          style={tailwind('w-28 h-28 rounded-full')}
          source={{
            uri: userInfo?.picture,
          }}
        />
        {/* { userInfo && Object.keys(userInfo).map((key, idx) => (
          <Text>{key}</Text>
        ))
        } */}
        <View style={tailwind('mt-1')}>
          <Text style={tailwind('font-semibold capitalize')}>First Name</Text>
          <TextInput 
            style={tailwind('p-2 border m-1')}
            value={userInfo?.givenName}
          />
        </View>
        <View style={tailwind('mt-1')}>
          <Text style={tailwind('font-semibold capitalize')}>Last Name</Text>
          <TextInput
            style={tailwind('p-2 border m-1 mb-20')}
            value={userInfo?.familyName}
          />
        </View>
        <LogoutButton />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
