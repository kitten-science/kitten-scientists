import core from "@actions/core";
import { context, getOctokit } from "@actions/github";
import { Moctokit } from "@kie/mock-github";
import { it } from "mocha";
import { ReleaseInfo } from "./ReleaseInfo.js";

beforeEach(() => {
  process.env.GITHUB_REPOSITORY = "kitten-science/kitten-scientists";
});

it("runs", async () => {
  const moctokit = new Moctokit();

  moctokit.rest.repos
    .getReleaseByTag({
      owner: "kitten-science",
      repo: "kitten-scientists",
      tag: "next",
    })
    .reply({
      status: 200,
      data: {
        name: "Development Build v2.0.0-beta.8-dev-2179ddb",
        html_url: "https://github.com/kitten-science/kitten-scientists/releases/tag/next",
        assets: [
          {
            browser_download_url:
              "https://github.com/kitten-science/kitten-scientists/releases/download/next/kitten-scientists-2.0.0-beta.8-dev-2179ddb.min.user.js",
            name: "kitten-scientists-2.0.0-beta.8-dev-2179ddb.min.user.js",
          },
          {
            browser_download_url:
              "https://github.com/kitten-science/kitten-scientists/releases/download/next/kitten-scientists-2.0.0-beta.8-dev-2179ddb.user.js",
            name: "kitten-scientists-2.0.0-beta.8-dev-2179ddb.user.js",
          },
        ],
      },
    });

  moctokit.rest.repos
    .getReleaseByTag({
      owner: "kitten-science",
      repo: "kitten-scientists",
      tag: "nightly",
    })
    .reply({
      status: 200,
      data: {
        name: "Nightly Build v2.0.0-beta.8-20231025-2179ddb",
        html_url: "https://github.com/kitten-science/kitten-scientists/releases/tag/nightly",
        assets: [
          {
            browser_download_url:
              "https://github.com/kitten-science/kitten-scientists/releases/download/nightly/kitten-scientists-2.0.0-beta.8-20231025-2179ddb.min.user.js",
            name: "kitten-scientists-2.0.0-beta.8-20231025-2179ddb.min.user.js",
          },
          {
            browser_download_url:
              "https://github.com/kitten-science/kitten-scientists/releases/download/nightly/kitten-scientists-2.0.0-beta.8-20231025-2179ddb.user.js",
            name: "kitten-scientists-2.0.0-beta.8-20231025-2179ddb.user.js",
          },
        ],
      },
    });

  moctokit.rest.repos
    .getReleaseByTag({
      owner: "kitten-science",
      repo: "kitten-scientists",
      tag: "v2.0.0-beta.7",
    })
    .reply({
      status: 200,
      data: {
        name: "v2.0.0-beta.7",
        html_url: "https://github.com/kitten-science/kitten-scientists/releases/tag/v2.0.0-beta.7",
        assets: [
          {
            browser_download_url:
              "https://github.com/kitten-science/kitten-scientists/releases/download/v2.0.0-beta.7/kitten-scientists-2.0.0-beta.7.min.user.js",
            name: "kitten-scientists-2.0.0-beta.7.min.user.js",
          },
          {
            browser_download_url:
              "https://github.com/kitten-science/kitten-scientists/releases/download/v2.0.0-beta.7/kitten-scientists-2.0.0-beta.7.user.js",
            name: "kitten-scientists-2.0.0-beta.7.user.js",
          },
        ],
      },
    });

  const releaseInfo = new ReleaseInfo({
    context,
    core,
    octokit: getOctokit("invalid-token"),
  });

  await releaseInfo.main();
});
