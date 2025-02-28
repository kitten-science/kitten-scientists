import type { ConstructorOf } from "@oliversalzburg/js-utils/core.js";
import type { SupportedLocale } from "./Engine.js";
export declare const FallbackLocale: SupportedLocale;
export declare class UserScriptLoader {
  /**
   * Stores if we caught the `game/start` signal from the game.
   */
  private _gameStartSignal;
  private _gameStartSignalResolver;
  private _possibleEngineState;
  static tryEngineStateFromSaveData(saveDataKey: string, saveData: unknown): unknown;
  waitForGame<TUserScript>(
    UserScript: ConstructorOf<TUserScript>,
    saveDataKey?: string,
    timeout?: number,
  ): Promise<TUserScript>;
  private static _isGameLoaded;
  static get window(): Window;
}
//# sourceMappingURL=UserScriptLoader.d.ts.map
