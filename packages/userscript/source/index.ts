import { SettingsStorage } from "./settings/SettingsStorage";
import { cerror, cinfo } from "./tools/Log";
import { isNil } from "./tools/Maybe";
import { SavegameLoader } from "./tools/SavegameLoader";
import { UserScript } from "./UserScript";

const devSavegame = KG_SAVEGAME ?? null;

(async () => {
  const kittenGame = await UserScript.waitForGame();

  const userScript = UserScript.getDefaultInstance();
  userScript.installSaveManager();

  // For development convenience, load a lategame save to give us more test options.
  if (!isNil(devSavegame)) {
    await new SavegameLoader(kittenGame).load(devSavegame);
  }

  // @ts-expect-error Manipulating global containers is naughty, be we want to expose the script host.
  window.kittenScientists = userScript;

  cinfo("Looking for legacy settings...");
  const legacySettings = SettingsStorage.getLegacyOptions();

  if (!isNil(legacySettings)) {
    cinfo("Using restored legacy settings.");
    userScript.loadLegacyOptions(legacySettings);
  } else {
    cinfo("No legacy settings found. Default settings will be used.");
  }

  userScript.validateGame();
  userScript.run();
})().catch(cerror);
