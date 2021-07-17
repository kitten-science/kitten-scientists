import { GamePage } from "../types";

export class SavegameLoader {
  private readonly _gamePage: GamePage;

  constructor(gamePage: GamePage) {
    this._gamePage = gamePage;
  }

  /**
   * Conveniently wraps the savegame loading process in an async construct.
   * @param data The savegame data to load.
   * @returns Nothing
   */
  load(data: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this._gamePage.saveImportDropboxText(data, error => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }
}
