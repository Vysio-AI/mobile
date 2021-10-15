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
      <Text>
        Home Screen
      </Text>
      <TextInput
        value={message}
        onChangeText={setMessage}
        style={tailwind('border p-2 rounded-lg')}
        placeholder="message"
      />
      <Button onPress={sendMessageToAppleWatch} title="SEND" />
      <Text style={tailwind('pt-10 text-lg')}>Reply: {reply}</Text>
      <Text style={tailwind('pt-4 text-lg')}>Reachable: {reachable.toString()}</Text>
      <Text style={tailwind('pt-4 text-lg')}>Paired: {paired.toString()}</Text>
      <Text style={tailwind('pt-4 text-lg')}>
        Latest Accell x: {latestData?.accelerometer?.x}
      </Text>
    </View>
  );
};

export default HomeScreen;
