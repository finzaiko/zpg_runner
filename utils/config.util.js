const { resolve } = require("path");
const path = require("path");
const fs = require("fs");
const { isJSON, structureIsEqual } = require("./json.util");
const cfg = require("../profile//config.json");

const checkConfig = async (userPath) => {
  const currPath = resolve(userPath);
  const res = await new Promise((resolve, reject) => {
    console.log("currPath", currPath);

    if (!fs.existsSync(userPath)) {
      console.log("File not found");
    } else {
      const stats = fs.statSync(currPath);
      if (!stats.isFile()) {
        console.log("No file current path");
        return;
      }
      let rawdata = fs.readFileSync(userPath);
      if (isJSON(rawdata)) {
        let data = JSON.parse(rawdata);
        const cfg = require("./format.json");
        if (structureIsEqual(data, cfg)) {
          const dirWp = path.join(__dirname, `../profile`);
          try {
            fs.writeFileSync(`${dirWp}/config.json`, JSON.stringify(data));
            resolve(true);
          } catch (e) {
            reject(false);
          }
        } else {
          console.log("No accept JSON format");
        }
      } else {
        console.log("No JSON format !");
      }
    }
  });
  return res;
};

const checkConn = async () => {
  const res = await new Promise((resolve, reject) => {
    const net = require("net");
    const host = cfg.db.host;
    const port = cfg.db.port;
    const sock = new net.Socket();

    sock.setTimeout(2500);
    sock
      .on("connect", function () {
        resolve(true);
        sock.destroy();
      })
      .on("error", function (e) {
        resolve(false);
      })
      .on("timeout", function (e) {
        resolve(false);
      })
      .connect(port, host);
  });
  return res;
};

module.exports = {
  checkConfig,
  checkConn,
};
