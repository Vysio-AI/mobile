import React, {useState, useContext} from 'react';
import tailwind from 'tailwind-rn';
import {
  SafeAreaView,
  Text,
  Button,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AppContext from '../AppContext';

const MyPlanScreen = ({navigation}) => {

  return (
    <View style={tailwind('h-full w-full flex flex-col bg-gray-50')}>
      <Text>
        MyPlan Screen
      </Text>
    </View>
  )
}

export default MyPlanScreen;
