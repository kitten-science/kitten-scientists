import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import { KittenScientists } from "./KittenScientists.js";
import { UserScriptLoader } from "./UserScriptLoader.js";

export const main = async () => {
  const userScript = await new UserScriptLoader().waitForGame(KittenScientists, "ks");

  UserScriptLoader.window.kittenScientists = userScript;

  userScript.validateGame();
  userScript.run();
};

// We auto-ignite the loader, unless we're running in GreaseMonkey (content script).
// The content script loader will handle the orchestration of that scenario.
if (typeof GM === "undefined" || GM?.info?.scriptHandler === "Tampermonkey") {
  main().catch(redirectErrorsToConsole(console));
}
