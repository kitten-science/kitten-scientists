import * as core from "@actions/core";
import * as github from "@actions/github";
import fs from "node:fs/promises";
import YAML from "yaml";

/**
 * Execute the label manager.
 */
async function run(): Promise<void> {
  try {
    if (!process.env.GITHUB_REPOSITORY) {
      throw new Error("Missing GITHUB_REPOSITORY");
    }

    const [repoOwner, repoName] = process.env.GITHUB_REPOSITORY.split("/");
    const repoToken = core.getInput("repo_token");

    const labelsYaml = await fs.readFile(".github/labels.yml", "utf8");
    const config = YAML.parse(labelsYaml) as {
      labels: Record<string, { color?: string; description?: string }>;
    };

    core.debug("Configured labels:");
    for (const [name, label] of Object.entries(config.labels)) {
      core.debug(name);
      if (label.color) {
        core.debug(`  Color: ${label.color}`);
      }
      if (label.description) {
        core.debug(`  Descr: ${label.description}`);
      }
    }

    const octokit = github.getOctokit(repoToken);

    const existingLabels = await octokit.rest.issues.listLabelsForRepo({
      owner: repoOwner,
      repo: repoName,
    });

    core.info("Updating labels...");
    const labelResults = {
      created: new Array<string>(),
      updated: new Array<string>(),
    };

    for (const [name, label] of Object.entries(config.labels)) {
      const existingLabel = existingLabels.data.find(existing => existing.name === name);
      if (existingLabel) {
        if (
          existingLabel.color === label.color &&
          existingLabel.description === (label.description ?? null)
        ) {
          core.info(`Label '${name}' is up-to-date. Skipping.`);
          continue;
        }

        core.notice(`Label '${name}' exists with different attributes. Updating...`);
        existingLabel.color = label.color ?? "888888";
        existingLabel.description = label.description ?? null;
        await octokit.rest.issues.updateLabel({
          color: label.color,
          description: label.description,
          name: existingLabel.name,
          owner: repoOwner,
          repo: repoName,
        });
        continue;
      }

      core.notice(`Creating new label '${name}'...`);
      await octokit.rest.issues.createLabel({
        color: label.color,
        description: label.description,
        name: name,
        owner: repoOwner,
        repo: repoName,
      });
      labelResults.created.push(name);
    }

    for (const label of existingLabels.data) {
      const labelIsConfigured = Object.keys(config.labels).includes(label.name);
      if (!labelIsConfigured) {
        core.notice(`Label '${label.name}' is not configured in labels.yml. It should be deleted.`);
      }
    }

    core.setOutput("label_created", labelResults.created);
    core.setOutput("label_updated", labelResults.updated);

    core.info("Done.");
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

void run();
