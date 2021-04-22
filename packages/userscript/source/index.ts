import { UserScript } from "./UserScript";

(async () => {
  await UserScript.waitForGame();
  const userScript = await UserScript.getDefaultInstance();
  userScript.run();
})();
