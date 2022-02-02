import React, {useState, useContext} from 'react';
import {UserCircleIcon} from "react-native-heroicons/outline";
import {HomeIcon} from "react-native-heroicons/outline";
import {PlusCircleIcon} from "react-native-heroicons/outline";
import {ClipboardListIcon} from "react-native-heroicons/outline";
import {ChartSquareBarIcon} from "react-native-heroicons/outline";
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
import SessionsScreen from './SessionsScreen';
import SettingsScreen from './SettingsScreen';
import HomeScreen from './HomeScreen';
import MyPlanScreen from './MyPlanScreen';
import SessionScreen from './SessionScreen';

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
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {

          if (route.name === 'Home') {
            return <HomeIcon color={color} size={size} />;
          } else if (route.name === 'Settings') {
            return <UserCircleIcon color={color} size={size} />;
          } else if (route.name == 'Plans') {
            return <ClipboardListIcon color={color} size={size} />;
          } else if (route.name === 'Sessions') {
            return <ChartSquareBarIcon color={color} size={size} />;
          }
        },
        tabBarActiveTintColor: '#60A5FA',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Plans" component={MyPlanScreen} />
      <Tab.Screen name="Session" component={SessionScreen} options={{
        tabBarLabel: '',
        tabBarIcon: ({ color, size }) => (
          <PlusCircleIcon color={color} size={size + 40} fill='#ffffff' />
        ),
      }}/>
      <Tab.Screen name="Sessions" component={SessionsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default MainScreen;
