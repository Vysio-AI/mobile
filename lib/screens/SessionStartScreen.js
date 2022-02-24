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
import {getPlans, getAllExercisesForPlan} from '../api/plans';

const SessionStartScreen = ({navigation}) => {
  const {accessToken, userInfo} = useContext(AppContext);
  const [selectedPlan, setSelectedPlan] = useState();

  const plans = useQuery(['plans', userInfo.id, accessToken], () => getPlans(userInfo.id, accessToken));

  const exercises = useQuery(['exercises', selectedPlan?.id, accessToken], () => getAllExercisesForPlan(selectedPlan?.id, accessToken));

  const startSession = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'Session Running'}],
    });
  }

  if (plans.data && plans.data?.[0] && !selectedPlan) {
    setSelectedPlan(plans.data[0])
  }

  return (
    <View style={tailwind('flex flex-col')}>
      <View style={tailwind('flex flex-row justify-center pt-10')}>
        <Text style={tailwind('text-xl font-bold')}>
          Select a plan
        </Text>
      </View>
      <Picker
        style={tailwind('-mt-10 -mb-16')}
        selectedValue={selectedPlan}
        onValueChange={(itemValue, itemIndex) => {
          setSelectedPlan(itemValue);
        }}
      >
        {
          plans.data && plans.data.map(plan => (
            <Picker.Item label={plan.timeframe} value={plan} key={plan.id}/>
          ))
        }
      </Picker>
      <View style={tailwind('w-full flex flex-col justify-center p-2 pb-6 border border-gray-50 bg-white')}>
        <Text style={tailwind("text-xl font-bold mb-2 mt-2 pl-4")}>Plan Name Here</Text>
        <View style={tailwind("w-1/2 mx-4 border border-gray-200 mb-4")}></View>
        { exercises.data && exercises.data.map(ex => (
            <View style={tailwind('w-full flex flex-row justify-between px-2 mx-2')}>
              <Text>{ex.activityType}</Text>
              <Text>{ex.duration}s</Text>
            </View>
          ))
        }
      </View>
      <View style={tailwind('w-full flex flex-row justify-center mt-6')}>
        <Pressable
          onPress={startSession}
          style={tailwind('bg-blue-400 rounded-lg px-4 py-3')}
        >
          <Text style={tailwind('text-white text-lg font-bold')}>Start Session</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default SessionStartScreen;