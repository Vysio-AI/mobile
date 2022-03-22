import React from 'react';

const AppContext = React.createContext({
  auth0: null,
  userInfo: null,
  setUserInfo: () => {},
  accessToken: null,
  setAccessToken: () => {},
  BleManager: null,
  deviceUUID: null,
  setDeviceUUID: () => {},
  serviceUUID: null,
  setServiceUUID: () => {},
  socket: null,
});
export default AppContext;
