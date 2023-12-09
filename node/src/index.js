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

app.use(express.static('build'));

app.get('/api/list', (req, res) => {
  /*exec('virsh -c qemu:///system?authfile=/etc/ovirt-hosted-engine/virsh_auth.conf list --all', (err, stdout, stderr) => {
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
        domain: fields[2],
        status: status,
      };
      vms.push(vm);
    }
    res.json(vms);
    res.end();
  });*/
  try {
    exec('virsh -c qemu:///system?authfile=/etc/ovirt-hosted-engine/virsh_auth.conf list --all --uuid', (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        res.status(500).end();
        return;
      }
      const lines = stdout.split('\n');
      const vms = [];
      for (let i = 0; i < lines.length - 2; i++) {
        const line = lines[i];
        const fields = line.split(/\s+/);
        let info;
        try {
          info = execSync(`virsh -c qemu:///system?authfile=/etc/ovirt-hosted-engine/virsh_auth.conf dominfo ${fields[0]}`);
        } catch (err) {
          info = err.stdout;
          const vm = {
            uuid: fields[0],
            domain: {
              error: info.toString(),
            },
          };
          vms.push(vm);
          continue;
        }
        const infoLines = info.toString().split('\n');
        // console.log(infoLines);
        let dominfo = {};
        infoLines.forEach((infoLine, index) => {
          if (index > 0 && infoLine != '') {
            const infoFields = infoLine.split(':');
            dominfo[infoFields[0].trim()] = infoFields[1].trim();
          }
        });
        // console.log(dominfo);

        const vm = {
          uuid: fields[0],
          domain: dominfo,
        };
        vms.push(vm);
      }
      res.json(vms);
      res.end();
    });
  } catch (err) {
    console.error(err);
    // res.status(500).end();
    res.send(`{"status": "error", "target": "list", "message": "${err.toString()}"}`);
    res.end();
    return;
  }
});

app.get('/api/start/:uuid', (req, res) => {
  try {
    exec(`virsh -c qemu:///system?authfile=/etc/ovirt-hosted-engine/virsh_auth.conf start ${req.params.uuid}`, (err, stdout, stderr) => {
      if (err) {
        // console.error(err);
        // res.status(500).end();
        // res.send(`{"status": "error", "target": "${req.params.uuid}", "message": "${stderr.trim()}"}`);
        // res.end();
        return err;
      } else if (stderr) {
        return stderr;
      }
      // res.send(stdout);
      res.send(`{"status": "success", "target": "${req.params.uuid}", "message": "${stdout.trim()}"}`);
      res.end();
    });/*.catch((err) => {
      console.error(err);
      // res.status(500).end();
      res.send(`{"status": "error", "target": "${req.params.uuid}", "message": "${err.toString()}"}`);
      res.end();
      return;
    })*/
  } catch (err) {
    console.error(err);
    // res.status(500).end();
    res.send(`{"status": "error", "target": "${req.params.uuid}", "message": "${err.toString()}"}`);
    res.end();
    return;
  }
});

app.get('/api/shutdown/:uuid', (req, res) => {
  try {
    exec(`virsh -c qemu:///system?authfile=/etc/ovirt-hosted-engine/virsh_auth.conf shutdown ${req.params.uuid}`, (err, stdout, stderr) => {
      if (err) {
        // console.error(err);
        // res.status(500).end();
        res.send(`{"status": "error", "target": "${req.params.uuid}", "message": "${stderr.trim()}"}`);
        res.end();
        return;
      }
      // res.send(stdout);
      res.send(`{"status": "success", "target": "${req.params.uuid}", "message": "${stdout.trim()}"}`);
      res.end();
    });/*.catch((err) => {
      console.error(err);
      // res.status(500).end();
      res.send(`{"status": "error", "target": "${req.params.uuid}", "message": "${err.toString()}"}`);
      res.end();
      return;
    })*/
  } catch (err) {
    console.error(err);
    // res.status(500).end();
    res.send(`{"status": "error", "target": "${req.params.uuid}", "message": "${err.toString()}"}`);
    res.end();
    return;
  }
});

// ex: http://localhost:3000/spice/spice_auto.html?host=localhost&port=5959

app.get('/api/spice/:uuid', (req, res) => {
  // TODO: check if needed websockify proccess's pid is exists from window.websockify_pid if not, return a location to start websockify
});

app.use('/spice', express.static('../spice-html5'));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});