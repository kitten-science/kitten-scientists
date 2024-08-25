/**
 * Constructs a version number from:
 * - the `version` field in the `package.json` in the current working directory
 * - the value of `process.env.DEV_BUILD` being `"true"` to indicate a development snapshot build
 * - the value of `process.env.NIGHTLY_BUILD` being `"true"` to indicate a nightly snapshot build
 * - the value of `process.env.GITHUB_SHA`
 *
 * Given the context of the Automatic Semantic Releases Action, this script assumes that the `package.json` contains
 * a future, unreleased version number, from which to derive snapshot builds version numbers.
 * This implies that you would want to bump the version number in your `package.json` right after every tagged release.
 */

"use strict";

const { resolve } = require("node:path");

const manifest = require(resolve("package.json"));
const isDevBuild = String(process.env.DEV_BUILD) === "true";
const isNightlyBuild = String(process.env.NIGHTLY_BUILD) === "true";

function getDateString() {
  const date = new Date();
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}${month}${day}`;
}

const versionString = [
  manifest.version,
  isDevBuild ? "-dev" : "",
  isNightlyBuild ? `-${getDateString()}` : "",
  (isDevBuild || isNightlyBuild) && process.env.GITHUB_SHA
    ? `-${String(process.env.GITHUB_SHA).substring(0, 7)}`
    : "",
].join("");

process.stdout.write(versionString);
