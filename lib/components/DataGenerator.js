import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  Button
} from 'react-native';
import tailwind from 'tailwind-rn';

const DataGenerator = () => {
  const [frame, setFrame] = useState(null);
  const [sessionRunning, setSessionRunning] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [intervalRef, setIntervalRef] = useState(null);

  const sendFrame = () => {
    // Send message over websockets
    const frameVal = {
      session_id: sessionId,
      timestamp: new Date().toJSON(),
      a_x: Math.random(),
      a_y: Math.random(),
      a_z: Math.random(),
      w_x: Math.random(),
      w_y: Math.random(),
      w_z: Math.random(),
    };
    setFrame(frameVal);
  };

  const startSession = () => {
    let newId = Math.floor(Math.random() * 1000);
    setSessionRunning(true);
    setSessionId(newId);
    setIntervalRef(setInterval(sendFrame, 100));
  };

  const endSession = () => {
    clearInterval(intervalRef);
    setSessionRunning(false);
  };

  return (
    <View style={tailwind('flex flex-col')}>
      <Button 
        title="Start Session"
        onPress={startSession}
      />
      <Button 
        title="End Session"
        onPress={endSession}
      />
      { frame && Object.keys(frame).map((key, idx) => (
        <Text>{frame[key]}</Text>
      ))
      }
    </View>
  );
};

export default DataGenerator;
