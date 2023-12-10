function list(res) {
  const { exec, execSync } = require('child_process');

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
}

function get(req, res) {
  list(res);
}

module.exports = {
  get,
};