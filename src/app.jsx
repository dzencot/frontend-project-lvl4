import React from 'react';
import ReactDOM from 'react-dom';
import { configureStore } from '@reduxjs/toolkit';
import { getCurrentUserName, getRandomUserName, saveCurrentUserName } from './services';

import AppContext from './AppContext';
import App from './components/App';
import reducer from './reducers';

const app = (channels) => {
  let userName = getCurrentUserName();
  if (!userName) {
    userName = getRandomUserName();
    saveCurrentUserName(userName);
  }

  const container = document.getElementById('chat');

  const store = configureStore({
    reducer,
  });
  console.log('store:', store);

  const { hostname } = window.location;
  const websocket = new WebSocket(`ws://${hostname}:8080`, 'newMessage');
  websocket.onopen = () => {
    console.log('websocket opened');
  };
  websocket.onmessage = (event) => {
    console.log('websocket event:', event);
  };

  ReactDOM.render(
    <AppContext.Provider value={{ userName }}>
      <App channels={channels} store={store} websocket={websocket} />
    </AppContext.Provider>,
    container,
  );
};

export default app;
