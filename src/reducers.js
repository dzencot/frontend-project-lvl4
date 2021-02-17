/* eslint-disable no-param-reassign */
import _ from 'lodash';
import { createAction, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import routes from './routes';

const initialState = {
  messages: [],
  channels: [],
  selectedChannelId: null,
  createMessageState: 'none',
  createMessageError: null,
  getMessagesState: 'none',
  getMessageError: null,
  isEditChannel: false,
  editChannelId: null,
  isDeleteChannel: false,
  deleteChannelId: null,
  defaultChannelid: 1,
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
      if (state.deleteChannelId === state.selectedChannelId) {
        state.selectedChannelId = state.defaultChannelid;
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
    },

    selectDefaultChannel: (state) => {
      state.selectedChannelId = state.defaultChannelid;
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
