import { cerror, UserScriptLoader } from "@kitten-science/kitten-scientists";
import { KittenEngineers } from "./KittenEngineers.js";

(async () => {
  const userScript = await new UserScriptLoader().waitForGame(KittenEngineers, "ke");

  // @ts-expect-error Manipulating global containers is naughty, be we want to expose the script host.
  window.kittenEngineers = userScript;

  userScript.run();
})().catch(cerror);
