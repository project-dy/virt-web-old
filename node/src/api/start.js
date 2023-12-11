const { execSync } = require('child_process');
const logger = require('../../logger');

/**
 * 
 * @param {String} uuid String of uuid of the vm
 * @returns "{status: statusCode{Number}, result: result{String}}"
 * @example start(uuid) {status: 200, result: '{"status": "success", "target": ${uuid}, "result": ${result}}'}}'}
 */
function start(uuid) {
  try {
    const stdout = execSync(`virsh -c qemu:///system?authfile=/etc/ovirt-hosted-engine/virsh_auth.conf start ${uuid}`).toString();
    logger.silly(`start.js: start() success\n${stdout}`);
    return {status: 200, result: `{"status": "success", "target": "${uuid}", "result": "${stdout.trim()}"}`};
  } catch (err) {
    // console.error(err);
    logger.error(`start.js: start() error\n${err}`);
    return {status: 500, result: `{"status": "error", "target": "${uuid}", "result": "${err.toString()}"}`};
  }
}

function get(req, res) {
  const resultstart = start(req.params.uuid);
  res.status(resultstart.status).send(resultstart.result).end();
}

module.exports = {
  get,
  start,
};