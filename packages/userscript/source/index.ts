import { Options } from "./options/Options";
import { SettingsStorage } from "./options/SettingsStorage";
import { cinfo } from "./tools/Log";
import { isNil } from "./tools/Maybe";
import { SavegameLoader } from "./tools/SavegameLoader";
import { UserScript } from "./UserScript";

const devSavegame = KG_SAVEGAME ?? null;
const devSettings = KS_SETTINGS ?? null;

(async () => {
  const kittenGame = await UserScript.waitForGame();

  // For development convenience, load a lategame save to give us more test options.
  if (!isNil(devSavegame)) {
    await new SavegameLoader(kittenGame).load(devSavegame);
  }

  const userScript = UserScript.getDefaultInstance();

  // @ts-expect-error Manipulating global containers is naughty, be we want to expose the script host.
  window.kittenScientists = userScript;

  cinfo("Looking for legacy settings...");
  const legacySettings = SettingsStorage.getLegacySettings();

  if (!isNil(devSettings)) {
    cinfo("Using development settings snapshot.");
    const options = Options.parseLegacyOptions(devSettings);
    userScript.injectOptions(options);
  } else if (!isNil(legacySettings)) {
    cinfo("Using restored legacy settings.");
    const options = Options.parseLegacyOptions(legacySettings);
    userScript.injectOptions(options);
  } else {
    cinfo("No legacy settings found. Default settings will be used.");
  }

  userScript.validateGame();
  userScript.run();
})().catch(console.error);
