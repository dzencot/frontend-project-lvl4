/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { removeChannel } from './channels';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: {
    [removeChannel]: (state, action) => {
      state.messages = state.messages.filter(({ channelId }) => channelId !== action.payload);
    },
  },
});

const { actions, reducer } = chatSlice;

export const {
  addMessage,
  getMessageStart,
  getMessagesSuccess,
  getMessagesFail,
} = actions;

export default reducer;
