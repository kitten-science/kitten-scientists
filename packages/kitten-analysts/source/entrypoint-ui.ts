import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import { readdir, readFile } from "fs/promises";
import { JSDOM } from "jsdom";
import { join } from "path";
import { LOCAL_STORAGE_PATH } from "./globals.js";

const main = async () => {
  const dom = await JSDOM.fromURL("http://localhost:8080/headless.html", {
    pretendToBeVisual: true,
    resources: "usable",
    runScripts: "dangerously",
  });

  try {
    const entries = await readdir(LOCAL_STORAGE_PATH);
    for (const entry of entries) {
      const path = join(LOCAL_STORAGE_PATH, entry);
      const value = await readFile(path, "utf-8");
      process.stderr.write(`Setting '${entry}' to contents of '${path}'...\n`);
      dom.window.localStorage.setItem(entry, value);
    }
  } catch (_error) {
    process.stderr.write(`Unable to read entries from '${LOCAL_STORAGE_PATH}'.\n`);
  }

  process.stderr.write("Successfully initialized.\n");
};

main().catch(redirectErrorsToConsole(console));
