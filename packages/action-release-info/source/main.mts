import * as core from "@actions/core";
import * as github from "@actions/github";
import { writeFileSync } from "fs";
import { ReleaseInfo } from "./ReleaseInfo.mjs";

async function run() {
  const token = core.getInput("repo_token", { required: true });
  const octokit = github.getOctokit(token);

  // TODO: Instead of rasing this manually, we should properly search for it.
  let latestStableVersion = "v2.0.0-beta.4";

  core.info("Looking for dev build...");
  const latestBuildDev = await octokit.rest.repos.getReleaseByTag({
    owner: "kitten-science",
    repo: "kitten-scientists",
    tag: "next",
  });

  core.info("Looking for nightly build...");
  const latestBuildNightly = await octokit.rest.repos.getReleaseByTag({
    owner: "kitten-science",
    repo: "kitten-scientists",
    tag: "nightly",
  });

  core.info("Looking for stable build...");
  const latestBuildStable = await octokit.rest.repos.getReleaseByTag({
    owner: "kitten-science",
    repo: "kitten-scientists",
    tag: latestStableVersion,
  });

  const releaseInfo: ReleaseInfo = {
    dev: {
      version: extractVersionFromTitle(latestBuildDev.data.name),
      date: latestBuildDev.data.published_at ?? latestBuildDev.data.created_at,
      url: {
        default: findUserscript(latestBuildDev.data.assets)!.browser_download_url,
        minified: findUserscript(latestBuildDev.data.assets, true)!.browser_download_url,
        release: latestBuildDev.data.html_url,
      },
    },
    nightly: {
      version: extractVersionFromTitle(latestBuildNightly.data.name),
      date: latestBuildNightly.data.published_at ?? latestBuildNightly.data.created_at,
      url: {
        default: findUserscript(latestBuildNightly.data.assets)!.browser_download_url,
        minified: findUserscript(latestBuildNightly.data.assets, true)!.browser_download_url,
        release: latestBuildNightly.data.html_url,
      },
    },
    stable: {
      version: latestBuildStable.data.tag_name,
      date: latestBuildStable.data.published_at ?? latestBuildStable.data.created_at,
      url: {
        default: findUserscript(latestBuildStable.data.assets)!.browser_download_url,
        minified: findUserscript(latestBuildStable.data.assets, true)!.browser_download_url,
        release: latestBuildStable.data.html_url,
      },
    },
  };

  const filename = core.getInput("filename", { required: false });
  if (filename !== "") {
    writeFileSync(filename, JSON.stringify(releaseInfo, undefined, 2));
  }

  console.dir(releaseInfo);
}

function findUserscript<TAsset extends { name: string }>(
  assets: Array<TAsset>,
  minified = false
): TAsset | undefined {
  return assets.find(
    asset =>
      asset.name.startsWith("kitten-scientists-") && asset.name.includes(".min.") === minified
  );
}

function extractVersionFromTitle(title: string | null) {
  const subject = title ?? "";
  const version = subject.replace(/(Development Build|Nightly Build) /, "");
  return version.startsWith("v2") ? version : "v0.0.0";
}

void run();
