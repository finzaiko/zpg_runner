import { Pool, readJson } from "../deps.ts";
import { Config } from "./types.ts";

const configPath = new URL("../zpgr_config.json", import.meta.url).pathname;
const config: Config[] = await readJson(configPath) as Config[];

// console.log("Configuration settings:", config);

const cfg1 = config[0];

const POOL_CONNECTIONS = 20;

const dbPool = new Pool({
  user: cfg1.user,
  password: cfg1.password,
  database: cfg1.database,
  hostname: cfg1.host,
  port: cfg1.port,
  tls: { enforce: false, enabled: false }, // Disables SSL
}, POOL_CONNECTIONS);

const baseDir = `${cfg1.path}`;

export { baseDir, cfg1, dbPool };
