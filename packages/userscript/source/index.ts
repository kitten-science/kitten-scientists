import { SettingsStorage } from "./settings/SettingsStorage";
import { cerror, cinfo, cwarn } from "./tools/Log";
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
    cwarn("DEPRECATED: Using restored legacy options.");
    cwarn("1. Your configuration will be migrated to modern storage.");
    cwarn(
      "2. Your existing configuration will be moved to `cbc.kitten-scientists.backup` in your browser's LocalStorage."
    );
    userScript.loadLegacyOptions(legacySettings);
    SettingsStorage.backupLegacyOptions();
    SettingsStorage.deleteLegacyOptions();
  } else {
    cinfo("No legacy options found. Using Kittens Game integration.");
  }

  userScript.validateGame();
  userScript.run();
})().catch(cerror);
