const { pool, baseDir } = require("./config");
const { sqlViews } = require("./sql");
const fsExtra = require("fs-extra");

const _getViews = async (schemaName) => {
  const client = await pool.connect();
  try {
    const res = await client.query(sqlViews(schemaName));
    return res.rows;
  } finally {
    client.release();
  }
};

const writeViews = async (schemaName) => {
  const def = await _getViews(schemaName);
  for (let i = 0; i < def.length; i++) {
    const df = def[i];
    const dir = `${baseDir}/${schemaName}/views`;
    fsExtra.ensureDirSync(dir);
    fsExtra.writeFileSync(`${dir}/${schemaName}.${df.viewname}.sql`, df.viewdef);
  }
};

module.exports = {
  writeViews,
};
