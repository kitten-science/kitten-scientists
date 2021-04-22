import { UserScript } from "./UserScript";

(async () => {
  await UserScript.waitForGame();
  const userScript = UserScript.install();
})();
