import { ensureDirSync, Pool } from "../deps.ts";
import { TableContent, TableDefinition } from "./types.ts";
import { sqlTableAll, sqlTableContentByOid } from "./sql.ts";
import { writeIndexes } from "./indexes.ts";
import { writeTriggers } from "./triggers.ts";

const _getTables = async (dbPool: Pool, schemaName: string) => {
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

const _getTableDefenition = async (dbPool: Pool, oid: number) => {
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

const writeTables = async (dbPool: Pool, path: string, schemaName: string) => {
  const def = await _getTables(dbPool, schemaName);
  for (let i = 0; i < def.length; i++) {
    const df = def[i];
    const dir = `${path}/${schemaName}/tables`;
    ensureDirSync(dir);
    const tbl = await _getTableDefenition(dbPool, df.oid);
    const tableName = df.table_name;
    Deno.writeFileSync(
      `${dir}/${schemaName}.${tableName}.sql`,
      new TextEncoder().encode(tbl[0].table_def),
    );
    await writeIndexes(dbPool, path, schemaName, tableName);
    await writeTriggers(dbPool, path, schemaName, tableName);
  }
};

export { writeTables };
