const { writeSchemas } = require("./core/schemas");
const { checkConfig, checkConn } = require("./utils/config.util");

const runActionWithPath = async (path) => {
  _doRunAction(path);
};

const runAction = async () => {
  _doRunAction("config.json");
};

const _doRunAction = async (userPath) => {
  const f = await checkConfig(userPath);
  if (f) {
    const cfg = require("./profile/config.json");
    console.log(`ZPGRunner Start: ${cfg.project_name}`);
    const isOk = await checkConn();
    if (isOk) {
      writeSchemas();
    } else {
      console.log(`Connection fail`);
      process.exit(0);
    }
  }
};

module.exports = {
  runActionWithPath,
  runAction,
};
