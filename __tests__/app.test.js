// @ts-check

import 'babel-polyfill';
import '@testing-library/jest-dom';
import fs from 'fs';
import path from 'path';
import { screen, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import nock from 'nock';

import app from '../src/app';

const index = path.join(__dirname, '..', '__fixtures__', 'index.html');
const initHtml = fs.readFileSync(index, 'utf-8');

beforeAll(() => {
  nock.disableNetConnect();
});

afterAll(() => {
  nock.cleanAll();
  nock.enableNetConnect();
});

beforeEach(async () => {
  document.body.innerHTML = initHtml;

  app([]);
});

test('App init', () => {
  expect(true).toBeTruthy();
});
