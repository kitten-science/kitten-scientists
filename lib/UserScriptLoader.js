import { sleep } from "@oliversalzburg/js-utils/async/async.js";
import { isNil, mustExist } from "@oliversalzburg/js-utils/data/nil.js";
import { cdebug, cinfo } from "./tools/Log.js";
export const FallbackLocale = "en-US";
// How long to wait for KG to load, in milliseconds.
const TIMEOUT_DEFAULT = 2 * 60 * 1000;
// Allows the user to define a timeout override in their browser's web storage.
// This allows users to extend the timeout period, in case their local configuration
// requires it.
const TIMEOUT_OVERRIDE =
  "localStorage" in globalThis && !isNil(localStorage["ks.timeout"])
    ? Number(localStorage["ks.timeout"])
    : undefined;
export class UserScriptLoader {
  /**
   * Stores if we caught the `game/start` signal from the game.
   */
  _gameStartSignal;
  _gameStartSignalResolver;
  _possibleEngineState;
  static tryEngineStateFromSaveData(saveDataKey, saveData) {
    const saveDataProxy = saveData;
    if (!(saveDataKey in saveDataProxy)) {
      cdebug(`Failed: \`${saveDataKey}\` not found in save data.`);
      return undefined;
    }
    const ksData = saveDataProxy.ks;
    if (!("state" in ksData)) {
      cdebug(`Failed: \`${saveDataKey}.state\` not found in save data.`);
      return undefined;
    }
    const state = ksData.state;
    if (!Array.isArray(state)) {
      cdebug(`Failed: \`${saveDataKey}.state\` not \`Array\`.`);
      return undefined;
    }
    return state[0];
  }
  async waitForGame(UserScript, saveDataKey, timeout = TIMEOUT_OVERRIDE ?? TIMEOUT_DEFAULT) {
    if (UserScriptLoader._isGameLoaded()) {
      const game = mustExist(UserScriptLoader.window.game);
      const i18nEngine = mustExist(UserScriptLoader.window.$I);
      const gameLanguage = localStorage["com.nuclearunicorn.kittengame.language"];
      return new UserScript(game, i18nEngine, gameLanguage, this._possibleEngineState);
    }
    const signals = [sleep(2000)];
    if (isNil(this._gameStartSignal) && typeof UserScriptLoader.window.dojo !== "undefined") {
      this._gameStartSignal = new Promise(resolve => {
        this._gameStartSignalResolver = resolve;
      });
      const subGameStart = UserScriptLoader.window.dojo.subscribe("game/start", () => {
        cdebug(`'game/start' signal caught. Fast-tracking script load for '${saveDataKey}'...`);
        mustExist(this._gameStartSignalResolver)(true);
        UserScriptLoader.window.dojo.unsubscribe(subGameStart);
      });
      if (saveDataKey !== undefined) {
        const subServerLoad = UserScriptLoader.window.dojo.subscribe("server/load", saveData => {
          cinfo(
            `'server/load' signal caught. Looking for script state with key '${saveDataKey}' in save data...`,
          );
          const state = UserScriptLoader.tryEngineStateFromSaveData(saveDataKey, saveData);
          if (!state) {
            cinfo(
              `The Kittens Game save data did not contain a script state for '${saveDataKey}'.`,
            );
            return;
          }
          cinfo(
            `Found key '${saveDataKey}'! Provided save data will be used as seed for next script instance.`,
          );
          this._possibleEngineState = state;
          UserScriptLoader.window.dojo.unsubscribe(subServerLoad);
        });
      }
    }
    if (!isNil(this._gameStartSignal)) {
      signals.push(this._gameStartSignal);
    }
    if (timeout < 0) {
      throw new Error(
        "Unable to find game. Giving up. Maybe the game is not exported at `window.game`?",
      );
    }
    cdebug(`Waiting for game... (timeout: ${Math.round(timeout / 1000)}s)`);
    await Promise.race(signals);
    return this.waitForGame(UserScript, saveDataKey, timeout - 2000);
  }
  static _isGameLoaded() {
    return (
      !isNil(UserScriptLoader.window.game) &&
      !Object.prototype.toString.apply(UserScriptLoader.window.game).includes("HTMLDivElement")
    );
  }
  static get window() {
    try {
      return mustExist(unsafeWindow);
    } catch (_error) {
      return window;
    }
  }
}
//# sourceMappingURL=UserScriptLoader.js.map
