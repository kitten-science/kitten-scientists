import { redirectErrorsToStream } from "@oliversalzburg/js-utils/errors/stream.js";
import { readFile } from "fs/promises";
import { JSDOM } from "jsdom";
import { join } from "path";
import { LOCAL_STORAGE_PATH } from "./globals.js";
import "./KittenAnalysts.js";

const main = async () => {
  const dom = await JSDOM.fromURL("http://localhost:8080/headless.html", {
    pretendToBeVisual: true,
    resources: "usable",
    runScripts: "dangerously",
  });

  const ephemeralPath = join(LOCAL_STORAGE_PATH, "ks-internal-savestate.json");

  try {
    const lsEntry = "com.nuclearunicorn.kittengame.savedata";
    const value = await readFile(ephemeralPath, "utf-8");
    process.stderr.write(`Setting '${lsEntry}' to contents of '${ephemeralPath}'...\n`);
    dom.window.localStorage.setItem(lsEntry, value);
  } catch (_error) {
    process.stderr.write(`Unable to save state from '${ephemeralPath}'.\n`);
  }

  process.stderr.write("Successfully initialized.\n");
};

main().catch(redirectErrorsToStream(process.stderr));
