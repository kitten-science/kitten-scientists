import { SettingsStorage } from "./settings/SettingsStorage";
import { cerror, cinfo } from "./tools/Log";
import { isNil } from "./tools/Maybe";
import { SavegameLoader } from "./tools/SavegameLoader";
import { UserScript } from "./UserScript";

const devSavegame = KG_SAVEGAME ?? null;

(async () => {
  const kittenGame = await UserScript.waitForGame();

  const userScript = UserScript.getDefaultInstance();

  // For development convenience, load a lategame save to give us more test options.
  if (!isNil(devSavegame)) {
    await new SavegameLoader(kittenGame).load(devSavegame);
  }

  // @ts-expect-error Manipulating global containers is naughty, be we want to expose the script host.
  window.kittenScientists = userScript;

  cinfo("Looking for legacy options...");
  const legacySettings = SettingsStorage.getLegacyOptions();

  if (!isNil(legacySettings)) {
    cinfo("Using restored legacy options.");
    userScript.loadLegacyOptions(legacySettings);
  } else {
    cinfo("No legacy options found. Default configuration will be used.");
  }

  userScript.validateGame();
  userScript.run();
})().catch(cerror);
