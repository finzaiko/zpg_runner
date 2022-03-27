const {pool, baseDir} = require("./config");
const { sqlFuncDef } = require("./sql");
const cfg = require("../config.json");
const fsExtra = require("fs-extra");

const _getFunctionDefenition = async (schemaName) => {
  const client = await pool.connect();
  try {
    const res = await client.query(sqlFuncDef(schemaName));
    return res.rows;
  } finally {
    client.release();
  }
};

const writeFunctions = async (schemaName) => {
  const def = await _getFunctionDefenition(schemaName);
  for (let i = 0; i < def.length; i++) {
    const df = def[i];
    const dir = `${baseDir}/${schemaName}/functions`;
    fsExtra.ensureDirSync(dir);
    fsExtra.writeFileSync(`${dir}/${schemaName}.${df.func_name}.sql`, df.func_def);
  }
};

module.exports = {
  writeFunctions,
};
