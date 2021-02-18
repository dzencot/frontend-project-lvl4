// @ts-check

import 'babel-polyfill';
import '@testing-library/jest-dom';
import fs from 'fs';
import path from 'path';
import { screen, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import nock from 'nock';

import app from '../src/app';

const index = path.join(__dirname, '..', '__fixtures__', 'index.html');
const initHtml = fs.readFileSync(index, 'utf-8');

const elements = {};

const urlApi = 'http://localhost:5000/api/v1';
const fakeURL = 'ws://localhost:8080';

beforeAll(() => {
  // mockServer = new Server(fakeURL);
  // window.io = SocketIO;

  nock.disableNetConnect();
  nock(urlApi)
    .post('/channels')
    .reply(200, (uri, requestBody) => {
      console.log('emit new channel: ', requestBody);
      // mockServer.emit('newChannel', requestBody);
    });
});

afterAll(() => {
  nock.cleanAll();
  nock.enableNetConnect();
});

beforeEach(async () => {
  document.body.innerHTML = initHtml;

  act(() => {
    app([]);
  });

  elements.addChannel = screen.getByRole('button', { name: 'add-modal' });
  elements.inputMessage = screen.getByRole('textbox', { name: 'message' });
  elements.submitMessage = screen.getByRole('button', { name: 'message-submit' });
});

test('App init', () => {
  expect(screen.getByText(/Channels/i)).toBeInTheDocument();
});

// test('Add channel', async () => {
//   // userEvent.type(elements.input, rssUrl);
//   userEvent.click(elements.addChannel);
//   expect(await screen.findByText(/Add channel/i)).toBeInTheDocument();

//   const channelName = 'Channel Test 1';
//   const channelAddInput = await screen.findAllByRole('textbox', { name: /channelName/i });
//   const channelAddSubmit = await screen.findAllByRole('textbox', { name: /channelName/i });
//   act(() => {
//     userEvent.type(channelAddInput[0], channelName);
//     userEvent.click(channelAddSubmit[0]);
//   });
//   expect(await screen.findByText(channelName)).toBeInTheDocument();
// });
