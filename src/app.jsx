import React from 'react';
import ReactDOM from 'react-dom';
// import io from 'socket.io-client';
import Rollbar from 'rollbar';
import { configureStore } from '@reduxjs/toolkit';
import { getCurrentUserName, getRandomUserName, saveCurrentUserName } from './utils';

import AppContext from './AppContext';
import App from './components/App';
import reducer, {
  addMessage,
  addChannel,
  renameChannel,
  removeChannel,
  selectDefaultChannel,
} from './reducers';
import './i18n';

const init = (initData, websocket) => {
  const rollbar = new Rollbar({ // eslint-disable-line no-unused-vars
    accessToken: process.env.ROLLBAR_TOKEN,
    captureUncaught: true,
    captureUnhandledRejections: true,
  });
  let userName = getCurrentUserName();
  if (!userName) {
    userName = getRandomUserName();
    saveCurrentUserName(userName);
  }

  const container = document.getElementById('chat');

  const store = configureStore({
    preloadedState: {
      ...initData,
      defaultChannelid: initData.currentChannelId,
    },
    reducer,
  });

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
  websocket.on('removeChannel', ({ data }) => {
    store.dispatch(removeChannel(data.id));
  });

  ReactDOM.render(
    <AppContext.Provider value={{ userName }}>
      <App store={store} />
    </AppContext.Provider>,
    container,
  );

  store.dispatch(selectDefaultChannel());
};

export default init;
