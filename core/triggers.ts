import { ensureDirSync, Pool } from "../deps.ts";
import { sqlTriggers } from "./sql.ts";
import { TriggerDefinition } from "./types.ts";

const _getTriggers = async (
  dbPool: Pool,
  schemaName: string,
  tableName: string,
) => {
  const client = await dbPool.connect();
  try {
    const res = await client.queryObject<TriggerDefinition>(
      sqlTriggers(`"${schemaName}"."${tableName}"`),
    );
    return res.rows;
  } finally {
    client.release();
  }
};

const writeTriggers = async (
  dbPool: Pool,
  path: string,
  schemaName: string,
  tableName: string,
) => {
  const def = await _getTriggers(dbPool, schemaName, tableName);
  for (let i = 0; i < def.length; i++) {
    const df = def[i];
    const dir = `${path}/${schemaName}/tables/triggers`;
    ensureDirSync(dir);
    Deno.writeFileSync(
      `${dir}/${schemaName}.${df.proname}__${df.tgname}.sql`,
      new TextEncoder().encode(df.pg_get_triggerdef),
    );
  }
};
export { writeTriggers };
