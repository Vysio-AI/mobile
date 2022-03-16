import React from 'react';

const AppContext = React.createContext({
  auth0: null,
  userInfo: null,
  setUserInfo: () => {},
  accessToken: null,
  setAccessToken: () => {},
  BleManager: null,
});
export default AppContext;
