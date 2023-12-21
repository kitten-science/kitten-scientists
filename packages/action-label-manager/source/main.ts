import core from "@actions/core";
import { context, getOctokit } from "@actions/github";
import fs from "node:fs/promises";
import { LabelManager } from "./LabelManager.js";

const isMainModule = import.meta.url.endsWith(process.argv[1]);

/**
 * Execute the label manager action.
 */
export const main = async (): Promise<void> => {
  try {
    if (!process.env.GITHUB_REPOSITORY) {
      throw new Error("Missing GITHUB_REPOSITORY");
    }

    const repo_token = core.getInput("repo_token", { required: true });
    const labelManager = new LabelManager({
      core,
      context,
      labelsYaml: await fs.readFile(".github/labels.yml", "utf8"),
      octokit: getOctokit(repo_token),
    });

    await labelManager.main();
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
};

if (isMainModule) {
  main().catch(console.error);
}
