import { KittenScientists } from "./KittenScientists.js";
import { UserScriptLoader } from "./UserScriptLoader.js";
import { cerror } from "./tools/Log.js";

(async () => {
  const userScript = await new UserScriptLoader().waitForGame(KittenScientists, "ks");

  window.kittenScientists = userScript;

  userScript.validateGame();
  userScript.run();
})().catch(cerror);
