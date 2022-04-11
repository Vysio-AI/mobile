import React, {useState, useContext, useEffect, useRef} from 'react';
import tailwind from 'tailwind-rn';
import {
  Text,
  TextInput,
  Button,
  Pressable,
  View,
  ActivityIndicator
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {CheckIcon} from "react-native-heroicons/outline";

import CheckBox from '@react-native-community/checkbox';

import AppContext from '../AppContext';

import {useQuery, useMutation, useQueryClient} from 'react-query';
import {getPlan} from '../api/plans';
import {updateSession, notifySession} from '../api/sessions';

const SessionEndScreen = ({route, navigation}) => {
  const {accessToken} = useContext(AppContext);
  const {session, sessionId, planId} = route.params;
  const [notes, setNotes] = useState("");
  const [sendNotification, setSendNotification] = useState(false);
  const [inputsDisabled, setInputsDisabled] = useState(true);

  const queryClient = useQueryClient();

  const plan = useQuery(['plan', planId, accessToken], () => getPlan(planId, accessToken));

  const updateSessionMutation = useMutation(({ sessionId, updateData, accessToken }) => updateSession(sessionId, updateData, accessToken), {
    onSuccess: () => {
      navigation.navigate('Main', { screen: 'Home'})
      return queryClient.invalidateQueries('sessions')
    },
  })

  const notifySessionMutation = useMutation(({ sessionId, practitionerId, accessToken }) => notifySession(sessionId, practitionerId, accessToken));

  const notesRef = useRef(null);

  const saveNotes = () => {
    if (sendNotification) {
      notifySessionMutation.mutate({
        sessionId: sessionId,
        practitionerId: plan.data.practitionerId,
        accessToken: accessToken
      })
    }

    updateSessionMutation.mutate({
      sessionId: sessionId,
      updateData: {
        clientNotes: notes
      },
      accessToken: accessToken
    })
  }

  if (inputsDisabled && !plan.isLoading && plan.data) {
    setInputsDisabled(false)
  }

  return (
    <View style={tailwind('flex flex-col h-full p-4 justify-between')}>
      <View>
        <View style={tailwind('border-b pb-3 w-1/3')}>
          <Text style={tailwind('text-2xl font-bold')}>Any notes?</Text>
        </View>
        <TextInput
          multiline
          style={tailwind('h-1/2 mt-2 text-base')}
          ref={notesRef}
          onSubmitEditing={() => notesRef.current.blur()}
          onChangeText={setNotes}
          value={notes}
          placeholder="Write your notes here..."
        />
      </View>
      <View style={tailwind('flex flex-col')}>
        <View style={tailwind('flex flex-row items-center justify-center')}>
          <CheckBox
            disabled={inputsDisabled}
            value={sendNotification}
            onValueChange={(newValue) => setSendNotification(newValue)}
          />
          <Text style={tailwind('text-lg font-semibold pl-3')}>
            Send session notification
          </Text>
        </View>
        <View style={tailwind('w-full flex flex-row justify-center mt-4')}>
          <Pressable
            onPress={saveNotes}
            disabled={inputsDisabled}
            style={tailwind('bg-blue-400 rounded-lg px-8 py-3 mb-10')}
          >
            <Text style={tailwind('text-white text-lg font-bold')}>Save</Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}

export default SessionEndScreen;