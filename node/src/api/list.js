const { execSync } = require('child_process');
const logger = require('../../logger');

function list() {
  try {
    const stdout = execSync('virsh -c qemu:///system?authfile=/etc/ovirt-hosted-engine/virsh_auth.conf list --all --uuid').toString();
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
      // logger.verbose(infoLines);
      let dominfo = {};
      infoLines.forEach((infoLine, index) => {
        if (index > 0 && infoLine != '') {
          const infoFields = infoLine.split(':');
          dominfo[infoFields[0].trim()] = infoFields[1].trim();
        }
      });
      // logger.verbose(dominfo);

      const vm = {
        uuid: fields[0],
        domain: dominfo,
      };
      vms.push(vm);
    }
    /*res.json(vms);
    res.end();*/
    logger.silly("list.js: list() success");
    return {status: 200, result: JSON.stringify(vms)};
  } catch (err) {
    // logger.error("list.js: list() error\n"+err);
    logger.error(`list.js: list() error\n${err}`);
    // logger.error(err);
    // res.status(500).end();
    /*res.send(`{"status": "error", "target": "list", "message": "${err.toString()}"}`);
    res.end();
    return;*/
    return {status: 500, result: `{"status": "error", "target": "list", "message": "${err.toString()}"}`};
  }
}

function get(req, res) {
  const resultList = list(res);
  res.status(resultList.status).send(resultList.result).end();
}

module.exports = {
  get,
  list,
};