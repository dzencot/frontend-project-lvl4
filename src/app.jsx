import React from 'react';
import ReactDOM from 'react-dom';
import { configureStore } from '@reduxjs/toolkit';
import { getCurrentUserName, getRandomUserName, saveCurrentUserName } from './services';

import AppContext from './AppContext';
import App from './components/App';
import rootReducer from './reducers';

const app = (channels) => {
  let userName = getCurrentUserName();
  if (!userName) {
    userName = getRandomUserName();
    saveCurrentUserName(userName);
  }


  const container = document.getElementById('chat');

  const store = configureStore({
    reducer: rootReducer,
  });

  ReactDOM.render(
    <AppContext.Provider value={{ userName }} store={store}>
      <App channels={channels} />
    </AppContext.Provider>,
    container,
  );
};

export default app;
