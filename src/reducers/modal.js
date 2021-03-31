/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
  name: 'modal',
  initialState: {
    modalType: null,
    modalChannelId: null,
    modalNewChannelName: null,
    isOpen: false,
  },
  reducers: {
    openModal: (state, { payload }) => {
      const { modalType, channelId } = payload;
      state.modalType = modalType;
      state.modalChannelId = channelId;
      state.isOpen = true;
    },
    closeModal: (state) => {
      state.modalType = null;
      state.modalChannelId = null;
      state.isOpen = false;
    },
  },
});

const { actions, reducer } = modalSlice;

export const {
  openModal,
  closeModal,
} = actions;

export default reducer;
