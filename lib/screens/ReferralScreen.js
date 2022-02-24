import React, {useState, useContext, useEffect, createRef} from 'react';
import tailwind from 'tailwind-rn';
import {
  SafeAreaView,
  Text,
  Button,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  BackHandler,
} from 'react-native';
import AppContext from '../AppContext';

import { useMutation } from 'react-query';
import { validateReferral } from '../api/invites';

const ReferralScreen = ({navigation}) => {
  const {accessToken} = useContext(AppContext);
  const [referralCode, setReferralCode] = useState('');
  const [error, setError] = useState(null);
  const [referralRef, setReferralRef] = useState(null);

  const validateReferralCode = useMutation(({ code, accessToken }) => validateReferral(code, accessToken), {
    onSuccess: () => {
      navigation.reset({
        index: 0,
        routes: [{name: 'Main'}],
      });
    },
    onError: () => {
      setError("Sorry, that referral code isn't valid.");
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  })

  const handleSubmit = () => {
    // Add the referral code to the user account & check if valid
    // If it is valid, create the account and redirect to main
    // If it is not valid, set the error on the page
    if (referralCode === "") {
      return
    }
    validateReferralCode.mutate({
      code: referralCode,
      accessToken: accessToken
    })
    setReferralCode('');
    referralRef.current.blur();
  };

  useEffect(() => {
    setReferralRef(createRef());
  }, []);

  return (
    <View style={tailwind('w-full h-full flex flex-col items-center justify-start bg-gray-50')}>
      <Image
        style={tailwind('w-40 mt-32')}
        resizeMode="contain"
        source={require('../../images/vysio-logo.png')}
      />
      <View style={tailwind('w-5/6 flex flex-col')}>
        <Text style={tailwind('text-sm font-bold mb-1')}>
          Please enter your referral code
        </Text>
        <TextInput
          value={referralCode}
          onChangeText={text => {
            if (text.length <= 10) {
              setReferralCode(text);
            }
          }}
          autoCapitalize='none'
          ref={referralRef}
          autoCorrect={false}
          multiline={true}
          style={tailwind('border p-2 rounded-lg h-12 w-full border-gray-300 bg-gray-200 font-semibold text-lg')}
        />
        {error && (
          <Text style={tailwind('text-sm font-bold mb-1 text-red-600')}>
            {error}
          </Text>
        )}
      </View>
      <TouchableOpacity
        style={tailwind('bg-blue-400 border border-blue-500 rounded-lg w-32 h-14 flex items-center justify-center mt-4')}
        onPress={handleSubmit}>
        <Text style={tailwind('text-white font-semibold text-lg')}>
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default ReferralScreen;
