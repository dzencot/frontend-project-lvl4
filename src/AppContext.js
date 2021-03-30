import React from 'react';

const AppContext = React.createContext({
  userName: null,
  defaultChannelId: 0,
});

export default AppContext;
