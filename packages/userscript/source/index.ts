import { UserScript } from "./UserScript";
import testConfig from "./fixtures/localstorage.json";
import { OptionsExt } from "./options/OptionsExt";

(async () => {
  await UserScript.waitForGame();
  const userScript = await UserScript.getDefaultInstance();

  const options = OptionsExt.parseLegacyOptions(testConfig);
  userScript.run();

  userScript.injectOptions(options);
})();
