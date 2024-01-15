const { execSync } = require('child_process');
const logger = require('../../logger');

function isTurnedOn(dominfo) {
  if (dominfo.State == 'running') {
    return true;
  } else {
    return false;
  }
}

function process(uuid) {
  try {
    const vm = execSync(`virsh -c qemu:///system?authfile=/etc/ovirt-hosted-engine/virsh_auth.conf dominfo ${uuid}`);
    const vmLines = vm.toString().split('\n');
    let dominfo = {};
    vmLines.forEach((vmLine, index) => {
      if (index > 0 && vmLine != '') {
        const vmFields = vmLine.split(':');
        dominfo[vmFields[0].trim()] = vmFields[1].trim();
      }
    });

    if (!isTurnedOn(dominfo)) {
      logger.verbose(`remote.js: process() err\n${uuid} is not turned on`);
      return {status: 500, result: `{"status": "error", "target": "remote", "message": "${uuid} is not turned on"}`};
    }
  } catch (err) {
    logger.verbose(`remote.js: process() err\n${err}`);
    return {status: 500, result: `{"status": "error", "target": "remote", "message": "${uuid} is not found"}`};
  }
  // vm is running
  const result = remote(uuid);
  return result;
}

function remote(uuid) {
  const serv = execSync(`virsh -c qemu:///system?authfile=/etc/ovirt-hosted-engine/virsh_auth.conf domdisplay --domain ${uuid}`);
  const protocol = serv.toString().split('://')[0];
  const port = serv.toString().split('://')[1].split('127.0.0.1:')[1];
  if (protocol == 'spice') {
    const availablePort = getAvailablePort();
    const websockify = execSync(`../../../websockify/webssockify.py ${availablePort} localhost:${port}`);
    const result = `{"status": "success", "target": "remote", "protocol": "${protocol}", "port": "${port}"}`;
    logger.verbose(`remote.js: remote() success\n${result}`);
    return {status: 200, result: result};
  } else if (protocol == 'vnc') {
    const result = `{"status": "success", "target": "remote", "protocol": "${protocol}", "port": "${port}"}`;
    logger.verbose(`remote.js: remote() success\n${result}`);
    return {status: 200, result: result};
  } else {
    const result = `{"status": "error", "target": "remote", "message": "unknown protocol"}`;
    logger.verbose(`remote.js: remote() err\n${result}`);
    return {status: 500, result: result};
  }
}

function getAvailablePort() {
  const ports = execSync(`netstat -tln | awk '{print $4}'`).toString().split('\n').split('Local')[1];
  let port = 5959;
  //while (ports.includes(port.toString())) {
    //port++;
  //}
  return port;
}

function get(req, res) {
  const uuid = req.params.uuid;
  // const protocol = req.params.protocol;
  // process(uuid);
  // const result = process(uuid, protocol);
  const result = process(uuid);
  res.status(result.status).send(result.result);
}

module.exports = {
  get,
};