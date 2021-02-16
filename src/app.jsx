import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import { configureStore } from '@reduxjs/toolkit';
import { getCurrentUserName, getRandomUserName, saveCurrentUserName } from './services';

import AppContext from './AppContext';
import App from './components/App';
import reducer, { addMessage, addChannel, renameChannel } from './reducers';
import { selectChannel } from './api';

const app = (channels) => {
  let userName = getCurrentUserName();
  if (!userName) {
    userName = getRandomUserName();
    saveCurrentUserName(userName);
  }

  const container = document.getElementById('chat');

  const store = configureStore({
    preloadedState: {
      messages: [],
      channels,
    },
    reducer,
  });

  const websocket = io();
  websocket.on('newMessage', ({ data: { attributes: message } }) => {
    store.dispatch(addMessage(message));
  });
  websocket.on('newChannel', ({ data: { attributes } }) => {
    const newChannel = {
      id: attributes.id,
      name: attributes.name,
      removable: attributes.removable,
    };
    store.dispatch(addChannel(newChannel));
  });
  websocket.on('renameChannel', ({ data: { attributes } }) => {
    const channelData = {
      id: attributes.id,
      name: attributes.name,
      removable: attributes.removable,
    };
    store.dispatch(renameChannel(channelData));
  });

  ReactDOM.render(
    <AppContext.Provider value={{ userName }}>
      <App store={store} />
    </AppContext.Provider>,
    container,
  );

  selectChannel(1)(store.dispatch);
};

export default app;
