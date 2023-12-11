const { execSync } = require('child_process');
const logger = require('../../logger');

function shutdown(uuid) {
  try {
    const stdout = execSync(`virsh -c qemu:///system?authfile=/etc/ovirt-hosted-engine/virsh_auth.conf shutdown ${uuid}`).toString();
    logger.silly(`shutdown.js: shutdown() success\n${stdout}`);
    return {status: 200, result: `{"status": "success", "target": "${uuid}", "result": "${stdout.trim()}"}`};
  } catch (err) {
    // console.error(err);
    logger.error(`shutdown.js: shutdown() error\n${err}`);
    return {status: 500, result: `{"status": "error", "target": "${uuid}", "result": "${err.toString()}"}`};
  }
}

function get(req, res) {
  const resultShutdown = shutdown(req.params.uuid);
  res.status(resultShutdown.status).send(resultShutdown.result).end();
}

module.exports = {
  get,
  shutdown,
};