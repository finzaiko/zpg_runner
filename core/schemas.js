const {pool, baseDir} = require("./config");
const { sqlSchemaAll } = require("./sql");
const cfg = require("../config.json");
const { startLoading, stopLoading } = require("./util");
const fsExtra = require("fs-extra");
const { writeTables } = require("./tables");
const { writeFunctions } = require("./functions");
const { writeViews } = require("./views");

const getSchemas = async () => {
  const client = await pool.connect();
  try {
    const exluded = cfg.schema_exclude.join(",");
    const res = await client.query(sqlSchemaAll(exluded));
    return res.rows;
  } finally {
    client.release();
  }
};

const writeSchemas = async () => {
  const ws = startLoading("Processing");
  const schemas = await getSchemas();
  for (let i = 0; i < schemas.length; i++) {
    const schemaName = schemas[i].schema_name;
    const dir = `${baseDir}/${schemaName}`;
    fsExtra.ensureDirSync(dir);
    fsExtra.emptyDirSync(dir);
    await writeTables(schemaName);
    await writeFunctions(schemaName);
    await writeViews(schemaName);
    // process.exitCode = 1;
  }
  stopLoading(ws, "Completed");
};

module.exports = {
  writeSchemas,
};
