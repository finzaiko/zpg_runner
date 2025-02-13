import { ensureDirSync } from "../deps.ts";
import { baseDir, dbPool } from "./config.ts";
import { sqlIndex } from "./sql.ts";
import { IndexDef } from "./types.ts";

const _getIndexes = async (schemaName: string, tableName: string) => {
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

const writeIndexes = async (schemaName: string, tableName: string) => {
  const def = await _getIndexes(schemaName, tableName);
  for (let i = 0; i < def.length; i++) {
    const df = def[i];
    const dir = `${baseDir}/${schemaName}/tables/indexes`;
    ensureDirSync(dir);
    Deno.writeFileSync(
      `${dir}/${schemaName}.${df.indexname}.sql`,
      new TextEncoder().encode(df.indexdef.toString()),
    );
  }
};

export { writeIndexes };
