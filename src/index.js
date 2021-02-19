// @ts-check

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import io from 'socket.io-client';

import '../assets/application.scss';

import gon from 'gon';
import app from './app.jsx';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

const data = gon;
const websocket = io();
app(data, websocket);
