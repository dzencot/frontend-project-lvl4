/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import * as actions from './reducers';
import routes from './routes';

export const sendMessage = (channelId, message) => async (dispatch) => {
  dispatch(actions.createMessageStart());
  const url = routes.channelMessagesPath(channelId);
  console.log('Current url: ', url);
  try {
    const response = await axios.post(url, { data: message.message });
    console.log('response: ', response);
    const newMessage = { author: 'test1', text: message.message };
    dispatch(actions.createMessageSuccess(newMessage));
  } catch (error) {
    error.clientMessage = `Can't send message in channel id ${channelId}`;
    dispatch(actions.createMessageError({ error }));
  }
};

export const getMessages = (channelId) => async (dispatch) => {
  dispatch(actions.getMessagesStart());
  const url = routes.channelMessagesPath(channelId);
  try {
    const response = await axios.get(url);
    dispatch(actions.getMessagesSucces(response));
  } catch (error) {
    error.clientMessage = `Can't get messages for channel id ${channelId}`;
    dispatch(actions.getMessagesError({ error }));
  }
};
