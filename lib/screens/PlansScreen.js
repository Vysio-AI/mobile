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

const MONTHS = {
  1: 'Jan',
  2: 'Feb',
  3: 'Mar',
  4: 'Apr',
  5: 'May',
  6: 'Jun',
  7: 'Jul',
  8: 'Aug',
  9: 'Sep',
  10: 'Oct',
  11: 'Nov',
  12: 'Dec',
};

const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const durationString = duration => {
  const minutes = Math.floor(Math.floor((duration / 1000)) / 60);
  const seconds = Math.floor((duration / 1000)) % 60;
  if (minutes < 0 || seconds < 0) { return "Err"}
  const minuteStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const secondStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
  return `${minuteStr}:${secondStr}`;
};

const timeString = time => {
  var hours = time.getHours();
  const minutes = time.getMinutes();
  const AMPM = hours > 12 ? 'pm' : 'am';
  if (hours > 12) {
    hours = hours - 12;
  };
  const minuteStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${hours}:${minuteStr} ${AMPM}`;
};

const ListItem = ({id, active, timeframe, repetitions }) => {
  return (
    <View style={tailwind('bg-white mx-2 my-1 p-3 rounded-lg border border-gray-100 flex flex-col')}>
      <View style={tailwind('flex flex-row justify-between')}>
        <Text style={tailwind('text-xl font-bold')}>Shoulder Rehabilitation</Text>
        <View style={tailwind('flex flex-row')}>
          <Text style={tailwind('text-lg mr-1')}>{repetitions}x</Text>
          <Text style={tailwind('text-lg lowercase capitalize')}>{timeframe}</Text>
        </View>
      </View>
      <View style={tailwind('flex flex-row pt-2')}>
        <View style={tailwind('py-1 px-3 bg-green-400 rounded-full')}>
          <Text style={tailwind('text-sm')}>{(active) ? "Active" : "Inactive"}</Text>
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
      active={item.active}
      timeframe={item.timeframe}
      repetitions={item.repetitions}
    />
  );

  console.log(plans);

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
