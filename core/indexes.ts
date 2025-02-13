import { ensureDirSync, Pool } from "../deps.ts";
import { sqlIndex } from "./sql.ts";
import { IndexDef } from "./types.ts";

const _getIndexes = async (
  dbPool: Pool,
  schemaName: string,
  tableName: string,
) => {
  const client = await dbPool.connect();
  try {
    const res = await client.queryObject<IndexDef>(
      sqlIndex(schemaName, tableName),
    );
    return res.rows;
  } finally {
    client.release();
  }
};

const writeIndexes = async (
  dbPool: Pool,
  path: string,
  schemaName: string,
  tableName: string,
) => {
  const def = await _getIndexes(dbPool, schemaName, tableName);
  for (let i = 0; i < def.length; i++) {
    const df = def[i];
    const dir = `${path}/${schemaName}/tables/indexes`;
    ensureDirSync(dir);
    Deno.writeFileSync(
      `${dir}/${schemaName}.${df.indexname}.sql`,
      new TextEncoder().encode(df.indexdef.toString()),
    );
  }
};

export { writeIndexes };
