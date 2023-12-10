const express = require('express');
const app = express.Router();

app.use('/', express.static('../noVNC'));

module.exports = app;
