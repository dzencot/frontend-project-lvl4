/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
  channels: [],
  currentChannelId: null,
  createMessageState: 'none',
  createMessageError: null,
  getMessagesState: 'none',
  getMessageError: null,
  isEditChannel: false,
  editChannelId: null,
  isDeleteChannel: false,
  deleteChannelId: null,
  defaultChannelid: null,
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
      state.currentChannelId = action.payload;
    },

    openEditChannelModal: (state, action) => {
      state.isEditChannel = true;
      state.editChannelId = action.payload;
    },
    closeEditChannelModal: (state) => {
      state.isEditChannel = false;
      state.editChannelId = null;
    },

    openDeleteChannelModal: (state, action) => {
      state.isDeleteChannel = true;
      state.deleteChannelId = action.payload;
    },
    closeDeleteChannelModal: (state) => {
      if (state.deleteChannelId === state.currentChannelId) {
        state.currentChannelId = state.defaultChannelid;
      }
      state.isDeleteChannel = false;
      state.deleteChannelId = null;
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
      state.messages = state.messages.filter(({ idChannel }) => idChannel !== action.payload);
      if (state.currentChannelId === action.payload) {
        state.currentChannelId = state.defaultChannelid;
      }
    },

    selectDefaultChannel: (state) => {
      state.currentChannelId = state.defaultChannelid;
    },
  },
});

const { actions, reducer } = appSlice;

export const {
  getMessagesStart, getMessagesSuccess, getMessagesFail,
  selectChannel, addMessage,
  addChannel, renameChannel, removeChannel,
  openEditChannelModal, openDeleteChannelModal,
  closeEditChannelModal, closeDeleteChannelModal,
  selectDefaultChannel,
} = actions;

export default reducer;
