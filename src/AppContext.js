import React from 'react';

const AppContext = React.createContext({
  userName: '',
  setUserName: '',
  defaultChannelId: 0,
});

export default AppContext;
