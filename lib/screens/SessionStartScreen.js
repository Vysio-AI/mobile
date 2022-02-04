import React, {useState, useContext, useEffect} from 'react';
import tailwind from 'tailwind-rn';
import {
  Text,
  Button,
  Pressable,
  View,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';

import AppContext from '../AppContext';

import {useQuery} from 'react-query';
import {getPlans} from '../api/plans';

const SessionStartScreen = ({navigation}) => {
  const {accessToken, userInfo} = useContext(AppContext);
  const [selectedPlan, setSelectedPlan] = useState();

  const plans = useQuery(['plans', userInfo.id, accessToken], () => getPlans(userInfo.id, accessToken));

  const startSession = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'Session Running'}],
    });
  }

  return (
    <View style={tailwind('flex flex-col')}>
      
      <Text style={tailwind('text-xl font-bold')}>
        Select a plan
      </Text>
      <Picker
        style={tailwind('-mt-10')}
        selectedValue={selectedPlan}
        onValueChange={(itemValue, itemIndex) => {
          setSelectedPlan(itemValue);
        }}
      >
        {
          plans.data && plans.data.map(plan => (
            <Picker.Item label={plan.timeframe} value={plan.timeframe} key={plan.id}/>
          ))
        }
      </Picker>
      <View style={tailwind('w-full flex flex-row')}>
        <Pressable
          onPress={startSession}
          style={tailwind('w-28 h-12 text-white font-semibold flex flex-row items-center justify-center bg-gray-100 rounded-lg border border-2 border-gray-300')}
        >
          <Text style={tailwind('font-semibold text-base text-black px-1')}>
            Start Session
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

export default SessionStartScreen;