import React, {useState, useContext, useEffect} from 'react';
import tailwind from 'tailwind-rn';
import {
  SafeAreaView,
  Text,
  Button,
  View,
  TouchableOpacity,
  Alert,
  FlatList,
  Pressable,
} from 'react-native';
import SwipeableFlatList from 'react-native-swipeable-list';

import DataGenerator from '../components/DataGenerator';
import {API_BASE_URL} from "@env"
import AppContext from '../AppContext';

import {useQuery, useMutation, useQueryClient} from 'react-query';
import {getSessions, deleteSession} from '../api/sessions';

const MONTHS = {
  0: 'Jan',
  1: 'Feb',
  2: 'Mar',
  3: 'Apr',
  4: 'May',
  5: 'Jun',
  6: 'Jul',
  7: 'Aug',
  8: 'Sep',
  9: 'Oct',
  10: 'Nov',
  11: 'Dec',
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

const ListItem = ({id, startTime, endTime, processed }) => {
  const startDateTime = new Date(startTime);
  const endDateTime = new Date(endTime);
  const duration = endDateTime - startDateTime;
  const dateString = DAYS[startDateTime.getDay()] + ', ' + MONTHS[startDateTime.getMonth()] + '. ' + startDateTime.getDate();
  return (
    <View style={tailwind('bg-white mx-2 my-1 p-3 rounded-lg border border-gray-100 flex flex-col')}>
      <View style={tailwind('flex flex-row justify-between')}>
        <Text style={tailwind('text-lg font-bold')}>{dateString}</Text>
        <Text style={tailwind('text-lg')}>{durationString(duration)}</Text>
      </View>
      <View style={tailwind('flex flex-row')}>
        <Text style={tailwind('text-lg')}>{timeString(startDateTime)}</Text>
      </View>
    </View>
  );
};

const SessionsScreen = ({navigation}) => {
  const {accessToken} = useContext(AppContext);
  
  const queryClient = useQueryClient();

  const sessions = useQuery(['sessions', accessToken], () => getSessions(accessToken));

  const removeSession = useMutation(({ sessionId, accessToken }) => deleteSession(sessionId, accessToken), {
    onSuccess: () => {
      return queryClient.invalidateQueries('sessions')
    },
  })

  const renderItem = ({item}) => (
    <ListItem
      id={item.id}
      startTime={item.startTime}
      endTime={item.endTime}
      processed={item.processed}
    />
  );

  const deleteSessionPopup = async (sessionId) => {
    Alert.alert(
      'Delete this Session?',
      'Please Confirm',
      [
        {
          text: 'Cancel',
        },
        {
          text: 'Delete',
          onPress: () => removeSession.mutate({
            sessionId: sessionId,
            accessToken: accessToken
          }),
        }
      ]
    );
  };

  const QuickActions = (index, qaItem) => {
    return (
      <View style={tailwind('bg-red-500 pr-6 py-2 my-1 mx-1 flex flex-1 items-end justify-center rounded-lg mr-2 ml-12')}>
        <Pressable onPress={() => deleteSessionPopup(qaItem.id)}>
          <Text style={tailwind('text-white font-bold')}>Delete</Text>
        </Pressable>
      </View>
    );
  };

  console.log(sessions);

  return (
    <View style={tailwind('h-full w-full flex flex-col bg-gray-50')}>
      <SwipeableFlatList 
        data={sessions.data?.reverse()}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        onRefresh={sessions.refetch}
        refreshing={sessions.isLoading}
        maxSwipeDistance={80}
        renderQuickActions={({index, item}) => QuickActions(index, item)}
      />
    </View>
  )
}

export default SessionsScreen;
