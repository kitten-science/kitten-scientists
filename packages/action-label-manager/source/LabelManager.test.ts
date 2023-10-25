import core from "@actions/core";
import { context, getOctokit } from "@actions/github";
import { Moctokit } from "@kie/mock-github";
import { it } from "mocha";
import { LabelManager } from "./LabelManager.js";

beforeEach(() => {
  process.env.GITHUB_REPOSITORY = "kitten-science/test";
});

it("runs", async () => {
  const moctokit = new Moctokit();

  moctokit.rest.issues
    .listLabelsForRepo()
    .reply({ status: 200, data: [{ color: "000000", name: "dependencies" }, { name: "foo" }] });

  moctokit.rest.issues
    .createLabel({
      owner: "kitten-science",
      repo: "test",
      name: "new-label",
      description: "A new label",
    })
    .reply({ status: 201, data: { name: "new-label" } });

  moctokit.rest.issues
    .updateLabel({
      owner: "kitten-science",
      repo: "test",
      name: "dependencies",
    })
    .reply({ status: 200, data: { name: "dependencies" } });

  const labelManager = new LabelManager({
    context,
    core,
    labelsYaml: `
labels:
  dependencies:
    color: "BFD4F2"
    description: Pull requests that update a dependency file
  new-label:
    description: A new label
  `,
    octokit: getOctokit("invalid-token"),
  });

  await labelManager.main();
});
