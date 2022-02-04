import React, {useState, useContext, useRef} from 'react';
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

import {API_BASE_URL} from "@env"

const SessionRunningScreen = ({navigation}) => {
  const camera = useRef(null);
  const [session, setSession] = useState(null);
  const [recording, setRecording] = useState(null);
  const [recordingURI, setRecordingURI] = useState(null);
  const [videoId, setVideoId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const {accessToken} = useContext(AppContext);

  const startSession = async () => {
    const startTime = new Date().toISOString();
    const reqData = JSON.stringify({
      planId: 1,
      startTime: startTime,
    });

    console.log(reqData);

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

    console.log(res);
    console.log(recordingPromise);
    setSession(res);
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
    console.log(result);

    // End the session
    const fetchSession = await fetch(`${API_BASE_URL}/sessions/${session.id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: reqData,
    });

    const res = await fetchSession.json();

    // Save the video
    const createVideoData = JSON.stringify({
      fileName: `${res.id}-recording.mp4`,
      sessionId: res.id,
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
    console.log(createVideoRes);
    setVideoId(createVideoRes.id);
  
    await uploadImage(
      createVideoRes.uploadSignedUrl,
      result.uri,
    );
    console.log(res);
    setSession(res);
  };

  const getBlob = async (fileUri) => {
    const resp = await fetch(fileUri);
    const imageBody = await resp.blob();
    return imageBody;
  };

  const uploadImage = async (uploadUrl, data) => {
    setUploading(true);
    console.log(data);
    const imageBody = await getBlob(data);

    fetch(uploadUrl, {
      headers: {
        'Content-Type': 'video/mp4',
      },
      method: 'PUT',
      body: imageBody,
    })
    .then((result) => {
      console.log(result.statusText);
      return "OK";
    })
    .catch((error) => {
      console.log(error);
      return "ERR";
    });

    setUploading(false);
  };

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
          { !recording &&
            <TouchableOpacity
              style={tailwind('bg-white border border-4 border-gray-100 rounded-full w-20 h-20 flex items-center justify-center')}
              onPress={startSession}>
              <View style={tailwind('bg-red-600 h-6 w-6 rounded-full')}>
              </View>
            </TouchableOpacity>
          }
          { recording && 
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
