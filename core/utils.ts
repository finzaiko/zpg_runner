import { path } from "../deps.ts";

const isGitRepository = async (path: string): Promise<boolean> => {
  try {
    // Check if .git directory exists
    const gitDir = `${path}/.git`;
    const stat = await Deno.stat(gitDir);
    return stat.isDirectory;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return false;
    }
    throw error;
  }
  // Usage example:
  //   const path = "./some/directory";
  //   const isGit = await isGitRepository(path);
  //   console.log(`Is git repository: ${isGit}`);
};

async function _execGitCommand(
  cmd: string[],
  workingDir: string,
): Promise<string> {
  const process = new Deno.Command("git", {
    args: cmd,
    stdout: "piped",
    stderr: "piped",
    cwd: workingDir,
  });

  const { stdout, stderr } = await process.output();
  const output = new TextDecoder().decode(stdout);
  const error = new TextDecoder().decode(stderr);

  //   if (error) throw new Error(error);
  const ignoredMessages = [
    "Everything up-to-date",
    /[a-f0-9]+\.\.[a-f0-9]+\s+main -> main/, // Matches push success message
  ];

  // Check if the error message should be ignored
  const shouldIgnore = ignoredMessages.some((msg) =>
    typeof msg === "string" ? error.includes(msg) : msg.test(error)
  );

  if (error && !shouldIgnore) {
    throw new Error(error);
  }

  return output || error; // Return either output or "error" message as they might contain useful info
}

async function gitCommitAndPush(
  message: string,
  token: string,
  workingDir: string,
  branch = "main",
): Promise<void> {
  try {
    // Add all changes
    await _execGitCommand(["add", "."], workingDir);

    // Commit changes
    await _execGitCommand(["commit", "-m", message], workingDir);

    // Set remote URL with token
    const remote = await _execGitCommand(
      ["remote", "get-url", "origin"],
      workingDir,
    );

    const newRemote = remote.trim().replace(
      "https://",
      `https://${token}@`,
    );

    await _execGitCommand(
      ["remote", "set-url", "origin", newRemote],
      workingDir,
    );

    // Push changes
    await _execGitCommand(["push", "origin", branch], workingDir);

    // Reset remote URL to remove token
    await _execGitCommand([
      "remote",
      "set-url",
      "origin",
      remote.trim(),
    ], workingDir);
  } catch (error) {
    console.error("Git operation failed:", error);
    throw error;
  }

  // Usage example:
  //   const token = "your_personal_access_token";
  //   const commitMessage = "feat: update readme";

  //   try {
  //     await gitCommitAndPush(commitMessage, token);
  //     console.log("Successfully committed and pushed changes");
  //   } catch (error) {
  //     console.error("Failed to commit and push:", error);
  //   }
}

const verifyDirectory = async (path: string): Promise<boolean> => {
  try {
    const stat = await Deno.stat(path);
    return stat.isDirectory;
  } catch {
    throw new Error(`Directory ${path} does not exist`);
  }
};

const dateFormat = (inputDate: Date): string => {
  return inputDate.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).replace(/(\d+)\/(\d+)\/(\d+),/, "$3-$1-$2");
};

// Simple spinner animation frames
const spinner = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
let spinnerInterval: number;

function startSpinner(text: string) {
  let i = 0;
  spinnerInterval = setInterval(() => {
    Deno.stdout.writeSync(new TextEncoder().encode(`\r${spinner[i]} ${text}`));
    i = (i + 1) % spinner.length;
  }, 80);
}

function stopSpinner() {
  clearInterval(spinnerInterval);
  Deno.stdout.writeSync(new TextEncoder().encode("\r"));
}

function getConfigPath(): string {
  // Check if we're running as a compiled binary
  const isCompiled = Deno.execPath().endsWith("zpg_runner");

  if (isCompiled) {
    // When compiled, use current working directory
    return path.join(Deno.cwd(), "zpgr_config.json");
  } else {
    // During development, use import.meta.url
    return new URL("../zpgr_config.json", import.meta.url).pathname;
  }
}

export {
  dateFormat,
  getConfigPath,
  gitCommitAndPush,
  isGitRepository,
  startSpinner,
  stopSpinner,
  verifyDirectory,
};
