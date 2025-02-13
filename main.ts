import { cfg1 } from "./core/config.ts";
import { writeSchemas } from "./core/schemas.ts";
import {
  dateFormat,
  gitCommitAndPush,
  isGitRepository,
  startSpinner,
  stopSpinner,
  verifyDirectory,
} from "./core/utils.ts";

// Main execution
console.log("Starting ZPG Runner...\n");

startSpinner("Verifying directory...");
await verifyDirectory(cfg1.path);
stopSpinner();

startSpinner("Checking git repository...");
const isGit = await isGitRepository(cfg1.path);
stopSpinner();

if (isGit) {
  startSpinner("Writing schemas...");
  await writeSchemas();
  stopSpinner();

  const token = cfg1.git_access_token;
  const projectPath = cfg1.path;
  const commitMessage = `auto: zpg_runner ${dateFormat(new Date())}`;

  try {
    startSpinner("Committing and pushing changes...");
    await gitCommitAndPush(commitMessage, token, projectPath);
    stopSpinner();
    console.log("\n✔ Successfully committed and pushed changes");
  } catch (error) {
    stopSpinner();
    console.error("\n✖ Failed to commit and push:", error);
  }
}
