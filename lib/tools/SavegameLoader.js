export class SavegameLoader {
  _game;
  constructor(game) {
    this._game = game;
  }
  /**
   * Conveniently wraps the savegame loading process in an async construct.
   *
   * @param data The savegame data to load. We accept `null` here for convenience
   * when dealing with `import`ed save game data.
   * @returns Nothing
   */
  load(data) {
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
  loadRaw(data) {
    const compressed = this._game.compressLZData(JSON.stringify(data));
    return this.load(compressed);
  }
}
//# sourceMappingURL=SavegameLoader.js.map
