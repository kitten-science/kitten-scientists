import { type Locale } from "date-fns/locale";
import { type EngineState, type SupportedLocale } from "../Engine.js";
import { KittenScientists } from "../KittenScientists.js";
import type { SettingOptions } from "../settings/Settings.js";
import type { StateSettings } from "../settings/StateSettings.js";
import { Unique } from "../tools/Entries.js";
import type { KGSaveData } from "../types/index.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
export type StoredGame = {
  label: string;
  game: KGSaveData;
  timestamp: string;
};
export type StoredState = {
  label: string;
  state: EngineState;
  timestamp: string;
};
export declare class StateManagementUi extends SettingsPanel<StateSettings> {
  readonly games: Unique<StoredGame>[];
  /**
   * The states persisted to local storage. They use Unique<T> so that when we
   * provide a state to the engine to load or get a state from the engine to
   * save, we are not accidentally sharing a reference to a live object.
   */
  readonly states: Unique<StoredState>[];
  readonly gameList: SettingsList;
  readonly stateList: SettingsList;
  readonly locale: Locale;
  constructor(
    host: KittenScientists,
    settings: StateSettings,
    locale: SettingOptions<SupportedLocale>,
  );
  private _loadGames;
  private _storeGames;
  private _loadStates;
  private _storeStates;
  refreshUi(): void;
  private _refreshGameList;
  private _refreshStateList;
  copyState(state?: EngineState): Promise<void>;
  copyGame(game?: KGSaveData): Promise<void>;
  import(): void;
  storeGame(game?: KGSaveData, label?: string): string | null;
  storeState(state?: EngineState, label?: string): string | null;
  storeStateFactoryDefaults(): void;
  storeAutoSave(state: EngineState): void;
  exportStateAll(): void;
  loadGame(game: KGSaveData): Promise<void>;
  loadState(state: EngineState): void;
  loadAutoSave(): void;
  updateGame(game: Unique<StoredGame>, newGame: KGSaveData): void;
  updateState(state: Unique<StoredState>, newState: EngineState): void;
  deleteGame(game: Unique<StoredGame>, force?: boolean): void;
  deleteState(state: Unique<StoredState>, force?: boolean): void;
  private _destructiveActionPrevented;
}
//# sourceMappingURL=StateManagementUi.d.ts.map
