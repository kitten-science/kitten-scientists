import type { Game, KGSaveData } from "../types/index.js";
export declare class SavegameLoader {
  private readonly _game;
  constructor(game: Game);
  /**
   * Conveniently wraps the savegame loading process in an async construct.
   *
   * @param data The savegame data to load. We accept `null` here for convenience
   * when dealing with `import`ed save game data.
   * @returns Nothing
   */
  load(data: string | null): Promise<void>;
  loadRaw(data: KGSaveData): Promise<void>;
}
//# sourceMappingURL=SavegameLoader.d.ts.map
