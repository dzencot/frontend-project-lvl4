import React from 'react';
import ReactDOM from 'react-dom';
import { configureStore } from '@reduxjs/toolkit';
import { getCurrentUserName, getRandomUserName, saveCurrentUserName } from './utils';

import AppContext from './AppContext';
import Chat from './components/Chat';

const app = (channels) => {
  let userName = getCurrentUserName();
  if (!userName) {
    userName = getRandomUserName();
    saveCurrentUserName(userName);
  }


  const container = document.getElementById('chat');

  // const store = configureStore({
  //   reducer: rootReducer,
  // });

  ReactDOM.render(
    <AppContext.Provider value={{ userName }}>
      <Chat channels={channels} />
    </AppContext.Provider>,
    container,
  );
};

export default app;
