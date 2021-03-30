/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const DEFAULT_CHANNEL_ID = 1;

const channelsSlice = createSlice({
  name: 'channelsPanel',
  initialState: {
    currentChannelId: null,
    defaultChannelId: null,
    channels: [],
    modalType: null,
    modalChannelId: null,
    modalNewChannelName: null,
  },
  reducers: {
    selectChannel: (state, action) => {
      state.currentChannelId = action.payload;
    },
    openModal: (state, { payload }) => {
      const { modalType, channelId } = payload;
      state.modalType = modalType;
      state.modalChannelId = channelId;
    },
    closeModal: (state) => {
      state.modalType = null;
      state.modalChannelId = null;
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
