import React, {useState, useContext, useRef, useEffect} from 'react';
import tailwind from 'tailwind-rn';
import {
  SafeAreaView,
  Text,
  Button,
  View,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable,
  TabBarIOSItem,
} from 'react-native';
import AppContext from '../AppContext';
import {RNCamera} from 'react-native-camera';
import {useFocusEffect} from '@react-navigation/native';
import DonutChart from '../components/DonutChart';
import {PauseIcon} from "react-native-heroicons/solid";

import {decode as atob} from 'base-64';

import {API_BASE_URL} from "@env"

const exerciseMap = {
  "0": "PENDULUM",
  "1": "ABDUCTION",
  "2": "FORWARD_ELEVATION",
  "3": "INTERNAL_ROTATION",
  "4": "TRAPEZIUS_EXTENSION",
  "5": "UPRIGHT_ROW",
  "6": "None"
}

const SessionRunningScreen = ({route, navigation}) => {
  const camera = useRef(null);
  const [session, setSession] = useState(null);
  const [sessionRunning, setSessionRunning] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [recording, setRecording] = useState(null);
  const [recordingURI, setRecordingURI] = useState(null);
  const [videoId, setVideoId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const {accessToken, BleManager, deviceUUID, serviceUUID, userInfo, socket} = useContext(AppContext);

  // Classification data
  const [currentClassification, setCurrentClassification] = useState(0);
  const [classificationCounts, setClassificationCounts] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [frequency, setFrequency] = useState(0);

  const [classificationLatencies, setClassificationLatencies] = useState([]);

  const {planId, practitionerId} = route.params;
  const [characteristicValues, setCharacteristicValues] = useState([]);

  const startSession = async () => {
    const startTime = new Date().toISOString();
    const reqData = JSON.stringify({
      planId: planId,
      practitionerId: practitionerId,
      clientId: userInfo.id,
      startTime: startTime,
    });

    const fetchSession = await fetch(`${API_BASE_URL}/sessions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: reqData,
    });

    const res = await fetchSession.json();

    const recordingPromise = camera.current.recordAsync({
      quality: RNCamera.Constants.VideoQuality['720p'],
      orientation: 'portrait',
      codec: RNCamera.Constants.VideoCodec['H264'],
    });

    setRecording(recordingPromise);
    setSession(res);
    setSessionRunning(true);
  };

  const endSession = async () => {
    if (session == null) {
      return;
    }
    const endTime = new Date().toISOString();
    const reqData = JSON.stringify({
      endTime: endTime,
    });

    const isRecording = await camera.current.isRecording();
    if (!isRecording) {
      setRecording(false);
      setSession(null);
      setRecordingURI(null);
      setUploading(false);
      return;
    }

    camera.current.stopRecording();
    const result = await recording;
    setRecording(false);

    // End the session
    const fetchSession = await fetch(`${API_BASE_URL}/sessions/${session.id}/end`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: reqData,
    });

    const res = await fetchSession.json();
    setSessionRunning(false)
    BleManager.cancelTransaction("1")
    console.log(classificationLatencies)

    // Save the video
    const createVideoData = JSON.stringify({
      fileName: `${session.id}-recording.mp4`,
      sessionId: session.id,
    });
    const createVideo = await fetch(`${API_BASE_URL}/videos`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: createVideoData,
    });
    
    const createVideoRes = await createVideo.json();
    setVideoId(createVideoRes.id);
  
    await uploadImage(
      createVideoRes.uploadSignedUrl,
      result.uri,
    );

    setSession(res);
    setSessionComplete(true);
    navigation.navigate('Session End', {
      session: session,
      sessionId: session.id,
      planId: planId
    });
  };

  const getBlob = async (fileUri) => {
    const resp = await fetch(fileUri);
    const imageBody = await resp.blob();
    return imageBody;
  };

  const uploadImage = async (uploadUrl, data) => {
    setUploading(true);
    const imageBody = await getBlob(data);

    fetch(uploadUrl, {
      headers: {
        'Content-Type': 'video/mp4',
      },
      method: 'PUT',
      body: imageBody,
    })
    .then((result) => {
      return "OK";
    })
    .catch((error) => {
      return "ERR";
    });

    setUploading(false);
  };

  const base64ToArrayBuffer = (base64) => {
    var binary_string = atob(base64)
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  useEffect(() => {
    if (BleManager && deviceUUID && serviceUUID && sessionRunning) {
      console.log("Start reading IMU...")
      //fetchUpdatedCharacteristics()
      let start = Date.now()
      let counter = 0;
      BleManager.monitorCharacteristicForDevice(
        deviceUUID,
        serviceUUID,
        '00000000-0000-0000-0000-000000000009',
        (error, characteristic) => {
          let buffer = base64ToArrayBuffer(characteristic.value);
          let dataView = new DataView(buffer);

          // Read floats from DataView
          let values = []
          for (let offset = 0; offset < 24; offset += 4) {
            values.push(dataView.getFloat32(offset, true))
          }
          values.push(dataView.getUint32(24, true));

          // Set characteristics and update counter
          setCharacteristicValues(values);
          counter += 1
          if (counter % 10 == 0) {
            setFrequency(counter / ((Date.now() - start) / 1000))
          }

          // Emit data to backend using websockets
          let timestamp = new Date();
          timestamp = timestamp.toJSON();

          socket.emit("session-frame", {
            session_id: session.id,
            user_id: userInfo.id,
            a_x: values[0],
            a_y: values[1],
            a_z: values[2],
            w_x: values[3],
            w_y: values[4],
            w_z: values[5],
            timestamp: Date.now(),
          })
        },
        '1'
      )
      console.log("Start listening for classifications")
      socket.on(`session-frame:${session.id}`, (msg) => {
        console.log(msg);
        setClassificationLatencies(prevVal => [...prevVal, Date.now() - msg.end_time])
        setCurrentClassification(msg.classification)
      });
    } else {
      console.log("IMU read not started")
    }
  }, [BleManager, deviceUUID, serviceUUID, sessionRunning, socket])

  return (
    <View style={tailwind('h-full w-full flex flex-col items-center bg-gray-50')}>
      <RNCamera
        style={tailwind('h-full w-full')}
        ref={camera}
        type={RNCamera.Constants.Type.front}
      />
      <View style={tailwind('absolute bottom-10')}>
        { uploading && <Text style={tailwind('text-white text-lg')}>Uploading...</Text>}
        {/* <Text style={tailwind('text-white text-lg')}>Session Start: {session?.data?.startTime}</Text>
        <Text style={tailwind('text-white text-lg')}>Session End: {session?.data?.endTime}</Text>
        <Text style={tailwind('text-white text-lg')}>Video Id: {videoId}</Text> */}
        <Text style={tailwind('text-white text-base')}>Current Exercise: {exerciseMap[currentClassification]}</Text>
        <Text style={tailwind('text-white text-sm')}>a_x: {characteristicValues?.[0]}</Text>
        <Text style={tailwind('text-white text-sm')}>a_y: {characteristicValues?.[1]}</Text>
        <Text style={tailwind('text-white text-sm')}>a_z: {characteristicValues?.[2]}</Text>
        <Text style={tailwind('text-white text-sm')}>g_x: {characteristicValues?.[3]}</Text>
        <Text style={tailwind('text-white text-sm')}>g_y: {characteristicValues?.[4]}</Text>
        <Text style={tailwind('text-white text-sm')}>g_z: {characteristicValues?.[5]}</Text>
        <Text style={tailwind('text-white text-sm')}>timestamp: {characteristicValues?.[6]}</Text>
        <Text style={tailwind('text-white text-sm')}>frequency: {frequency} Hz</Text>
        <View style={tailwind('w-full flex flex-row flex-wrap')}>
          <DonutChart />
          <DonutChart />
          <DonutChart />
          <DonutChart />
          <DonutChart />
          <DonutChart />
          <DonutChart />
        </View>
        <View style={tailwind('flex flex-row items-center justify-center pt-2')}>
          { !sessionRunning &&
            <TouchableOpacity
              style={tailwind('bg-white border border-4 border-gray-100 rounded-full w-20 h-20 flex items-center justify-center')}
              onPress={startSession}>
              <View style={tailwind('bg-red-600 h-20 w-20 rounded-full border border-2 border-white')}>
              </View>
            </TouchableOpacity>
          }
          { sessionRunning && 
            <Pressable onPress={endSession} style={tailwind('rounded-full w-20 h-20 bg-red-600 flex items-center justify-center')}>
              <PauseIcon size={100} fill="#ffffff"/>
            </Pressable>
          }
        </View>
      </View>
  </View>
  );
};

export default SessionRunningScreen;
