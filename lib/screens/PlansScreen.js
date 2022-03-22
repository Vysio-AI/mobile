import React, {useState, useContext, useEffect} from 'react';
import tailwind from 'tailwind-rn';
import {
  Text,
  View,
} from 'react-native';
import SwipeableFlatList from 'react-native-swipeable-list';

import AppContext from '../AppContext';

import {useQuery} from 'react-query';
import {getPlans} from '../api/plans';

const ListItem = ({id, name, timeframe, repetitions, exercises }) => {
  return (
    <View style={tailwind('bg-white mx-2 my-1 p-3 rounded-lg border border-gray-100 flex flex-col')}>
      <View style={tailwind('flex flex-row justify-between')}>
        <Text style={tailwind('text-xl font-bold')}>{name}</Text>
        <View style={tailwind('flex flex-row')}>
          <Text style={tailwind('text-lg mr-1')}>{repetitions}x</Text>
          <Text style={tailwind('text-lg lowercase capitalize')}>{timeframe}</Text>
        </View>
      </View>
      <View style={tailwind('flex flex-row pt-2 justify-end items-center')}>
        <View style={tailwind('pr-1')}>
          <Text>{exercises.length} Exercises</Text>
        </View>
        <View style={tailwind('pl-1')}>
          <Text>{(exercises.map(i=>i.duration)?.reduce((a,b) => a+b, 0) / 60).toFixed(1)} min</Text>
        </View>
      </View>
    </View>
  );
};

const PlansScreen = ({navigation}) => {
  const {accessToken, userInfo} = useContext(AppContext);

  const plans = useQuery(['plans', userInfo.id, accessToken], () => getPlans(userInfo.id, accessToken));

  const renderItem = ({item}) => (
    <ListItem
      id={item.id}
      name={item.name}
      timeframe={item.timeframe}
      repetitions={item.repetitions}
      exercises={item.exercises}
    />
  );

  return (
    <View style={tailwind('h-full w-full flex flex-col bg-gray-50')}>
      <SwipeableFlatList 
        data={plans.data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        onRefresh={plans.refetch}
        refreshing={plans.isLoading}
      />
    </View>
  )
}

export default PlansScreen;
