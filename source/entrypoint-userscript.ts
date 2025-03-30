import { KittenScientists } from "./KittenScientists.js";
import { UserScriptLoader } from "./UserScriptLoader.js";

(async () => {
  const userScript = await new UserScriptLoader().waitForGame(KittenScientists, "ks");

  window.kittenScientists = userScript;

  userScript.validateGame();
  userScript.run();
})().catch(console.error);
