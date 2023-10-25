import core from "@actions/core";
import { getOctokit } from "@actions/github";
import { Context } from "@actions/github/lib/context.js";
import { Moctokit } from "@kie/mock-github";
import { beforeEach, it } from "mocha";
import { AutomaticReleases } from "./AutomaticReleases.js";

beforeEach(() => {
  process.env.GITHUB_REF = "refs/heads/main";
  process.env.GITHUB_REPOSITORY = "kitten-science/test";
  process.env.GITHUB_SHA = "c0c8526b12c825637a12e9a700868b9568e5a0b2";
  process.env.INPUT_AUTOMATIC_RELEASE_TAG = "next";
  process.env.INPUT_DRAFT = "false";
  process.env.INPUT_PRERELEASE = "true";
  process.env.INPUT_TITLE = "Development Build";
});

it("runs", async () => {
  const moctokit = new Moctokit();

  moctokit.rest.git
    .getRef({
      owner: "kitten-science",
      ref: encodeURIComponent("tags/next"),
      repo: "test",
    })
    .reply({
      status: 404,
      data: {},
    });

  moctokit.rest.git
    .createRef({
      owner: "kitten-science",
      ref: "refs/tags/next",
      repo: "test",
      sha: "c0c8526b12c825637a12e9a700868b9568e5a0b2",
    })
    .reply({
      status: 201,
      data: {},
    });

  moctokit.rest.repos
    .getReleaseByTag({ owner: "kitten-science", repo: "test", tag: "next" })
    .reply({ status: 404, data: {} });

  moctokit.rest.repos.createRelease().reply({ status: 201, data: {} });

  const automaticReleases = new AutomaticReleases({
    context: new Context(),
    core,
    octokit: getOctokit("invalid-token"),
  });

  await automaticReleases.main();
});
