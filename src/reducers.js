/* eslint no-param-reassign: ["error", { "props": false }] */
import { combineReducers } from 'redux';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { getMessages } from './services.js';

const channelSlice = createSlice({
  name: 'channel',
  initialState: null,
  reducers: {
    selectChannel: (state, payload) => {
      console.log('payload:', payload);
      return payload;
    },
  },
});

export default channelSlice;
