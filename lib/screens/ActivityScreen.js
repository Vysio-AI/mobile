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
import AppContext from '../AppContext';

import DataGenerator from '../components/DataGenerator';

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

const ActivityScreen = ({navigation}) => {
  const {accessToken} = useContext(AppContext);
  const [sessions, setSessions] = useState([]);
  const [refreshingSessions, setRefreshingSessions] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const fetchSessions = await fetch('http://localhost:3000/api/v1/sessions', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const res = await fetchSessions.json();
      setSessions(res.reverse());
      setRefreshingSessions(false);
    }
    if (refreshingSessions) {
      fetchData();
    }
  }, [accessToken, refreshingSessions]);

  const refreshSessions = () => {
    setRefreshingSessions(true);
  };

  const renderItem = ({item}) => (
    <ListItem
      id={item.id}
      startTime={item.startTime}
      endTime={item.endTime}
      processed={item.processed}
    />
  );

  const deleteSession = async sessionId => {
    if (accessToken) {
      const deleteSession = await fetch(`${API_BASE_URL}/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(deleteSession.status);
      setRefreshingSessions(true);
    }
  };

  const deleteSessionPopup = async (sessionId) => {
    Alert.alert(
      'Delete Session?',
      'Please Confirm',
      [
        {
          text: 'Cancel',
        },
        {
          text: 'Delete',
          onPress: () => deleteSession(sessionId),
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
        data={sessions}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        onRefresh={refreshSessions}
        refreshing={refreshingSessions}
        maxSwipeDistance={80}
        renderQuickActions={({index, item}) => QuickActions(index, item)}
      />
    </View>
  )
}

export default ActivityScreen;
