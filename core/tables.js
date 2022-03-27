const {pool, baseDir} = require("./config");
const { sqlTableAll, sqlTableContentByOid } = require("./sql");
const cfg = require("../config.json");
const fsExtra = require("fs-extra");
const { writeIndexes } = require("./indexes");
const { writeTriggers } = require("./triggers");

const _getTables = async (schemaName) => {
  const client = await pool.connect();
  try {
    const res = await client.query(sqlTableAll(schemaName));
    return res.rows;
  } finally {
    client.release();
  }
};

const _getTableDefenition = async (oid) => {
  const client = await pool.connect();
  try {
    const res = await client.query(sqlTableContentByOid(oid));
    return res.rows;
  } finally {
    client.release();
  }
};

const writeTables = async (schemaName) => {
  const def = await _getTables(schemaName);
  for (let i = 0; i < def.length; i++) {
    const df = def[i];
    const dir = `${baseDir}/${schemaName}/tables`;
    fsExtra.ensureDirSync(dir);
    const tbl = await _getTableDefenition(df.oid);
    const tableName = df.table_name;
    fsExtra.writeFileSync(`${dir}/${schemaName}.${tableName}.sql`, tbl[0].table_def);
    await writeIndexes(schemaName, tableName);
    await writeTriggers(schemaName, tableName);
  }
};

module.exports = {
  writeTables,
};
