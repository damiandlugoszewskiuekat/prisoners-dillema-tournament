import * as dotenv from 'dotenv';
import express from 'express';
import { WebSocketServer } from 'ws';
import { endpointParser } from './helper/parser.js';
import { api } from './api/index.js';

dotenv.config();

const app = express();
const wss = new WebSocketServer({ port: 7171 });
const clients = new Map();
const rooms = new Map();

app.use(express.static('test_html'));

app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', [process.env.WEB_URL]);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', ['Content-Type', 'authorization']);
  next();
});

app.use(express.json());

app.get('/get-test', api.getTest);
app.post('/finish-test', api.finishTest);

wss.on('connection', (ws) => {
  ws.on('message', (rawData) => {
    const data = JSON.parse(rawData);
    const { path, payload } = data || {};
    return endpointParser({
      path,
      payload,
      ws,
      clients,
      rooms,
    });
  });
});

app.listen(3333, () => {
  console.log('REST Listening on http://localhost:3333');
  console.log('WS Listening on http://localhost:7171');
});
