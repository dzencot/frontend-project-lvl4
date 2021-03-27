import React from 'react';

const AppContext = React.createContext({
  userName: '',
  defaultChannelId: 0,
});

export default AppContext;
