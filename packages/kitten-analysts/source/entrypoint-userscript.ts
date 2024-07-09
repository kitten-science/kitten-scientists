import { cerror, UserScriptLoader } from "@kitten-science/kitten-scientists";
import { KittenAnalysts } from "./KittenAnalysts.js";

(async () => {
  const userScript = await new UserScriptLoader().waitForGame(KittenAnalysts, "ke");

  // @ts-expect-error Manipulating global containers is naughty, be we want to expose the script host.
  window.kittenAnalysts = userScript;

  userScript.run();
})().catch(cerror);
