/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const DEFAULT_CHANNEL_ID = 1;

const channelsSlice = createSlice({
  name: 'channels',
  initialState: {
    currentChannelId: DEFAULT_CHANNEL_ID,
    channels: [],
  },
  reducers: {
    selectChannel: (state, action) => {
      state.currentChannelId = action.payload;
    },
    addChannel: (state, action) => {
      state.list.push(action.payload);
    },
    renameChannel: (state, action) => {
      const currentChannel = state.list.find(({ id }) => id === action.payload.id);
      currentChannel.name = action.payload.name;
    },
    removeChannel: (state, action) => {
      state.list = state.list.filter(({ id }) => id !== action.payload);
      if (state.currentChannelId === action.payload) {
        state.currentChannelId = DEFAULT_CHANNEL_ID;
      }
    },
  },
});

const { actions, reducer } = channelsSlice;

export const {
  selectChannel,
  openModal,
  closeModal,
  addChannel,
  renameChannel,
  removeChannel,
} = actions;

export default reducer;
