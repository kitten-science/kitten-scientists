import core from "@actions/core";
import github from "@actions/github";
import { CommitValidator } from "./CommitValidator.js";

const isMainModule = import.meta.url.endsWith(process.argv[1]);

/**
 * Execute the commit validator action.
 */
export const main = async (): Promise<void> => {
  try {
    if (!process.env.GITHUB_REPOSITORY) {
      throw new Error("Missing GITHUB_REPOSITORY");
    }

    const prNumber = github.context.payload.number as string | undefined;
    if (!prNumber) {
      throw new Error("Unable to determine PR number!");
    }

    const repo_token = core.getInput("repo_token", { required: true });
    const commitValidator = new CommitValidator({
      core,
      context: github.context,
      octokit: github.getOctokit(repo_token),
      pr: Number.parseInt(prNumber),
    });

    await commitValidator.main();
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
};

if (isMainModule) {
  main().catch(console.error);
}
