import { ensureDirSync } from "../deps.ts";
import { baseDir, dbPool } from "./config.ts";
import { TableContent, TableDefinition } from "./types.ts";
import { sqlTableAll, sqlTableContentByOid } from "./sql.ts";
import { writeIndexes } from "./indexes.ts";
import { writeTriggers } from "./triggers.ts";

const _getTables = async (schemaName: string) => {
  const client = await dbPool.connect();
  try {
    const res = await client.queryObject<TableDefinition>(
      sqlTableAll(schemaName),
    );
    return res.rows;
  } finally {
    client.release();
  }
};

const _getTableDefenition = async (oid: number) => {
  const client = await dbPool.connect();
  try {
    const res = await client.queryObject<TableContent>(
      sqlTableContentByOid(oid),
    );
    return res.rows;
  } finally {
    client.release();
  }
};

const writeTables = async (schemaName: string) => {
  const def = await _getTables(schemaName);
  for (let i = 0; i < def.length; i++) {
    const df = def[i];
    const dir = `${baseDir}/${schemaName}/tables`;
    ensureDirSync(dir);
    const tbl = await _getTableDefenition(df.oid);
    const tableName = df.table_name;
    Deno.writeFileSync(
      `${dir}/${schemaName}.${tableName}.sql`,
      new TextEncoder().encode(tbl[0].table_def),
    );
    await writeIndexes(schemaName, tableName);
    await writeTriggers(schemaName, tableName);
  }
};

export { writeTables };
