/* eslint no-param-reassign: ["error", { "props": false }] */
import { combineReducers } from 'redux';
import { createSlice } from '@reduxjs/toolkit';
import { getMessages } from './services.js';

const initialState = {
  name: null,
  id: null,
  messages: [],
  isLoading: false,
  error: null,
};

const appReducer = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    getMessagesStart: (state) => {
      state.isLoading = true;
    },
    getMessagesSuccess: (state, { payload }) => {
      console.log(payload);
    },
    getMessagesFailure: (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
    },
  },
});

const rootReducer = combineReducers({
  appReducer: appReducer.reducer,
});

export const {
  getMessagesStart,
  getMessagesSuccess,
  getMessagesFailure,
} = appReducer.actions;

export const fetchMessages = async (dispatch) => {
  try {
    const messages = await getMessages();
    console.log(messages);
    dispatch(getMessagesSuccess(messages));
  } catch (err) {
    dispatch(getMessagesFailure(err.toString()));
  }
};

export default rootReducer;
