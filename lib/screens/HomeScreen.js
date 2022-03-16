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
import {decode as atob} from 'base-64';

const HomeScreen = ({navigation}) => {
  const {BleManager} = useContext(AppContext);
  const [bleStackPoweredOn, setBleStackPoweredOn] = useState(false);
  const [bleConnected, setBleConnected] = useState(false);
  const [deviceUUID, setDeviceUUID] = useState(null);
  const [imuServiceUUID, setImuServiceUUID] = useState(null);
  const [characteristicValues, setCharacteristicValues] = useState([]);

  const base64ToArrayBuffer = (base64) => {
    var binary_string = atob(base64)
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  const convertFloatCharacteristic = (value) => {
    console.log("Converting char")
    let uint8Array = base64ToArrayBuffer(value);
    let dv = new DataView(uint8Array);
    return dv.getFloat32(0, true);
  }

  const convertTimestampCharacteristic = (value) => {
    let uint8Array = base64ToArrayBuffer(value);
    let dv = new DataView(uint8Array);
    return dv.getUint32(0, true);
  }

  const readCharacteristics = async () => {
    let results = []
    for (let i = 2; i <= 7; i++) {
      console.log(`Reading characteristic ${i}`)
      let characteristicUUID = `00000000-0000-0000-0000-00000000000${i}`;
      let result = await BleManager.readCharacteristicForDevice(deviceUUID, imuServiceUUID, characteristicUUID)
      console.log(`Success reading characteristic ${i}`)
      results.push(convertFloatCharacteristic(result.value))
    }
    let timestampUUID = `00000000-0000-0000-0000-000000000008`;
    let timestampResult = await BleManager.readCharacteristicForDevice(deviceUUID, imuServiceUUID, timestampUUID);
    results.push(convertTimestampCharacteristic(timestampResult.value))
    return results
  }

  const fetchUpdatedCharacteristics = () => {
    readCharacteristics().then((values) => {
      console.log("Read results")
      setCharacteristicValues(values)
      console.log(values)
    })
    .catch((error) => {
      // Handle errors
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
        console.log("Found")
        // Stop scanning since device is found
        BleManager.stopDeviceScan();
        // Proceed with connection
        device.connect()
          .then((device) => {
            console.log("Discovering services and characteristics")
            return device.discoverAllServicesAndCharacteristics()
          })
          .then((device) => {
            setBleConnected(true)
            setDeviceUUID(device.id);
            return device.services();
          })
          .then((services) => {
            const imuService = services[0];
            setImuServiceUUID(imuService.uuid);
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
          scanAndConnect();
          setBleStackPoweredOn(true);
          subscription.remove();
        }
      }, true);
    }
  }, [BleManager])

  useEffect(() => {
    if (BleManager && deviceUUID && imuServiceUUID) {
      console.log("Reading characteristics now...")
      readCharacteristics().then((values) => {
        console.log("Read results")
        setCharacteristicValues(values)
        console.log(values)
      })
      .catch((error) => {
        // Handle errors
      });
    }
  }, [BleManager, deviceUUID, imuServiceUUID])

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
      <View>
        <View style={tailwind('bg-white m-2 p-3 rounded-lg border border-gray-100')}>
          <Text style={tailwind('text-gray-600 text-sm')}>BLE Stack Power: {bleStackPoweredOn ? "On" : "Off"}</Text>
          <Text style={tailwind('text-gray-600 text-sm')}>BLE Connected: {bleConnected ? "True": "False"}</Text>
          <Text style={tailwind('text-gray-600 text-sm')}>Device UUID: {deviceUUID}</Text>
          <Text style={tailwind('text-gray-600 text-sm')}>IMU Service UUID: {imuServiceUUID}</Text>
        </View>
        <Pressable
            style={tailwind('bg-blue-400 rounded-lg px-6 py-3')}
            onPress={fetchUpdatedCharacteristics}
          >
          <Text style={tailwind('text-white font-bold')}>Update Values</Text>
        </Pressable>
        <View style={tailwind('bg-white m-2 p-3 rounded-lg border border-gray-100')}>
          <Text style={tailwind('text-gray-600 text-sm')}>a_x: {characteristicValues?.[0]}</Text>
          <Text style={tailwind('text-gray-600 text-sm')}>a_y: {characteristicValues?.[1]}</Text>
          <Text style={tailwind('text-gray-600 text-sm')}>a_z: {characteristicValues?.[2]}</Text>
          <Text style={tailwind('text-gray-600 text-sm')}>g_x: {characteristicValues?.[3]}</Text>
          <Text style={tailwind('text-gray-600 text-sm')}>g_y: {characteristicValues?.[4]}</Text>
          <Text style={tailwind('text-gray-600 text-sm')}>g_z: {characteristicValues?.[5]}</Text>
          <Text style={tailwind('text-gray-600 text-sm')}>timestamp: {characteristicValues?.[6]}</Text>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
