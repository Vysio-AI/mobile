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

import AppContext from '../AppContext';

import {useQuery, useMutation, useQueryClient} from 'react-query';
import {getPlan} from '../api/plans';
import {updateSession} from '../api/sessions';

const SessionEndScreen = ({route, navigation}) => {
  const {accessToken} = useContext(AppContext);
  const {session, sessionId, planId} = route.params;
  const [notes, setNotes] = useState("");

  const queryClient = useQueryClient();

  const plan = useQuery(['plan', planId, accessToken], () => getPlan(planId, accessToken));

  const updateSessionMutation = useMutation(({ sessionId, updateData, accessToken }) => updateSession(sessionId, updateData, accessToken), {
    onSuccess: () => {
      navigation.navigate('Main', { screen: 'Home'})
      return queryClient.invalidateQueries('sessions')
    },
  })

  const notesRef = useRef(null);

  const saveNotes = () => {
    updateSessionMutation.mutate({
      sessionId: sessionId,
      updateData: {
        clientNotes: notes
      },
      accessToken: accessToken
    })
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
      <View style={tailwind('w-full flex flex-row justify-center mt-6')}>
        <Pressable
          onPress={saveNotes}
          style={tailwind('bg-blue-400 rounded-lg px-8 py-3 mb-10')}
        >
          <Text style={tailwind('text-white text-lg font-bold')}>Done</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default SessionEndScreen;