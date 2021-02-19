// @ts-check

import 'babel-polyfill';
import '@testing-library/jest-dom';
import fs from 'fs';
import path from 'path';
import { screen, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import nock from 'nock';
import MockedSocket from 'socket.io-mock';
import { delay } from 'nanodelay';


import init from '../src/app';

const index = path.join(__dirname, '..', '__fixtures__', 'index.html');
const initHtml = fs.readFileSync(index, 'utf-8');

const elements = {};

const urlApi = 'http://localhost:5000/api/v1';
const fakeURL = 'ws://localhost:8080';
let socket;

beforeAll(() => {
  // mockServer = new Server(fakeURL);
  // window.io = SocketIO;

  // nock.disableNetConnect();
  nock(urlApi)
    .post('/channels')
    .reply(200, (uri, requestBody) => {
      console.log('emit new channel: ', requestBody);
      // socket.emit('newChannel', requestBody);
    });
});

afterAll(() => {
  // nock.cleanAll();
  // nock.enableNetConnect();
});

beforeEach(async () => {
  socket = new MockedSocket();
  // const vdom = app([], socket.socketClient);
  // render(vdom);

  document.body.innerHTML = initHtml;

  act(() => {
    init({}, socket.socketClient);
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

//   const scope = nock(urlApi)
//     .post('/channels')
//     .reply(200, (uri, requestBody) => {
//       console.log('emit new channel: ', requestBody);
//       // socket.emit('newChannel', requestBody);
//       return true;
//     });

//   const channelName = 'Channel Test 1';
//   const channelAddInput = await screen.findAllByRole('textbox', { name: /channel-name/i });
//   const channelAddSubmit = await screen.findAllByRole('button', { name: /channel-submit/i });
//   await act(async () => {
//     userEvent.type(channelAddInput[0], channelName);
//     userEvent.click(channelAddSubmit[0]);
//     console.log('socket emit');
//     await delay(10);
//     scope.done();
//     socket.emit('newChannel', 'test');
//   });
//   expect(await screen.findByText(channelName)).toBeInTheDocument();
// });
