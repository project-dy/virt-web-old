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

const logger = require('../logger.js');

logger.verbose('Starting node server');

app.use(morgan('dev', { stream: logger.stream }));

// get routers via call the function from ../router/routers.js
const routers = require('../router/routers.js');
routers.registerRouter(app);

app.listen(port, () => {
  logger.info(`App listening at http://localhost:${port}`);
});