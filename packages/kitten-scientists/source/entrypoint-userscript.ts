import { cerror } from "./tools/Log.js";
import { UserScript } from "./UserScript.js";

(async () => {
  await UserScript.waitForGame();

  const userScript = UserScript.getDefaultInstance();

  // @ts-expect-error Manipulating global containers is naughty, be we want to expose the script host.
  window.kittenScientists = userScript;

  userScript.validateGame();
  userScript.run();
})().catch(cerror);
