import { ensureDirSync } from "../deps.ts";
import { baseDir, dbPool } from "./config.ts";
import { sqlTriggers } from "./sql.ts";

interface TriggerDefinition {
  proname: string;
  tgname: string;
  pg_get_triggerdef: string;
}

const _getTriggers = async (schemaName: string, tableName: string) => {
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

const writeTriggers = async (schemaName: string, tableName: string) => {
  const def = await _getTriggers(schemaName, tableName);
  for (let i = 0; i < def.length; i++) {
    const df = def[i];
    const dir = `${baseDir}/${schemaName}/tables/triggers`;
    ensureDirSync(dir);
    Deno.writeFileSync(
      `${dir}/${schemaName}.${df.proname}__${df.tgname}.sql`,
      new TextEncoder().encode(df.pg_get_triggerdef),
    );
  }
};
export { writeTriggers };
