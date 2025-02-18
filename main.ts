import { getDbPool } from "./core/config.ts";
import { writeSchemas } from "./core/schemas.ts";
import { Config } from "./core/types.ts";
import {
  dateFormat,
  getConfigPath,
  gitCommitAndPush,
  isGitRepository,
  startSpinner,
  stopSpinner,
  verifyDirectory,
} from "./core/utils.ts";
import { readJson } from "./deps.ts";

const configPath = getConfigPath();
const config: Config[] = await readJson(configPath) as Config[];

for (let i = 0; i < config.length; i++) {
  const {
    path,
    git_access_token,
    name,
    user,
    password,
    database,
    host,
    port,
    schema_exclude,
  } = config[i];

  try {
    // Main execution
    console.log(`\nStarting ZPG Runner - \x1b[33m${name}\x1b[0m...`);

    startSpinner(`Verifying directory...`);
    await verifyDirectory(path);
    stopSpinner();

    startSpinner(`Checking git repository...`);
    const isGit = await isGitRepository(path);
    stopSpinner();

    if (isGit) {
      startSpinner(`Writing schemas...`);

      const dbPool = getDbPool(user, password, database, host, port);
      await writeSchemas(dbPool, schema_exclude, path);
      stopSpinner();

      const token = git_access_token;
      const projectPath = path;
      const commitMessage = `auto: zpg_runner ${dateFormat(new Date())}`;

      try {
        startSpinner(`Committing and pushing changes...`);
        await gitCommitAndPush(commitMessage, token, projectPath);
        stopSpinner();
        console.log("\n✔ Successfully Committed and pushed changes");
      } catch (error) {
        stopSpinner();
        console.error(`\n✖ Failed to commit and push :`, error);
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error processing config: ${error.message}`);
    } else {
      console.error("An unknown error occurred");
    }
  }
}

console.log("\n✔ All task successfully completed\n");
