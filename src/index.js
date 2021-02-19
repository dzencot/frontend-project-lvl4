// @ts-check

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import io from 'socket.io-client';

import '../assets/application.scss';

// import faker from 'faker';
import gon from 'gon';
// import cookies from 'js-cookie';
// import io from 'socket.io-client';
import app from './app.jsx';

if (process.env.NODE_ENV !== 'production') {
  localStorage.debug = 'chat:*';
}

const data = gon;
const websocket = io();
console.log('gon data:', gon);
app(data, websocket);
