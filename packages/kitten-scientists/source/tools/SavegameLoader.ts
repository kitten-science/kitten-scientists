import type { Game, KGSaveData } from "../types/index.js";

export class SavegameLoader {
  private readonly _game: Game;

  constructor(game: Game) {
    this._game = game;
  }

  /**
   * Conveniently wraps the savegame loading process in an async construct.
   *
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

      this._game.saveImportDropboxText(data, error => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }

  loadRaw(data: KGSaveData): Promise<void> {
    const compressed = this._game.compressLZData(JSON.stringify(data));
    return this.load(compressed);
  }
}
