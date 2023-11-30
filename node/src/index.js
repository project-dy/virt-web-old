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
const { exec } = require('child_process');
const { promisify } = require('util');

const morgan = require('morgan');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);
const unlink = promisify(fs.unlink);
const mkdir = promisify(fs.mkdir);

app.use(morgan('dev'));
app.use(express.static('build'));

app.get('/api/list', (req, res) => {
  exec('virsh -c qemu:///system?authfile=/etc/ovirt-hosted-engine/virsh_auth.conf list --all', (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      res.status(500).end();
      return;
    }
    const lines = stdout.split('\n');
    const vms = [];
    for (let i = 2; i < lines.length - 2; i++) {
      const line = lines[i];
      const fields = line.split(/\s+/);
      let status = '';
      fields.forEach((field, index) => {
        console.log(index, field);
        if (index >= 3) {
          console.log('field', field);
          status = status+field+' ';
          console.log('status', status);
        }
      });
      const vm = {
        id: fields[1],
        state: fields[2],
        status: status,
      };
      vms.push(vm);
    }
    res.json(vms);
    res.end();
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});