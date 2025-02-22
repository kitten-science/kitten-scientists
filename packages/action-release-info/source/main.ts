import core from "@actions/core";
import { context, getOctokit } from "@actions/github";
import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import { ReleaseInfo } from "./ReleaseInfo.js";

const isMainModule = import.meta.url.endsWith(process.argv[1]);

/**
 * Execute the release info action.
 */
export const main = async (): Promise<void> => {
  try {
    core.info("Generating release information...");
    const token = core.getInput("repo-token", { required: true });
    const releaseInfo = new ReleaseInfo({
      context,
      core,
      octokit: getOctokit(token),
    });

    await releaseInfo.main();
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
};

if (isMainModule) {
  main().catch(redirectErrorsToConsole(console));
}
