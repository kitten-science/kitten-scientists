import { UserScriptLoader } from "@kitten-science/kitten-scientists/UserScriptLoader.js";
import { KittenAnalysts } from "./KittenAnalysts.js";
import { cerror } from "./tools/Log.js";

(async () => {
  const userScript = await new UserScriptLoader().waitForGame(KittenAnalysts, "ka");

  window.kittenAnalysts = userScript;

  userScript.run();
})().catch(cerror);
