import { KittenScientists } from "./KittenScientists.js";
import { cerror } from "./tools/Log.js";
import { UserScriptLoader } from "./UserScriptLoader.js";

(async () => {
  const userScript = await new UserScriptLoader().waitForGame(KittenScientists, "ks");

  // @ts-expect-error Manipulating global containers is naughty, be we want to expose the script host.
  window.kittenScientists = userScript;

  userScript.validateGame();
  userScript.run();
})().catch(cerror);
