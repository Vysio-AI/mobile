import React, {useState, useContext, useEffect} from 'react';
import SessionStartScreen from './SessionStartScreen';
import SessionRunningScreen from './SessionRunningScreen';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

const SessionScreen = ({navigation}) => {
  useFocusEffect(
    React.useCallback(() => {
      const reset = navigation.reset({
        index: 0,
        routes: [{ name: "Session Start"}]
      })
      return () => reset;
    }, [])
  );

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Session Start" component={SessionStartScreen} />
      <Stack.Screen name="Session Running" component={SessionRunningScreen} />
    </Stack.Navigator>
  )
}

export default SessionScreen;