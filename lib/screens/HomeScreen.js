import React, {useState, useContext, useEffect} from 'react';
import tailwind from 'tailwind-rn';
import {
  SafeAreaView,
  Text,
  Button,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  Pressable,
  ToastAndroid,
} from 'react-native';
import AppContext from '../AppContext';

import {
  getReachability,
  getIsPaired,
  sendMessage,
  watchEvents,
} from 'react-native-watch-connectivity';

const HomeScreen = ({navigation}) => {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');
  const [reachable, setReachable] = useState(false);
  const [paired, setPaired] = useState(false);
  const [latestData, setLatestData] = useState(null);

  const sendMessageToAppleWatch = () => {
    sendMessage({text: message}, reply => {
      setReply(reply.text);
    });
    setMessage('');
  };

  useEffect(() => {
    watchEvents.on('message', (message, reply) => {
      setLatestData(message);
      reply({text: 'Ack'});
    });
  }, []);

  useEffect(() => {
    (async () => {
      const isReachable = await getReachability();
      const isPaired = await getIsPaired();
      return [isReachable, isPaired];
    })().then(result => {
      setReachable(result[0]);
      setPaired(result[1]);
    });
  });

  return (
    <View style={tailwind('h-full w-full flex flex-col bg-gray-50')}>
      <View style={tailwind('bg-white m-2 p-3 rounded-lg border border-gray-100')}>
        <Text style={tailwind('text-gray-400 text-sm')}>Next Session</Text>
        <Text style={tailwind('text-2xl font-bold')}>Shoulder Routine</Text>
        <View style={tailwind('flex flex-row justify-between items-center')}>
          <Text style={tailwind('font-bold text-sm text-gray-600')}>5 Exercises</Text>
          <Pressable
            style={tailwind('bg-blue-400 rounded-lg px-6 py-3')}
            onPress={() => Alert.alert('Pressed')}
          >
            <Text style={tailwind('text-white font-bold')}>Start</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
