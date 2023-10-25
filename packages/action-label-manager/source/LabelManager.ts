import core from "@actions/core";
import { Context } from "@actions/github/lib/context";
import { type GitHub } from "@actions/github/lib/utils";
import YAML from "yaml";

export type LabelManagerOptions = {
  context: Context;
  core: typeof core;
  labelsYaml: string;
  octokit: InstanceType<typeof GitHub>;
};

export class LabelManager {
  #options: LabelManagerOptions;

  constructor(options: LabelManagerOptions) {
    this.#options = options;
  }

  async main() {
    const labelsYaml = this.#options.labelsYaml;
    const config = YAML.parse(labelsYaml) as {
      labels: Record<string, { color?: string; description?: string }>;
    };

    this.#options.core.debug("Configured labels:");
    for (const [name, label] of Object.entries(config.labels)) {
      this.#options.core.debug(name);
      if (label.color) {
        this.#options.core.debug(`  Color: ${label.color}`);
      }
      if (label.description) {
        this.#options.core.debug(`  Descr: ${label.description}`);
      }
    }

    const octokit = this.#options.octokit;

    const existingLabels = await octokit.rest.issues.listLabelsForRepo({
      owner: this.#options.context.repo.owner,
      repo: this.#options.context.repo.repo,
    });

    this.#options.core.info("Updating labels...");
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
          this.#options.core.info(`Label '${name}' is up-to-date. Skipping.`);
          continue;
        }

        this.#options.core.notice(`Label '${name}' exists with different attributes. Updating...`);
        existingLabel.color = label.color ?? "888888";
        existingLabel.description = label.description ?? null;
        await octokit.rest.issues.updateLabel({
          color: label.color,
          description: label.description,
          name: existingLabel.name,
          owner: this.#options.context.repo.owner,
          repo: this.#options.context.repo.repo,
        });
        continue;
      }

      this.#options.core.notice(`Creating new label '${name}'...`);
      await octokit.rest.issues.createLabel({
        color: label.color,
        description: label.description,
        name: name,
        owner: this.#options.context.repo.owner,
        repo: this.#options.context.repo.repo,
      });
      labelResults.created.push(name);
    }

    for (const label of existingLabels.data) {
      const labelIsConfigured = Object.keys(config.labels).includes(label.name);
      if (!labelIsConfigured) {
        this.#options.core.notice(
          `Label '${label.name}' is not configured in labels.yml. It should be deleted.`,
        );
      }
    }

    this.#options.core.setOutput("label_created", labelResults.created);
    this.#options.core.setOutput("label_updated", labelResults.updated);

    this.#options.core.info("Done.");
  }
}
