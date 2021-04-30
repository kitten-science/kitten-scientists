import { UserScript } from "./UserScript";
import testConfig from "./fixtures/localstorage.json";
import { Options } from "./options/Options";

(async () => {
  await UserScript.waitForGame();
  const userScript = await UserScript.getDefaultInstance();

  const options = Options.parseLegacyOptions(testConfig);
  userScript.injectOptions(options);
  userScript.run();
})();
