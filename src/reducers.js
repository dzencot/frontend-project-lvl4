/* eslint-disable no-param-reassign */
import { createAction, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import routes from './routes';

const initialState = {
  messages: [],
  selectedChannelId: null,
  createMessageState: 'none',
  createMessageError: null,
  getMessagesState: 'none',
  getMessageError: null,
};

const appSlice = createSlice({
  name: 'slackSlice',
  initialState,
  reducers: {
    createMessageStart: (state) => {
      state.createMessageState = 'requesting';
    },
    createMessageSuccess: (state, action) => {
      state.messages.push(action.payload);
      state.createMessageState = 'success';
    },
    createMessageError: (state, action) => {
      state.createMessageError = action.payload.error;
      state.createMessageState = 'error';
    },
    getMessagesStart: (state) => {
      state.getMessagesStart = 'requesting';
    },
    getMessagesSuccess: (state, action) => {
      state.messages.push(action.payload);
      state.getMessagesState = 'success';
    },
    getMessagesError: (state, action) => {
      state.getMessagesError = action.payload.error;
      state.getMessagesState = 'error';
    },
    selectChannel: (state, action) => {
      console.log('selected channel: ', state, action);
      state.selectedChannelId = action.payload;
    },
  },
});

const { actions, reducer } = appSlice;

export const {
  createMessageStart, createMessageSuccess, createMessageError,
  getMessagesStart, getMessagesSuccess, getMessagesError,
  selectChannel,
} = actions;

export default reducer;
