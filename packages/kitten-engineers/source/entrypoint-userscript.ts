import { UserScriptLoader } from "@kitten-science/kitten-scientists/UserScriptLoader.js";
import { cerror } from "@kitten-science/kitten-scientists/tools/Log.js";
import { KittenEngineers } from "./KittenEngineers.js";

(async () => {
  const userScript = await new UserScriptLoader().waitForGame(KittenEngineers, "ke");

  window.kittenEngineers = userScript;

  userScript.run();
})().catch(cerror);
