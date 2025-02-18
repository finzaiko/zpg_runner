import { emptyDirSync, ensureDirSync, Pool } from "../deps.ts";
// import { baseDir, cfg1, dbPool } from "./config.ts";
import { writeFunctions } from "./functions.ts";
import { sqlSchemaAll } from "./sql.ts";
import { writeTables } from "./tables.ts";
import { writeViews } from "./views.ts";

interface SchemaRow {
  schema_name: string;
}

const getSchemas = async (
  dbPool: Pool,
  schema_exclude: string[],
  path: string,
) => {
  const client = await dbPool.connect();
  try {
    const res = await client.queryObject<SchemaRow>(
      sqlSchemaAll(schema_exclude),
    );
    return res.rows;
  } finally {
    client.release();
  }
};

const writeSchemas = async (
  dbPool: Pool,
  schema_exclude: string[],
  path: string,
) => {
  const schemas = await getSchemas(dbPool, schema_exclude, path);
  for (let i = 0; i < schemas.length; i++) {
    const schemaName = schemas[i].schema_name;
    const dir = `${path}/${schemaName}`;
    ensureDirSync(dir);
    emptyDirSync(dir);
    await writeTables(dbPool, path, schemaName);
    await writeViews(dbPool, path, schemaName);
    await writeFunctions(dbPool, path, schemaName);
  }
};

export { writeSchemas };
