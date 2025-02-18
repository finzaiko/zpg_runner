import { ensureDirSync, Pool } from "../deps.ts";
import { sqlViews } from "./sql.ts";
import { ViewDefinition } from "./types.ts";

const _getViews = async (dbPool: Pool, schemaName: string) => {
  const client = await dbPool.connect();
  try {
    const res = await client.queryObject<ViewDefinition>(sqlViews(schemaName));
    return res.rows;
  } finally {
    client.release();
  }
};

const writeViews = async (dbPool: Pool, path: string, schemaName: string) => {
  const def = await _getViews(dbPool, schemaName);
  for (let i = 0; i < def.length; i++) {
    const df = def[i];
    const dir = `${path}/${schemaName}/views`;
    ensureDirSync(dir);
    Deno.writeFileSync(
      `${dir}/${schemaName}.${df.viewname}.sql`,
      new TextEncoder().encode(df.viewdef.toString()),
    );
  }
};

export { writeViews };
