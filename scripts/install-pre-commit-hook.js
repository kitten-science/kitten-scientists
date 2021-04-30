#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs/promises");
const path = require("path");

(async () => {
  console.log("Installing pre-commit hook...");

  const thisDirectory = __dirname;
  const monoRepoRoot = path.resolve(thisDirectory, "..");
  const gitDirectory = path.resolve(monoRepoRoot, ".git");
  const hooksDirectory = path.resolve(gitDirectory, "hooks");

  console.log(`Installing hook into '${hooksDirectory}'...`);

  const hookSourceFilename = path.resolve(thisDirectory, "pre-commit-hook");
  const hookFile = await fs.readFile(hookSourceFilename, "utf-8");
  const hookFilename = path.resolve(hooksDirectory, "pre-commit");
  await fs.writeFile(hookFilename, hookFile, "utf-8");

  console.log("Done.");
})();
