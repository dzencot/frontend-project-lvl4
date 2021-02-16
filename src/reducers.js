/* eslint-disable no-param-reassign */
import _ from 'lodash';
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
  isEditChannel: false,
};

const appSlice = createSlice({
  name: 'slackSlice',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    getMessagesStart: (state) => {
      state.getMessagesStart = 'requesting';
    },
    getMessagesSuccess: (state, action) => {
      state.messages = action.payload;
      state.getMessagesState = 'success';
    },
    getMessagesFail: (state, action) => {
      state.getMessagesError = action.payload.error;
      state.getMessagesState = 'failed';
    },
    selectChannel: (state, action) => {
      console.log('selected channel: ', state, action);
      state.selectedChannelId = action.payload;
    },
    toggleEditChannelModal: (state, action) => {
      state.isEditChannel = action.payload;
    },
  },
});

const { actions, reducer } = appSlice;

export const {
  getMessagesStart, getMessagesSuccess, getMessagesFail,
  selectChannel, addMessage, toggleEditChannelModal,
} = actions;

export default reducer;
