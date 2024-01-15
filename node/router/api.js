const express = require('express');
const app = express.Router();

const { exec } = require('child_process');

const list = require('../src/api/list.js');
const start = require('../src/api/start.js');
const shutdown = require('../src/api/shutdown.js');
const remote = require('../src/api/remote.js');
const logger = require('../logger.js');

app.get('/list', (req, res) => {
  list.get(req, res);
});
logger.verbose('Registered api/list router');

app.get('/start/:uuid', (req, res) => {
  start.get(req, res);
});
logger.verbose('Registered api/start router');

app.get('/shutdown/:uuid', (req, res) => {
  shutdown.get(req, res);
});
logger.verbose('Registered api/shutdown router');

app.get('/remote/:uuid', (req, res) => {
  remote.get(req, res);
});
logger.verbose('Registered api/remote router');

module.exports = app;