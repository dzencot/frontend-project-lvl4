import React from 'react';

const AppContext = React.createContext({
  userName: null,
  defaultChannelId: 0,
  i18n: null,
});

export default AppContext;
