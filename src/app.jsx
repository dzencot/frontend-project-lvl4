import React from 'react';
import ReactDOM from 'react-dom';
// import io from 'socket.io-client';
import Rollbar from 'rollbar';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { getCurrentUserName, getRandomUserName, saveCurrentUserName } from './utils';

import AppContext from './AppContext';
import App from './components/App';

import channelsPanel, {
  addChannel,
  renameChannel,
  removeChannel,
} from './reducers/channelsPanel';

import channelChat, {
  addMessage,
} from './reducers/channelChat';

import i18nInit from './i18n';

const init = async (initData, websocket) => {
  await i18nInit();
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
  const defaultChannelId = 1;

  const container = document.getElementById('chat');

  const store = configureStore({
    preloadedState: {
      channelsPanel: {
        channels: initData.channels,
        currentChannelId: defaultChannelId,
      },
      channelChat: {
        messages: initData.messages,
      },
    },
    reducer: {
      channelsPanel,
      channelChat,
    },
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
    <Provider store={store}>
      <AppContext.Provider value={{ userName, defaultChannelId }}>
        <App />
      </AppContext.Provider>
    </Provider>,
    container,
  );
};

export default init;
