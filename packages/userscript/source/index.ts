import lategame from "./fixtures/lategame";
import testConfig from "./fixtures/localstorage.json";
import { Options } from "./options/Options";
import { SettingsStorage } from "./options/SettingsStorage";
import { cinfo } from "./tools/Log";
import { SavegameLoader } from "./tools/SavegameLoader";
import { UserScript } from "./UserScript";

(async () => {
  const kittenGame = await UserScript.waitForGame();
  // For development convenience, load a lategame save to give us more test options.
  await new SavegameLoader(kittenGame).load(lategame);

  const userScript = await UserScript.getDefaultInstance();

  // @ts-expect-error Manipulating global containers is naughty, be we want to expose the script host.
  window.kittenScientists = userScript;

  cinfo("Looking for legacy settings...");
  const legacySettings = SettingsStorage.getLegacySettings();
  if (legacySettings === null) {
    cinfo("No legacy settings found. Default settings will be used.");
  }
  const options = Options.parseLegacyOptions(testConfig);
  //const options = Options.parseLegacyOptions(legacySettings);
  userScript.injectOptions(options);
  userScript.run();

  /*
  setInterval(() => {
    const toExport = options.asLegacyOptions();
    SettingsStorage.setLegacySettings(toExport);
    clog("Kitten Scientists settings saved.");
  }, 30 * 1000);
  */
})();
