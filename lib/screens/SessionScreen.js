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

const SessionScreen = ({navigation}) => {
  const camera = useRef(null);
  const [session, setSession] = useState(null);
  const [recording, setRecording] = useState(null);
  const [recordingURI, setRecordingURI] = useState(null);
  const [videoId, setVideoId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const {accessToken} = useContext(AppContext);

  // Start end Finish session modals
  const [startModalOpen, setStartModalOpen] = useState(true);
  const [endModalOpen, setEndModalOpen] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setStartModalOpen(true);
    }, [])
  );

  const startSession = async () => {
    const startTime = new Date().toISOString();
    const reqData = JSON.stringify({
      protocolId: 1,
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
    const fetchSession = await fetch(`${API_BASE_URL}/sessions/${session.data.id}`, {
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
      fileName: `${res.data.id}-recording.mp4`,
      sessionId: res.data.id,
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
    setVideoId(createVideoRes.data.id);
  
    await uploadImage(
      createVideoRes.data.uploadSignedUrl,
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
      <Modal animationType="slide" transparent={false} visible={startModalOpen}>
        <View style={tailwind('w-full h-full bg-gray-100')}>
          <View style={tailwind('bg-white border border-gray-100 p-3 my-64 mx-4 rounded-2xl h-1/2')}>
              <Text style={tailwind('font-bold px-2 py-1 text-2xl')}>Your Plan</Text>
              <View style={tailwind('border-b-2 w-28 mx-2 border-gray-300')}></View>
              <View
                style={tailwind('flex flex-col items-center justify-start w-full h-full mt-4')}
              >
                <View style={tailwind('flex flex-row w-full py-1 px-2 items-center justify-between')}>
                  <Text style={tailwind('font-bold text-lg')}>Forward Elevation</Text>
                  <Text style={tailwind('font-semibold')}>30s</Text>
                </View>
                <View style={tailwind('flex flex-row w-full py-1 px-2 items-center justify-between')}>
                  <Text style={tailwind('font-bold text-lg')}>Trap Rotation</Text>
                  <Text style={tailwind('font-semibold')}>45s</Text>
                </View>
                <Pressable
                  onPress={() => setStartModalOpen(false)}
                  style={tailwind('bg-blue-400 px-5 py-2 my-36 rounded-lg')}
                >
                  <Text style={tailwind('font-bold text-white text-lg')}>Let's Go</Text>
                </Pressable>
              </View>
          </View>
        </View>
      </Modal>
      { !startModalOpen && !endModalOpen &&
        <>
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
        </>
      }
    </View>
  );
};

export default SessionScreen;
