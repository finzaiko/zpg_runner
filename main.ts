import { cfg1 } from "./core/config.ts";
import { writeSchemas } from "./core/schemas.ts";
import {
  dateFormat,
  gitCommitAndPush,
  isGitRepository,
  verifyDirectory,
} from "./core/utils.ts";

await verifyDirectory(cfg1.path);

const isGit = await isGitRepository(cfg1.path);
if (isGit) {
  await writeSchemas();
  const token = cfg1.git_access_token;
  const projectPath = cfg1.path;
  const commitMessage = `auto: zpg_runner ${dateFormat(new Date())}`;

  try {
    await gitCommitAndPush(commitMessage, token, projectPath);
    console.log("Successfully committed and pushed changes");
  } catch (error) {
    console.error("Failed to commit and push:", error);
  }
}
