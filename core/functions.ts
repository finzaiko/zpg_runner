import { ensureDirSync, Pool } from "../deps.ts";
import { sqlFuncDef } from "./sql.ts";

interface FunctionDefinition {
  func_name: string;
  func_def: string;
}

const _getFunctionDefenition = async (
  dbPool: Pool,
  schemaName: string,
): Promise<FunctionDefinition[]> => {
  const client = await dbPool.connect();
  try {
    const res = await client.queryObject<FunctionDefinition>(
      sqlFuncDef(schemaName),
    );
    return res.rows;
  } finally {
    client.release();
  }
};

const writeFunctions = async (
  dbPool: Pool,
  path: string,
  schemaName: string,
) => {
  const def = await _getFunctionDefenition(dbPool, schemaName);
  for (let i = 0; i < def.length; i++) {
    const df = def[i];
    const dir = `${path}/${schemaName}/functions`;
    ensureDirSync(dir);
    Deno.writeFileSync(
      `${dir}/${schemaName}.${df.func_name}.sql`,
      new TextEncoder().encode(df.func_def),
    );
  }
};
export { writeFunctions };
