import React from 'react';

const AppContext = React.createContext({
  userName: '',
  setUserName: (userName) => {
    this.userName = userName;
  },
});

export default AppContext;
