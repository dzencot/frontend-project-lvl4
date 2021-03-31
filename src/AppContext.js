import React from 'react';

const AppContext = React.createContext({
  userName: null,
  defaultChannelId: 1,
  i18n: null,
});

export default AppContext;
