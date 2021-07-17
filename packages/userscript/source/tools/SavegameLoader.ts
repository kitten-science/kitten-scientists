import { GamePage } from "../types";

export class SavegameLoader {
  private readonly _gamePage: GamePage;

  constructor(gamePage: GamePage) {
    this._gamePage = gamePage;
  }

  /**
   * Conveniently wraps the savegame loading process in an async construct.
   * @param data The savegame data to load. We accept `null` here for convenience
   * when dealing with `import`ed save game data.
   * @returns Nothing
   */
  load(data: string | null): Promise<void> {
    return new Promise((resolve, reject) => {
      if (data === null) {
        resolve();
        return;
      }

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
