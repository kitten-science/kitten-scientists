import core from "@actions/core";
import { context, getOctokit } from "@actions/github";
import { ReleaseInfo } from "./ReleaseInfo.js";

/**
 * Execute the release info action.
 */
export const main = async (): Promise<void> => {
  try {
    const repo_token = core.getInput("repo_token", { required: true });
    const releaseInfo = new ReleaseInfo({
      context,
      core,
      octokit: getOctokit(repo_token),
    });

    await releaseInfo.main();
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
};
