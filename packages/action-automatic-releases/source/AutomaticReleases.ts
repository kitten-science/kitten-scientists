import core from "@actions/core";
import { Context } from "@actions/github/lib/context.js";
import { type GitHub } from "@actions/github/lib/utils.js";
import {
  GetResponseDataTypeFromEndpointMethod,
  GetResponseTypeFromEndpointMethod,
} from "@octokit/types";
import { Commit, sync as commitParser } from "conventional-commits-parser";
import semverLt from "semver/functions/lt.js";
import semverRcompare from "semver/functions/rcompare.js";
import semverValid from "semver/functions/valid.js";
import { uploadReleaseArtifacts } from "./uploadReleaseArtifacts.js";
import {
  ConventionalCommitTypes,
  ParsedCommits,
  generateChangelogFromParsedCommits,
  getChangelogOptions,
  isBreakingChange,
  parseGitTag,
} from "./utils.js";

export type Args = {
  automaticReleaseTag: string;
  draftRelease: boolean;
  preRelease: boolean;
  releaseTitle: string;
  files: string[];
};

export type NewGitHubRelease = GetResponseDataTypeFromEndpointMethod<
  InstanceType<typeof GitHub>["rest"]["repos"]["createRelease"]
>;
export type CommitsSinceRelease = Array<
  GetResponseDataTypeFromEndpointMethod<
    InstanceType<typeof GitHub>["rest"]["repos"]["compareCommits"]
  >["commits"][number]
>;

export type AutomaticReleasesOptions = {
  context: Context;
  core: typeof core;
  octokit: InstanceType<typeof GitHub>;
};

export class AutomaticReleases {
  #options: AutomaticReleasesOptions;

  constructor(options: AutomaticReleasesOptions) {
    this.#options = options;
  }

  async main() {
    const { context, core, octokit } = this.#options;

    const args = this.getAndValidateArgs();

    core.startGroup("Initializing the Automatic Releases action");
    core.debug(`Github context: ${JSON.stringify(context)}`);
    core.endGroup();

    core.startGroup("Determining release tags");
    const releaseTag = args.automaticReleaseTag
      ? args.automaticReleaseTag
      : parseGitTag(context.ref);
    if (!releaseTag) {
      throw new Error(
        `The parameter "automatic_release_tag" was not set and this does not appear to be a GitHub tag event. (Event: ${context.ref})`,
      );
    }

    const previousReleaseTag = args.automaticReleaseTag
      ? args.automaticReleaseTag
      : await this.searchForPreviousReleaseTag(octokit, releaseTag, {
          owner: context.repo.owner,
          repo: context.repo.repo,
        });
    core.endGroup();

    const commitsSinceRelease: CommitsSinceRelease = await this.getCommitsSinceRelease(
      octokit,
      {
        owner: context.repo.owner,
        repo: context.repo.repo,
        ref: `tags/${previousReleaseTag}`,
      },
      context.sha,
    );

    const changelog = await this.getChangelog(
      octokit,
      context.repo.owner,
      context.repo.repo,
      commitsSinceRelease,
    );

    if (args.automaticReleaseTag) {
      await this.createReleaseTag(octokit, {
        owner: context.repo.owner,
        ref: `refs/tags/${args.automaticReleaseTag}`,
        repo: context.repo.repo,
        sha: context.sha,
      });

      await this.deletePreviousGitHubRelease(octokit, {
        owner: context.repo.owner,
        repo: context.repo.repo,
        tag: args.automaticReleaseTag,
      });
    }

    const release = await this.generateNewGitHubRelease(octokit, {
      owner: context.repo.owner,
      repo: context.repo.repo,
      tag_name: releaseTag,
      name: args.releaseTitle ? args.releaseTitle : releaseTag,
      draft: args.draftRelease,
      prerelease: args.preRelease,
      body: changelog,
    });

    await uploadReleaseArtifacts(octokit, context, release, args.files);

    core.debug(`Exporting environment variable AUTOMATIC_RELEASES_TAG with value ${releaseTag}`);
    core.exportVariable("AUTOMATIC_RELEASES_TAG", releaseTag);
    core.setOutput("automatic_releases_tag", releaseTag);
    core.setOutput("upload_url", release.upload_url);
  }

  getAndValidateArgs(): Args {
    const args = {
      automaticReleaseTag: core.getInput("automatic_release_tag", {
        required: false,
      }),
      draftRelease: core.getBooleanInput("draft", { required: true }),
      preRelease: core.getBooleanInput("prerelease", { required: true }),
      releaseTitle: core.getInput("title", { required: false }),
      files: [] as string[],
    };

    const inputFilesStr = core.getInput("files", { required: false });
    if (inputFilesStr) {
      args.files = inputFilesStr.split(/\r?\n/);
    }

    return args;
  }

  async createReleaseTag(
    client: InstanceType<typeof GitHub>,
    refInfo: { owner: string; repo: string; sha: string; ref: string },
  ) {
    core.startGroup("Generating release tag");
    const friendlyTagName = refInfo.ref.substring(10); // 'refs/tags/latest' => 'latest'
    core.info(`Attempting to create or update release tag "${friendlyTagName}"`);

    try {
      await client.rest.git.createRef(refInfo);
    } catch (err) {
      const existingTag = refInfo.ref.substring(5); // 'refs/tags/latest' => 'tags/latest'
      core.info(
        `Could not create new tag "${refInfo.ref}" (${
          (err as Error).message
        }) therefore updating existing tag "${existingTag}"`,
      );
      await client.rest.git.updateRef({
        ...refInfo,
        ref: existingTag,
        force: true,
      });
    }

    core.info(`Successfully created or updated the release tag "${friendlyTagName}"`);
    core.endGroup();
  }

  async deletePreviousGitHubRelease(
    client: InstanceType<typeof GitHub>,
    releaseInfo: { tag: string; owner: string; repo: string },
  ) {
    core.startGroup(`Deleting GitHub releases associated with the tag "${releaseInfo.tag}"`);
    try {
      core.info(`Searching for releases corresponding to the "${releaseInfo.tag}" tag`);
      const resp = await client.rest.repos.getReleaseByTag(releaseInfo);

      core.info(`Deleting release: ${resp.data.id}`);
      await client.rest.repos.deleteRelease({
        owner: releaseInfo.owner,
        repo: releaseInfo.repo,
        release_id: resp.data.id,
      });
    } catch (err) {
      core.info(
        `Could not find release associated with tag "${releaseInfo.tag}" (${
          (err as Error).message
        })`,
      );
    }
    core.endGroup();
  }

  async generateNewGitHubRelease(
    client: InstanceType<typeof GitHub>,
    releaseInfo: {
      owner: string;
      repo: string;
      tag_name: string;
      name: string;
      draft: boolean;
      prerelease: boolean;
      body: string;
    },
  ): Promise<NewGitHubRelease> {
    core.startGroup(`Generating new GitHub release for the "${releaseInfo.tag_name}" tag`);

    core.info("Creating new release");
    const resp = await client.rest.repos.createRelease(releaseInfo);
    core.endGroup();
    return resp.data;
  }

  async searchForPreviousReleaseTag(
    client: InstanceType<typeof GitHub>,
    currentReleaseTag: string,
    tagInfo: { owner: string; repo: string },
  ): Promise<string> {
    const validSemver = semverValid(currentReleaseTag);
    if (!validSemver) {
      throw new Error(
        `The parameter "automatic_release_tag" was not set and the current tag "${currentReleaseTag}" does not appear to conform to semantic versioning.`,
      );
    }

    const tl = await client.paginate(client.rest.repos.listTags, tagInfo);

    const tagList = tl
      .map(tag => {
        core.debug(`Currently processing tag ${tag.name}`);
        const t = semverValid(tag.name);
        return {
          ...tag,
          semverTag: t,
        };
      })
      .filter(tag => tag.semverTag !== null)
      .sort((a, b) => semverRcompare(a.semverTag!, b.semverTag!));

    let previousReleaseTag = "";
    for (const tag of tagList) {
      if (semverLt(tag.semverTag!, currentReleaseTag)) {
        previousReleaseTag = tag.name;
        break;
      }
    }

    return previousReleaseTag;
  }

  async getCommitsSinceRelease(
    client: InstanceType<typeof GitHub>,
    tagInfo: {
      owner: string;
      repo: string;
      ref: string;
    },
    currentSha: string,
  ): Promise<CommitsSinceRelease> {
    core.startGroup("Retrieving commit history");

    core.info("Determining state of the previous release");
    let previousReleaseRef = "" as string;
    core.info(`Searching for SHA corresponding to previous "${tagInfo.ref}" release tag`);
    try {
      await client.rest.git.getRef(tagInfo);
      previousReleaseRef = parseGitTag(tagInfo.ref);
    } catch (err) {
      core.info(
        `Could not find SHA corresponding to tag "${tagInfo.ref}" (${
          (err as Error).message
        }). Assuming this is the first release.`,
      );
      previousReleaseRef = "HEAD";
    }

    let resp:
      | GetResponseTypeFromEndpointMethod<typeof client.rest.repos.compareCommits>
      | undefined;
    core.info(`Retrieving commits between ${previousReleaseRef} and ${currentSha}`);
    try {
      resp = await client.rest.repos.compareCommits({
        owner: tagInfo.owner,
        repo: tagInfo.repo,
        base: previousReleaseRef,
        head: currentSha,
      });
      core.info(
        `Successfully retrieved ${resp.data.commits.length} commits between ${previousReleaseRef} and ${currentSha}`,
      );
    } catch (_err) {
      // istanbul ignore next
      core.warning(`Could not find any commits between ${previousReleaseRef} and ${currentSha}`);
    }

    let commits: CommitsSinceRelease = [];
    if (resp?.data?.commits) {
      commits = resp.data.commits;
    }
    core.debug(
      `Currently ${commits.length} number of commits between ${previousReleaseRef} and ${currentSha}`,
    );

    core.endGroup();
    return commits;
  }

  async getChangelog(
    client: InstanceType<typeof GitHub>,
    owner: string,
    repo: string,
    commits: CommitsSinceRelease,
  ): Promise<string> {
    const parsedCommits: ParsedCommits[] = [];
    core.startGroup("Generating changelog");

    for (const commit of commits) {
      core.debug(`Processing commit: ${JSON.stringify(commit)}`);
      core.debug(`Searching for pull requests associated with commit ${commit.sha}`);
      const pulls = await client.rest.repos.listPullRequestsAssociatedWithCommit({
        owner: owner,
        repo: repo,
        commit_sha: commit.sha,
      });
      if (pulls.data.length) {
        core.info(
          `Found ${pulls.data.length} pull request(s) associated with commit ${commit.sha}`,
        );
      }

      const clOptions = getChangelogOptions();
      const parsedCommitMsg: Exclude<Commit, "type"> & {
        type?: ConventionalCommitTypes | string | null;
      } = commitParser(commit.commit.message, clOptions);

      // istanbul ignore next
      if (parsedCommitMsg.merge) {
        core.debug(`Ignoring merge commit: ${parsedCommitMsg.merge}`);
        continue;
      }

      const expandedCommitMsg: ParsedCommits = {
        type: parsedCommitMsg.type as ConventionalCommitTypes,
        scope: parsedCommitMsg.scope ?? "",
        subject: parsedCommitMsg.subject ?? "",
        merge: parsedCommitMsg.merge ?? "",
        header: parsedCommitMsg.header ?? "",
        body: parsedCommitMsg.body ?? "",
        footer: parsedCommitMsg.footer ?? "",
        notes: parsedCommitMsg.notes ?? "",
        references: parsedCommitMsg.references ?? [],
        mentions: parsedCommitMsg.mentions ?? [],
        revert: parsedCommitMsg.revert ?? null,
        extra: {
          commit: commit,
          pullRequests: [],
          breakingChange: false,
        },
      };

      expandedCommitMsg.extra.pullRequests = pulls.data.map(pr => {
        return {
          number: pr.number,
          url: pr.html_url,
        };
      });

      expandedCommitMsg.extra.breakingChange = isBreakingChange({
        body: parsedCommitMsg.body ?? "",
        footer: parsedCommitMsg.footer ?? "",
      });
      core.debug(`Parsed commit: ${JSON.stringify(parsedCommitMsg)}`);
      parsedCommits.push(expandedCommitMsg);
      core.info(`Adding commit "${parsedCommitMsg.header}" to the changelog`);
    }

    const changelog = generateChangelogFromParsedCommits(parsedCommits);
    core.debug("Changelog:");
    core.debug(changelog);

    core.endGroup();
    return changelog;
  }
}
