const {pool, baseDir} = require("./config");
const { sqlIndex } = require("./sql");
const fsExtra = require("fs-extra");

const _getIndexes = async (schemaName, tableName) => {
  const client = await pool.connect();
  try {
    const res = await client.query(sqlIndex(schemaName, tableName));
    return res.rows;
  } finally {
    client.release();
  }
};

const writeIndexes = async (schemaName, tableName) => {
  const def = await _getIndexes(schemaName, tableName);
  for (let i = 0; i < def.length; i++) {
    const df = def[i];
    const dir = `${baseDir}/${schemaName}/tables/indexes`;
    fsExtra.ensureDirSync(dir);
    fsExtra.writeFileSync(`${dir}/${schemaName}.${df.indexname}.sql`, df.indexdef);
  }
};

module.exports = {
  writeIndexes,
};
