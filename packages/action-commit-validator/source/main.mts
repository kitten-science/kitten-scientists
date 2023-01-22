import * as core from "@actions/core";
import * as github from "@actions/github";
import { FromSchema } from "json-schema-to-ts";
import { CommitsSchema } from "./CommitsSchema.mjs";

type CommitsResponse = FromSchema<typeof CommitsSchema>;

async function run() {
  const prNumber = github.context.payload.number as string | undefined;
  if (!prNumber) {
    throw new Error("Unable to determine PR number!");
  }

  const token = core.getInput("repo_token", { required: true });
  const octokit = github.getOctokit(token);
  const unsafeResponse = await octokit.request(
    "GET /repos/{owner}/{repo}/pulls/{pull_number}/commits{?per_page,page}",
    {
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      pull_number: Number.parseInt(prNumber),
    }
  );
  const commits = unsafeResponse.data as CommitsResponse;

  const acceptBreakingChanges = core.getBooleanInput("accept_breaking_changes", {
    required: false,
  });
  const acceptedScopes = core
    .getMultilineInput("accepted_scopes", { required: false })
    .filter(line => line !== "");
  const anyScopeAccepted = acceptedScopes.length === 0;
  const acceptedTypes = core
    .getMultilineInput("accepted_types", { required: false })
    .filter(line => line !== "");
  const emojiAllowed = core.getBooleanInput("accept_emoji", { required: false });
  const requireConventional = core.getBooleanInput("require_conventional", { required: false });
  const requireScope = core.getBooleanInput("require_scope", { required: false });

  const parseCommitMessage =
    /^(?<type>[a-z]+)(?:\((?<scope>[\w-]+)\))?(?<breaking>!)?: (?<message>[^\n]+)$/m;
  const hasEmoji = /\p{Extended_Pictographic}/u;

  for (const commitInfo of commits) {
    core.info(`Analyzing commit ${commitInfo.sha} with message: '${commitInfo.commit.message}'`);

    const messageParts = parseCommitMessage.exec(commitInfo.commit.message);
    let type, scope, breaking, message;
    if (messageParts === null || messageParts.groups === undefined) {
      core.warning(`Unable to parse commit message: '${commitInfo.commit.message}'`);

      message = commitInfo.commit.message;
    } else {
      type = messageParts?.groups?.type;
      scope = messageParts?.groups?.scope;
      breaking = messageParts?.groups?.breaking;
      message = messageParts?.groups?.message;
    }

    core.debug(JSON.stringify({ type, scope, breaking, message }));

    if (requireConventional && !type) {
      core.setFailed("Missing type.");
    }

    if (type && !acceptedTypes.includes(type)) {
      core.setFailed(`Type '${type}' is not acceptable. Accepted: ${acceptedTypes.join(", ")}`);
    }

    if (requireScope && !scope) {
      core.setFailed("Missing scope.");
    }

    if (!acceptBreakingChanges && breaking) {
      core.setFailed("Breaking changes are not accepted.");
    }

    if (scope && !anyScopeAccepted && !acceptedScopes.includes(scope)) {
      core.setFailed(`Scope '${scope}' is not acceptable. Accepted: ${acceptedScopes.join(", ")}`);
    }

    if (!emojiAllowed && hasEmoji.test(message)) {
      core.setFailed("Emoji are not accepted.");
    }
  }
}

void run();
