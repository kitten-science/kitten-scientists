import testConfig from "./fixtures/localstorage.json";
import { Options } from "./options/Options";
import { SettingsStorage } from "./options/SettingsStorage";
import { cinfo } from "./tools/Log";
import { UserScript } from "./UserScript";

(async () => {
  await UserScript.waitForGame();
  const userScript = await UserScript.getDefaultInstance();

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
