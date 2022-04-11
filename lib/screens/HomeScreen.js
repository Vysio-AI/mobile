import React, {useState, useContext, useEffect} from 'react';
import tailwind from 'tailwind-rn';
import {
  SafeAreaView,
  Text,
  Button,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  Pressable,
  ToastAndroid,
} from 'react-native';
import AppContext from '../AppContext';

const HomeScreen = ({navigation}) => {

  return (
    <View style={tailwind('h-full w-full flex flex-col bg-gray-50')}>
      <View style={tailwind('bg-white m-2 p-3 rounded-lg border border-gray-100')}>
        <Text style={tailwind('text-2xl font-bold')}>How it works</Text>
        <View style={tailwind('flex flex-row justify-between items-center')}>
          <View style={tailwind('flex flex-col')}>
            <Text style={tailwind('font-bold text-sm text-gray-300')}>4 simple steps</Text>
            <Text style={tailwind('font-bold text-base text-gray-600')}>1. Choose a plan</Text>
            <Text style={tailwind('font-bold text-base text-gray-600')}>2. Connect your band</Text>
            <Text style={tailwind('font-bold text-base text-gray-600')}>3. Complete your exercises</Text>
            <Text style={tailwind('font-bold text-base text-gray-600')}>4. Take notes!</Text>
          </View>
        </View>
      </View>
      <View style={tailwind('bg-white m-2 p-3 rounded-lg border border-gray-100')}>
        <Text style={tailwind('text-2xl font-bold')}>Plans</Text>
        <View style={tailwind('flex flex-col')}>
          <Text style={tailwind('text-gray-400 text-sm')}>Daily</Text>
          <View style={tailwind('flex flex-row w-full border-b border-gray-200')}>
            <View style={tailwind('flex flex-col')}>
              <Text style={tailwind('font-bold text-base text-gray-600')}>Shoulder Mobility Testing</Text>
            </View>
            <View>

            </View>
          </View>
          
        </View>
        

        <View style={tailwind('flex flex-row justify-end items-center pt-2')}>
          <Pressable
            style={tailwind('bg-blue-400 rounded-lg px-6 py-3')}
            onPress={() => Alert.alert('Pressed')}
          >
            <Text style={tailwind('text-white font-bold')}>See All</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
