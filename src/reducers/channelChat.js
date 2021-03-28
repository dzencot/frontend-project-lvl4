/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { removeChannel } from './channelsPanel';

const channelChatSlice = createSlice({
  name: 'channelChat',
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

const { actions, reducer } = channelChatSlice;

export const {
  addMessage,
  getMessageStart,
  getMessagesSuccess,
  getMessagesFail,
} = actions;

export default reducer;
