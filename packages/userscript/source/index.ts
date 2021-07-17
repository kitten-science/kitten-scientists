import devSavegame from "./fixtures/savegame";
import devSettings from "./fixtures/settings";
import { Options } from "./options/Options";
import { SettingsStorage } from "./options/SettingsStorage";
import { cinfo } from "./tools/Log";
import { isNil } from "./tools/Maybe";
import { SavegameLoader } from "./tools/SavegameLoader";
import { UserScript } from "./UserScript";

(async () => {
  const kittenGame = await UserScript.waitForGame();

  // For development convenience, load a lategame save to give us more test options.
  if (!isNil(devSavegame)) {
    await new SavegameLoader(kittenGame).load(devSavegame);
  }

  const userScript = await UserScript.getDefaultInstance();

  // @ts-expect-error Manipulating global containers is naughty, be we want to expose the script host.
  window.kittenScientists = userScript;

  cinfo("Looking for legacy settings...");
  const legacySettings = SettingsStorage.getLegacySettings();
  if (legacySettings === null) {
    cinfo("No legacy settings found. Default settings will be used.");
  }

  if (!isNil(devSettings)) {
    const options = Options.parseLegacyOptions(devSettings);
    userScript.injectOptions(options);
  }

  userScript.run();

  /*
  setInterval(() => {
    const toExport = options.asLegacyOptions();
    SettingsStorage.setLegacySettings(toExport);
    clog("Kitten Scientists settings saved.");
  }, 30 * 1000);
  */
})();
