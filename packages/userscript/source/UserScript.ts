import { isNil, Maybe, mustExist } from "./tools/Maybe";
import { sleep } from "./tools/Sleep";

declare global {
  const unsafeWindow: Window;
  interface Window { gamePage?: Maybe<GamePage>; $I?: Maybe<I18nEngine>; }
}

export interface GamePage { }
export interface I18nEngine { }
export enum SupportedLanguages {
  English = "en"
}

export class UserScript {
  private readonly _gamePage: GamePage;
  private readonly _i18nEngine: I18nEngine;
  private readonly _language: SupportedLanguages;

  constructor(gamePage: GamePage, i18nEngine: I18nEngine, language: SupportedLanguages = SupportedLanguages.English) {
    console.info("Kitten Scientists constructed.");

    this._gamePage = gamePage;
    this._i18nEngine = i18nEngine;
    this._language = language;
  }

  static async waitForGame(timeout: number = 30000): Promise<void> {
    console.debug(`Waiting for game... (timeout: ${Math.round(timeout / 1000)}s)`);

    if (timeout < 0) {
      throw new Error("Unable to find game page.");
    }

    if (UserScript._isGameLoaded()) {
      return;
    }

    await sleep(2000);
    return UserScript.waitForGame(timeout - 2000);
  }

  static async install(): Promise<UserScript> {
    return new UserScript(mustExist(unsafeWindow.gamePage), mustExist(unsafeWindow.$I), localStorage['com.nuclearunicorn.kittengame.language']);
  }

  private static _isGameLoaded(): boolean {
    return !isNil(unsafeWindow.gamePage);
  }
}
