const express = require('express');
const app = express.Router();

const { exec, execSync } = require('child_process');



app.get('/list', (req, res) => {
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
  });*//*
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
  }*/
  require('../src/api/list.js').get(req, res);
});

app.get('/start/:uuid', (req, res) => {
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

app.get('/shutdown/:uuid', (req, res) => {
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

module.exports = app;