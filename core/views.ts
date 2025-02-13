import { ensureDirSync } from "../deps.ts";
import { baseDir, dbPool } from "./config.ts";
import { sqlViews } from "./sql.ts";
import { ViewDefinition } from "./types.ts";

const _getViews = async (schemaName: string) => {
  const client = await dbPool.connect();
  try {
    const res = await client.queryObject<ViewDefinition>(sqlViews(schemaName));
    return res.rows;
  } finally {
    client.release();
  }
};

const writeViews = async (schemaName: string) => {
  const def = await _getViews(schemaName);
  for (let i = 0; i < def.length; i++) {
    const df = def[i];
    const dir = `${baseDir}/${schemaName}/views`;
    ensureDirSync(dir);
    Deno.writeFileSync(
      `${dir}/${schemaName}.${df.viewname}.sql`,
      new TextEncoder().encode(df.viewdef.toString()),
    );
  }
};

export { writeViews };
