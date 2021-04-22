import { UserScript } from "./UserScript";

const userScript = new UserScript();
(async () => {
  await userScript.waitForGame();
})();
