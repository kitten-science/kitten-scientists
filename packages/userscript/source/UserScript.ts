import { isNil, Maybe } from "./tools/Maybe";
import { sleep } from "./tools/Sleep";

declare global {
  interface Window { gamePage?: Maybe<GamePage>; }
}

export interface GamePage { }

export class UserScript {
  async waitForGame(timeout: number = 10000): Promise<this> {
    if (timeout < 0) {
      throw new Error("Unable to find game page.");
    }

    if (this._isGameLoaded()) {
      return this;
    }

    await sleep(2000);
    return this.waitForGame(timeout - 2000);
  }

  private _isGameLoaded(): boolean {
    return !isNil(window.gamePage);
  }
}
