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
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';

// Import screens
import ActivityScreen from './ActivityScreen';
import SettingsScreen from './SettingsScreen';
import HomeScreen from './HomeScreen';
import MyPlanScreen from './MyPlanScreen';

const Tab = createBottomTabNavigator();

const MainScreen = ({navigation}) => {
  const {accessToken, userInfo} = useContext(AppContext);

  if (accessToken == null) {
    navigation.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
  }

  return (
    <Tab.Navigator>
      <Tab.Screen name="My Plan" component={MyPlanScreen} />
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Activity" component={ActivityScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  )
}

export default MainScreen;
