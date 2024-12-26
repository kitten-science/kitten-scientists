import core from "@actions/core";
import { context, getOctokit } from "@actions/github";
import { Context } from "@actions/github/lib/context.js";
import { Moctokit } from "@kie/mock-github";
import { unknownToError } from "@oliversalzburg/js-utils/errors/error-serializer.js";
import { expect } from "chai";
import { rm, stat } from "fs/promises";
import { it } from "mocha";
import { ReleaseInfo } from "./ReleaseInfo.js";

const mockHappyPath = (moctokit: Moctokit) => {
  moctokit.rest.repos
    .getReleaseByTag({
      owner: "kitten-science",
      repo: "kitten-scientists",
      tag: "next",
    })
    .reply({
      status: 200,
      data: {
        name: "Development Build v2.0.0-beta.9-dev-2179ddb",
        html_url: "https://github.com/kitten-science/kitten-scientists/releases/tag/next",
        assets: [
          {
            browser_download_url:
              "https://github.com/kitten-science/kitten-scientists/releases/download/next/kitten-scientists-2.0.0-beta.9-dev-2179ddb.min.user.js",
            name: "kitten-scientists-2.0.0-beta.9-dev-2179ddb.min.user.js",
          },
          {
            browser_download_url:
              "https://github.com/kitten-science/kitten-scientists/releases/download/next/kitten-scientists-2.0.0-beta.9-dev-2179ddb.user.js",
            name: "kitten-scientists-2.0.0-beta.9-dev-2179ddb.user.js",
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
        name: "Nightly Build v2.0.0-beta.9-20231025-2179ddb",
        html_url: "https://github.com/kitten-science/kitten-scientists/releases/tag/nightly",
        assets: [
          {
            browser_download_url:
              "https://github.com/kitten-science/kitten-scientists/releases/download/nightly/kitten-scientists-2.0.0-beta.9-20231025-2179ddb.min.user.js",
            name: "kitten-scientists-2.0.0-beta.9-20231025-2179ddb.min.user.js",
          },
          {
            browser_download_url:
              "https://github.com/kitten-science/kitten-scientists/releases/download/nightly/kitten-scientists-2.0.0-beta.9-20231025-2179ddb.user.js",
            name: "kitten-scientists-2.0.0-beta.9-20231025-2179ddb.user.js",
          },
        ],
      },
    });

  moctokit.rest.repos
    .getReleaseByTag({
      owner: "kitten-science",
      repo: "kitten-scientists",
      tag: "v2.0.0-beta.9",
    })
    .reply({
      status: 200,
      data: {
        name: "v2.0.0-beta.9",
        html_url: "https://github.com/kitten-science/kitten-scientists/releases/tag/v2.0.0-beta.9",
        assets: [
          {
            browser_download_url:
              "https://github.com/kitten-science/kitten-scientists/releases/download/v2.0.0-beta.9/kitten-scientists-2.0.0-beta.7.min.user.js",
            name: "kitten-scientists-2.0.0-beta.7.min.user.js",
          },
          {
            browser_download_url:
              "https://github.com/kitten-science/kitten-scientists/releases/download/v2.0.0-beta.9/kitten-scientists-2.0.0-beta.7.user.js",
            name: "kitten-scientists-2.0.0-beta.7.user.js",
          },
        ],
      },
    });
};

beforeEach(() => {
  process.env.GITHUB_REPOSITORY = "kitten-science/kitten-scientists";
  for (const key of Object.keys(process.env)) {
    if (key.startsWith("INPUT_")) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete process.env[key];
    }
  }
});

after(() => rm("./release-info.json"));

it("fails without assets", async () => {
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
        name: "Development Build v2.0.0-beta.9-dev-2179ddb",
        html_url: "https://github.com/kitten-science/kitten-scientists/releases/tag/next",
        assets: undefined,
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
        name: "Nightly Build v2.0.0-beta.9-20231025-2179ddb",
        html_url: "https://github.com/kitten-science/kitten-scientists/releases/tag/nightly",
        assets: undefined,
      },
    });

  moctokit.rest.repos
    .getReleaseByTag({
      owner: "kitten-science",
      repo: "kitten-scientists",
      tag: "v2.0.0-beta.9",
    })
    .reply({
      status: 200,
      data: {
        name: "v2.0.0-beta.9",
        html_url: "https://github.com/kitten-science/kitten-scientists/releases/tag/v2.0.0-beta.9",
        assets: undefined,
      },
    });

  const releaseInfo = new ReleaseInfo({
    context,
    core,
    octokit: getOctokit("invalid-token", { request: { fetch } }),
  });

  await releaseInfo
    .main()
    .then(() => {
      throw new Error("Expected unit to throw.");
    })
    .catch((error: unknown) =>
      expect(unknownToError(error).message).to.match(/No assets found in release./),
    );
});

it("fails if no usescript in release", async () => {
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
        name: "Development Build v2.0.0-beta.9-dev-2179ddb",
        html_url: "https://github.com/kitten-science/kitten-scientists/releases/tag/next",
        assets: [
          {
            browser_download_url:
              "https://github.com/kitten-science/kitten-scientists/releases/download/next/README.md",
            name: "README.md",
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
        name: "Nightly Build v2.0.0-beta.9-20231025-2179ddb",
        html_url: "https://github.com/kitten-science/kitten-scientists/releases/tag/nightly",
        assets: [
          {
            browser_download_url:
              "https://github.com/kitten-science/kitten-scientists/releases/download/nightly/README.md",
            name: "README.md",
          },
        ],
      },
    });

  moctokit.rest.repos
    .getReleaseByTag({
      owner: "kitten-science",
      repo: "kitten-scientists",
      tag: "v2.0.0-beta.9",
    })
    .reply({
      status: 200,
      data: {
        name: "v2.0.0-beta.9",
        html_url: "https://github.com/kitten-science/kitten-scientists/releases/tag/v2.0.0-beta.9",
        assets: [
          {
            browser_download_url:
              "https://github.com/kitten-science/kitten-scientists/releases/download/v2.0.0-beta.9/README.md",
            name: "README.md",
          },
        ],
      },
    });

  const releaseInfo = new ReleaseInfo({
    context,
    core,
    octokit: getOctokit("invalid-token", { request: { fetch } }),
  });

  await releaseInfo
    .main()
    .then(() => {
      throw new Error("Expected unit to throw.");
    })
    .catch((error: unknown) =>
      expect(unknownToError(error).message).to.match(/Couldn't find userscript in assets./),
    );
});

it("runs", async () => {
  const moctokit = new Moctokit();

  mockHappyPath(moctokit);

  const releaseInfo = new ReleaseInfo({
    context,
    core,
    octokit: getOctokit("invalid-token", { request: { fetch } }),
  });

  await releaseInfo.main();
});

it("writes release info to file", async () => {
  const moctokit = new Moctokit();

  process.env.INPUT_FILENAME = "release-info.json";

  mockHappyPath(moctokit);

  const releaseInfo = new ReleaseInfo({
    context: new Context(),
    core,
    octokit: getOctokit("invalid-token", { request: { fetch } }),
  });

  await releaseInfo.main();

  await stat("./release-info.json").then(stats => expect(stats).to.exist);
});
