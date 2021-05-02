import { Options } from "./options/Options";
import { SettingsStorage } from "./options/SettingsStorage";
import { clog } from "./tools/Log";
import { UserScript } from "./UserScript";

(async () => {
  await UserScript.waitForGame();
  const userScript = await UserScript.getDefaultInstance();

  const legacySettings = SettingsStorage.getLegacySettings();
  //const options = Options.parseLegacyOptions(testConfig);
  const options = Options.parseLegacyOptions(legacySettings);
  userScript.injectOptions(options);
  userScript.run();

  setInterval(() => {
    const toExport = options.asLegacyOptions();
    SettingsStorage.setLegacySettings(toExport);
    clog("Kitten Scientists settings saved.");
  }, 30 * 1000);
})();
