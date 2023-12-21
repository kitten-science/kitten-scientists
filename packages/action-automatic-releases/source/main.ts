import core from "@actions/core";
import { context, getOctokit } from "@actions/github";
import { AutomaticReleases } from "./AutomaticReleases.js";
import { octokitLogger } from "./utils.js";

const isMainModule = import.meta.url.endsWith(process.argv[1]);

export const main = async (): Promise<void> => {
  try {
    const repo_token = core.getInput("repo_token", { required: true });
    const automaticReleases = new AutomaticReleases({
      context,
      core,
      octokit: getOctokit(repo_token, {
        log: {
          debug: (...logArgs) => core.debug(octokitLogger(...logArgs)),
          info: (...logArgs) => core.debug(octokitLogger(...logArgs)),
          warn: (...logArgs) => core.warning(octokitLogger(...logArgs)),
          error: (...logArgs) => core.error(octokitLogger(...logArgs)),
        },
      }),
    });

    await automaticReleases.main();
  } catch (error) {
    core.setFailed((error as Error).message);
    throw error;
  }
};

if (isMainModule) {
  main().catch(console.error);
}
