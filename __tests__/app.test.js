// @ts-check

import 'babel-polyfill';
import '@testing-library/jest-dom';
import fs from 'fs';
import path from 'path';
import { screen } from '@testing-library/dom';
// import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import nock from 'nock';
import MockedSocket from 'socket.io-mock';
// import { delay } from 'nanodelay';


import init from '../src/app';

const index = path.join(__dirname, '..', '__fixtures__', 'index.html');
const initHtml = fs.readFileSync(index, 'utf-8');

const elements = {};

const urlApi = 'http://localhost:5000/api/v1';
let socket;

beforeAll(() => {
  nock(urlApi)
    .post('/channels')
    .reply(200);
});

beforeEach(async () => {
  socket = new MockedSocket();

  document.body.innerHTML = initHtml;

  act(() => {
    init({ messages: [], channels: [] }, socket.socketClient);
  });

  elements.addChannel = screen.getByRole('button', { name: 'add-modal' });
  elements.inputMessage = screen.getByRole('textbox', { name: 'message' });
  elements.submitMessage = screen.getByRole('button', { name: 'message-submit' });
});

test('App init', () => {
  expect(screen.getByText(/Channels/i)).toBeInTheDocument();
});
