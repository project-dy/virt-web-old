/**
 * @license
 * Copyright (C) 2023 noneinfo01
 * SPDX-License-Identifier: GPL-2.0
 */

const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const fs = require('fs');
const { exec, execSync } = require('child_process');
const { promisify } = require('util');

const morgan = require('morgan');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);
const unlink = promisify(fs.unlink);
const mkdir = promisify(fs.mkdir);


// get routers via call the function from ../router/routers.js
const routers = require('../router/routers.js');
routers.registerRouter(app);

// app.use(morgan('dev'));
app.use(morgan('dev', {
  skip: function (req, res) {
      if (req.url == '/api/list') {
          return true;
      } else {
          return false;
      }
  }
}));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});