/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const channelsPanelSlice = createSlice({
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
      state.channels.push(action.payload);
    },
    renameChannel: (state, action) => {
      const currentChannel = state.channels.find(({ id }) => id === action.payload.id);
      currentChannel.name = action.payload.name;
    },
    removeChannel: (state, action) => {
      state.channels = state.channels.filter(({ id }) => id !== action.payload);
    },
  },
});

const { actions, reducer } = channelsPanelSlice;

export const {
  selectChannel,
  openModal,
  closeModal,
  addChannel,
  renameChannel,
  removeChannel,
} = actions;

export default reducer;
