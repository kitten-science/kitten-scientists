import { KGNetSavePersisted } from "@kitten-science/kitten-scientists/types/index.js";
import { redirectErrorsToStream } from "@oliversalzburg/js-utils/errors/stream.js";
import { readFile } from "fs/promises";
import { JSDOM } from "jsdom";
import { decompressFromUTF16 } from "lz-string";
import { join } from "path";
import { LOCAL_STORAGE_PATH } from "./globals.js";

const HOSTNAME_KG = process.env.HOSTNAME_KG ?? "localhost";
const PORT_HTTP_KG = process.env.PORT_HTTP_KG ? Number(process.env.PORT_HTTP_KG) : 8080;

const main = async () => {
  const dom = await JSDOM.fromURL(`http://${HOSTNAME_KG}:${PORT_HTTP_KG}/headless.html`, {
    pretendToBeVisual: true,
    resources: "usable",
    runScripts: "dangerously",
  });

  const ephemeralPath = join(LOCAL_STORAGE_PATH, "ka-internal-savestate.json");

  try {
    const lsEntry = "com.nuclearunicorn.kittengame.savedata";
    process.stderr.write(`Reading '${ephemeralPath}'...\n`);
    const value = await readFile(ephemeralPath, "utf-8");

    process.stderr.write(`File contents: '${value.substring(0, 30).replaceAll("\n", "")}'\n`);

    const cloudSave = JSON.parse(value) as KGNetSavePersisted;

    process.stderr.write(`Cloud save is typeof: '${typeof cloudSave}'\n`);
    process.stderr.write(`Cloud save save data is typeof: '${typeof cloudSave.saveData}'\n`);

    const saveDataString = decompressFromUTF16(cloudSave.saveData);
    process.stderr.write(
      `Decompressed data string: '${saveDataString.substring(0, 30).replaceAll("\n", "")}'\n`,
    );

    process.stderr.write(`Setting '${lsEntry}' to save game from '${ephemeralPath}'...\n`);
    dom.window.localStorage.setItem(lsEntry, saveDataString);
  } catch (_error) {
    process.stderr.write(`Unable to read save state from '${ephemeralPath}'.\n`);
  }

  process.stderr.write("Successfully initialized.\n");
};

["SIGINT", "SIGTERM", "SIGQUIT"].forEach(signal => process.on(signal, () => process.exit()));

main().catch(redirectErrorsToStream(process.stderr));
