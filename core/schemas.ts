import { emptyDirSync, ensureDirSync } from "../deps.ts";
import { baseDir, cfg1, dbPool } from "./config.ts";
import { writeFunctions } from "./functions.ts";
import { sqlSchemaAll } from "./sql.ts";
import { writeTables } from "./tables.ts";
import { writeViews } from "./views.ts";

interface SchemaRow {
  schema_name: string;
}

const getSchemas = async () => {
  const client = await dbPool.connect();
  try {
    const res = await client.queryObject<SchemaRow>(
      sqlSchemaAll(cfg1.schema_exclude),
    );
    return res.rows;
  } finally {
    client.release();
  }
};

const writeSchemas = async () => {
  const schemas = await getSchemas();
  for (let i = 0; i < schemas.length; i++) {
    const schemaName = schemas[i].schema_name;
    const dir = `${baseDir}/${schemaName}`;
    ensureDirSync(dir);
    emptyDirSync(dir);
    await writeTables(schemaName);
    await writeViews(schemaName);
    await writeFunctions(schemaName);
  }
};

export { writeSchemas };
