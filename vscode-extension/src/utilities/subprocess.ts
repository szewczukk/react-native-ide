import { Logger } from "../Logger";
import execa, { ExecaChildProcess } from "execa";

export type ChildProcess = ExecaChildProcess<string>;

export function exec(...args: [string, string[]?, execa.Options?]) {
  const subprocess = execa(...args);
  async function printErrorsOnExit() {
    try {
      const result = await subprocess;
      if (result.stderr) {
        Logger.debug("Subprocess", args[0], "produced error output:", result.stderr);
      }
    } catch (e) {
      Logger.error("Subprocess", args[0], "execution resulted in an error:", e);
      throw e;
    }
  }
  printErrorsOnExit(); // don't want to await here not to block the outer method
  return subprocess;
}

export function execSync(...args: [string, string[]?, execa.SyncOptions?]) {
  const result = execa.sync(...args);
  if (result.stderr) {
    Logger.debug("Subprocess", args[0], "produced error output:", result.stderr);
  }
  return result;
}

export function command(...args: [string, execa.Options?]) {
  const subprocess = execa.command(...args);
  async function printErrorsOnExit() {
    try {
      const result = await subprocess;
      if (result.stderr) {
        Logger.debug("Command", args[0], "produced error output:", result.stderr);
      }
    } catch (e) {
      Logger.error("Command", args[0], "execution resulted in an error:", e);
      throw e;
    }
  }
  printErrorsOnExit(); // don't want to await here not to block the outer method
  return subprocess;
}