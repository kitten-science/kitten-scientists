import { UserScript } from "./UserScript";
import testConfig from "./fixtures/localstorage.json";
import { OptionsExt } from "./options/OptionsExt";

(async () => {
  await UserScript.waitForGame();
  const userScript = await UserScript.getDefaultInstance();

  const options = OptionsExt.parse(testConfig);
  userScript.injectOptions(options);
  
  userScript.run();
})();
