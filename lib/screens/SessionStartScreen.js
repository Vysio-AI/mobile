import React, {useState, useContext, useEffect} from 'react';
import {getColor} from 'tailwind-rn';
import tailwind from 'tailwind-rn';
import {
  Text,
  Button,
  Pressable,
  View,
  ActivityIndicator
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {CheckIcon, ExclamationIcon} from "react-native-heroicons/outline";

import AppContext from '../AppContext';

import {useQuery} from 'react-query';
import {getPlans, getAllExercisesForPlan} from '../api/plans';

const DEBUG_MODE = false;

const SessionStartScreen = ({navigation}) => {
  const {accessToken, userInfo, BleManager, deviceUUID, setDeviceUUID, serviceUUID, setServiceUUID} = useContext(AppContext);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [selectedPlanName, setSelectedPlanName] = useState(null);

  const [bleStackPoweredOn, setBleStackPoweredOn] = useState(false);
  const [bleConnected, setBleConnected] = useState(false);

  const plans = useQuery(['plans', userInfo.id, accessToken], () => getPlans(userInfo.id, accessToken));

  const exercises = useQuery(['exercises', selectedPlanId, accessToken], () => getAllExercisesForPlan(selectedPlanId, accessToken));

  const startSession = () => {
    navigation.navigate('Session Running', {
      planId: selectedPlanId,
      practitionerId: plans.data[0].practitionerId
    });
  }

  const scanAndConnect = () => {
    if (bleConnected) {
      return
    }
    BleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        // Handle error (scanning will be stopped automatically)
        return
      }

      console.log("Scanning...")

      // Check if it is a device you are looking for based on advertisement data
      // or other criteria
      if (device.name === 'Arduino') {
        // Stop scanning since device is found
        BleManager.stopDeviceScan();
        // Proceed with connection
        device.connect()
          .then((device) => {
            console.log("Discovering services and characteristics")
            console.log(`MTU: ${device.mtu}`)
            return device.discoverAllServicesAndCharacteristics()
          })
          .then((device) => {
            return device.requestMTU(185)
          })
          .then((device) => {
            console.log(`MTU: ${device.mtu}`)
            BleManager.onDeviceDisconnected(device.id, (error, device) => {
              setDeviceUUID(null);
              setServiceUUID(null);
            })
            setBleConnected(true)
            setDeviceUUID(device.id);
            return device.services();
          })
          .then((services) => {
            const imuService = services[0];
            setServiceUUID(imuService.uuid);
          })
          .catch((error) => {
            // Handle errors
          });
      }
    });
  }

  useEffect(() => {
    if (BleManager && !bleConnected) {
      const subscription = BleManager.onStateChange((state) => {
        if (state === 'PoweredOn') {
          if (deviceUUID && serviceUUID) {
            BleManager.isDeviceConnected(deviceUUID).then((result) => {
              if (result) {
                console.log("Device already connected")
                setBleConnected(true)
              } else {
                scanAndConnect();
                setBleStackPoweredOn(true);
                subscription.remove();
              }
            })
          } else {
            scanAndConnect();
            setBleStackPoweredOn(true);
            subscription.remove();
          }
        }
      }, true);
    }
  }, [BleManager, deviceUUID, serviceUUID])

  if (plans.data && plans.data?.[0] && !selectedPlanId) {
    setSelectedPlanId(plans.data[0].id)
    setSelectedPlanName(plans.data[0].name)
  }

  return (
    <View style={tailwind('flex flex-col')}>
      <View style={tailwind('flex flex-row justify-center pt-10')}>
        <Text style={tailwind('text-xl font-bold')}>
          Select a plan
        </Text>
      </View>
      <Picker
        style={tailwind('-mt-10 -mb-16')}
        selectedValue={selectedPlanId}
        onValueChange={(itemValue, itemIndex) => {
          setSelectedPlanId(itemValue);
          setSelectedPlanName(plans.data[itemIndex].name)
        }}
      >
        {
          plans.data && plans.data.map(plan => (
            <Picker.Item label={plan.name} value={plan.id} key={plan.id}/>
          ))
        }
      </Picker>
      <View style={tailwind('w-full flex flex-col justify-center p-2 pb-6 border border-gray-50 bg-white')}>
        <Text style={tailwind("text-xl font-bold mb-2 mt-2 pl-4")}>{selectedPlanName}</Text>
        <View style={tailwind("w-1/2 mx-4 border border-gray-200 mb-4")}></View>
        { exercises.data && exercises.data.map(ex => (
            <View key={ex.id} style={tailwind('w-full flex flex-row justify-between px-2 mx-2')}>
              <Text>{ex.activityType}</Text>
              <Text>{ex.duration}s</Text>
            </View>
          ))
        }
      </View>
      { DEBUG_MODE &&
      <View style={tailwind('bg-white m-2 p-3 rounded-lg border border-gray-100')}>
        <Text style={tailwind('text-gray-600 text-sm')}>BLE Stack Power: {bleStackPoweredOn ? "On" : "Off"}</Text>
        <Text style={tailwind('text-gray-600 text-sm')}>BLE Connected: {bleConnected ? "True": "False"}</Text>
        <Text style={tailwind('text-gray-600 text-sm')}>Device UUID: {deviceUUID}</Text>
        <Text style={tailwind('text-gray-600 text-sm')}>IMU Service UUID: {imuServiceUUID}</Text>
      </View>
      }
      { !DEBUG_MODE &&
      <View style={tailwind('bg-white m-2 p-3 rounded-lg border border-gray-100')}>
        { bleConnected &&
          <View style={tailwind('flex flex-row w-3/4 justify-start items-center')}>
            <Text style={tailwind('mr-2 text-base')}>Connected</Text>
            <CheckIcon size={25}/>
          </View>
        }
        { !bleConnected &&
          <View style={tailwind('flex flex-row w-full justify-start items-center')}>
            <Text style={tailwind('mr-2 text-base')}>Connecting</Text>
            <ActivityIndicator size="small" color="#0000ff" />
          </View>
        }
      </View>
      }
      <View style={tailwind('bg-yellow-100 m-2 p-3 rounded-lg border border-gray-100 flex flex-row')}>
        <ExclamationIcon size={25} style={tailwind('text-yellow-400 mr-2')}/>
        <Text style={tailwind('mr-2 text-base')}>For your safety make sure the area around you is clear of obstacles</Text>
      </View>
      <View style={tailwind('w-full flex flex-row justify-center mt-6')}>
        <Pressable
          onPress={startSession}
          style={tailwind('bg-blue-400 rounded-lg px-4 py-3')}
          disabled={!bleConnected}
        >
          <Text style={tailwind('text-white text-lg font-bold')}>Continue</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default SessionStartScreen;