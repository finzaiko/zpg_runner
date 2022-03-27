const {pool, baseDir} = require("./config");
const { sqlTriggers } = require("./sql");
const cfg = require("../config.json");
const fsExtra = require("fs-extra");

const _getTriggers = async (schemaName, tableName) => {
  const client = await pool.connect();
  try {
    const res = await client.query(sqlTriggers(`"${schemaName}"."${tableName}"`));
    return res.rows;
  } finally {
    client.release();
  }
};

const writeTriggers = async (schemaName, tableName) => {
  const def = await _getTriggers(schemaName, tableName);
  for (let i = 0; i < def.length; i++) {
    const df = def[i];
    const dir = `${baseDir}/${schemaName}/tables/triggers`;
    fsExtra.ensureDirSync(dir);
    fsExtra.writeFileSync(
      `${dir}/${schemaName}.${df.proname}__${df.tgname}.sql`,
      df.pg_get_triggerdef
    );
  }
};

module.exports = {
  writeTriggers,
};
