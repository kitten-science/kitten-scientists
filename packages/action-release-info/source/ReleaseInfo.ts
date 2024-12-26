import type core from "@actions/core";
import { Context } from "@actions/github/lib/context.js";
import { type GitHub } from "@actions/github/lib/utils.js";
import { writeFileSync } from "node:fs";

export type ReleaseMeta = {
  /**
   * The version string of the release.
   */
  version: string;

  /**
   * When was this release created?
   */
  date: string;

  url: {
    /**
     * A URL that points to the userscript.
     */
    default: string;

    /**
     * The same userscript, but minified.
     */
    minified: string;

    /**
     * Points to the GitHub release for this version.
     */
    release: string;
  };
};

export type TravelingReleaseChannel = "dev" | "nightly" | "stable";
export type ReleaseChannel = "fixed" | TravelingReleaseChannel;
export type ReleaseInfoSchema = Record<TravelingReleaseChannel, ReleaseMeta>;

export type ReleaseInfoOptions = {
  context: Context;
  core: typeof core;
  octokit: InstanceType<typeof GitHub>;
};

export const findUserscript = <TAsset extends { name: string }>(
  assets: Array<TAsset> | undefined,
  minified = false,
): TAsset => {
  if (!assets) {
    throw new Error("No assets found in release.");
  }

  const asset = assets.find(
    asset =>
      asset.name.startsWith("kitten-scientists-") && asset.name.includes(".min.") === minified,
  );

  if (!asset) {
    throw new Error("Couldn't find userscript in assets.");
  }

  return asset;
};

export const extractVersionFromTitle = (title: string | null) => {
  const subject = title ?? "";
  const version = subject.replace(/(Development Build|Nightly Build) /, "");
  return version.startsWith("v2") ? version : "v0.0.0";
};

export class ReleaseInfo {
  #options: ReleaseInfoOptions;

  constructor(options: ReleaseInfoOptions) {
    this.#options = options;
  }

  async main() {
    const { context, core, octokit } = this.#options;

    // TODO: Instead of raising this manually, we should properly search for it.
    const latestStableVersion = "v2.0.0-beta.9";

    core.info("Looking for dev build...");
    const latestBuildDev = await octokit.rest.repos.getReleaseByTag({
      owner: context.repo.owner,
      repo: context.repo.repo,
      tag: "next",
    });

    core.info("Looking for nightly build...");
    const latestBuildNightly = await octokit.rest.repos.getReleaseByTag({
      owner: context.repo.owner,
      repo: context.repo.repo,
      tag: "nightly",
    });

    core.info("Looking for stable build...");
    const latestBuildStable = await octokit.rest.repos.getReleaseByTag({
      owner: context.repo.owner,
      repo: context.repo.repo,
      tag: latestStableVersion,
    });

    const releaseInfo: ReleaseInfoSchema = {
      dev: {
        version: extractVersionFromTitle(latestBuildDev.data.name),
        date: latestBuildDev.data.published_at ?? latestBuildDev.data.created_at,
        url: {
          default: findUserscript(latestBuildDev.data.assets).browser_download_url,
          minified: findUserscript(latestBuildDev.data.assets, true).browser_download_url,
          release: latestBuildDev.data.html_url,
        },
      },
      nightly: {
        version: extractVersionFromTitle(latestBuildNightly.data.name),
        date: latestBuildNightly.data.published_at ?? latestBuildNightly.data.created_at,
        url: {
          default: findUserscript(latestBuildNightly.data.assets).browser_download_url,
          minified: findUserscript(latestBuildNightly.data.assets, true).browser_download_url,
          release: latestBuildNightly.data.html_url,
        },
      },
      stable: {
        version: latestBuildStable.data.tag_name,
        date: latestBuildStable.data.published_at ?? latestBuildStable.data.created_at,
        url: {
          default: findUserscript(latestBuildStable.data.assets).browser_download_url,
          minified: findUserscript(latestBuildStable.data.assets, true).browser_download_url,
          release: latestBuildStable.data.html_url,
        },
      },
    };

    const filename = core.getInput("filename", { required: false });
    if (filename !== "") {
      writeFileSync(filename, JSON.stringify(releaseInfo, undefined, 2));
    }

    core.setOutput("dev-url-default", releaseInfo.dev.url.default);
    core.setOutput("nightly-url-default", releaseInfo.nightly.url.default);
    core.setOutput("stable-url-default", releaseInfo.stable.url.default);

    core.setOutput("dev-url-minified", releaseInfo.dev.url.minified);
    core.setOutput("nightly-url-minified", releaseInfo.nightly.url.minified);
    core.setOutput("stable-url-minified", releaseInfo.stable.url.minified);
    console.dir(releaseInfo);
  }
}
