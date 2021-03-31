/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
  name: 'modal',
  initialState: {
    modalType: null,
    modalChannelId: null,
    modalNewChannelName: null,
  },
  reducers: {
    openModal: (state, { payload }) => {
      const { modalType, channelId } = payload;
      state.modalType = modalType;
      state.modalChannelId = channelId;
    },
    closeModal: (state) => {
      state.modalType = null;
      state.modalChannelId = null;
    },
  },
});

const { actions, reducer } = modalSlice;

export const {
  openModal,
  closeModal,
} = actions;

export default reducer;

