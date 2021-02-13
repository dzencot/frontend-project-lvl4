/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import _ from 'lodash';
import * as actions from './reducers';
import routes from './routes';

const getMessageFromResponse = ({ attributes }) => ({
  channelId: attributes.channelId,
  text: attributes.text,
  authorId: attributes.authorId,
  authorName: attributes.authorName,
  id: attributes.id,
});

export const sendMessage = (channelId, authorName, message) => async (dispatch) => {
  dispatch(actions.createMessageStart());
  const url = routes.channelMessagesPath(channelId);
  console.log('Current url: ', url);
  try {
    const body = {
      data: {
        attributes: {
          text: message.message,
          authorName,
        },
      },
    };
    const response = await axios.post(url, body);
    console.log('response: ', response);
    const newMessage = getMessageFromResponse(_.get(response, 'data.data'));
    dispatch(actions.createMessageSuccess(newMessage));
  } catch (error) {
    error.clientMessage = `Can't send message in channel id ${channelId}`;
    dispatch(actions.createMessageError({ error }));
  }
};

export const fetchMessages = (channelId) => async (dispatch) => {
  dispatch(actions.getMessagesStart());
  const url = routes.channelMessagesPath(channelId);
  try {
    const response = await axios.get(url);
    const messagesData = _.get(response, 'data.data', []);
    const messages = messagesData.map(getMessageFromResponse);
    dispatch(actions.getMessagesSuccess(messages));
  } catch (error) {
    error.clientMessage = `Can't get messages for channel id ${channelId}`;
    dispatch(actions.getMessagesError({ error }));
  }
};

export const selectChannel = (channelId) => async (dispatch) => {
  dispatch(actions.selectChannel(channelId));
  fetchMessages(channelId)(dispatch);
};
