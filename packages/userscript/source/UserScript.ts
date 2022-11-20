import JQuery from "jquery";
import { Engine, EngineState, SupportedLanguages } from "./Engine";

import { BonfireSettings } from "./settings/BonfireSettings";
import { EngineSettings } from "./settings/EngineSettings";
import { Options } from "./settings/Options";
import { ReligionSettings } from "./settings/ReligionSettings";
import { ScienceSettings } from "./settings/ScienceSettings";
import { LegacyStorage, SettingsStorage } from "./settings/SettingsStorage";
import { SpaceSettings } from "./settings/SpaceSettings";
import { TimeControlSettings } from "./settings/TimeControlSettings";
import { TimeSettings } from "./settings/TimeSettings";
import { TradeSettings } from "./settings/TradeSettings";
import { VillageSettings } from "./settings/VillageSettings";
import { WorkshopSettings } from "./settings/WorkshopSettings";
import { cdebug, cerror, cinfo, cwarn } from "./tools/Log";
import { isNil, Maybe, mustExist } from "./tools/Maybe";
import { sleep } from "./tools/Sleep";
import { GamePage } from "./types";
import { UserInterface } from "./ui/UserInterface";

declare global {
  const KG_SAVEGAME: string | null;
  const KS_VERSION: string | null;
  let unsafeWindow: Window | undefined;
  interface Window {
    $: JQuery;
    $I?: Maybe<I18nEngine>;
    dojo: {
      clone: <T>(subject: T) => T;
      subscribe: (event: string, handler: (...args: any[]) => void) => void;
    };
    gamePage?: Maybe<GamePage>;
    LZString: {
      compressToBase64: (input: string) => string;
      compressToUTF16: (input: string) => string;
      decompressFromBase64: (input: string) => string;
      decompressFromUTF16: (input: string) => string;
    };
  }
}

export type I18nEngine = (key: string, args?: Array<number | string>) => string;

export const DefaultLanguage: SupportedLanguages = "en";

export class UserScript {
  readonly gamePage: GamePage;

  /**
   * A function in the game that allows to retrieve translated messages.
   *
   * Ideally, you should never access this directly and instead use the
   * i18n interface provided by `Engine`.
   */
  readonly i18nEngine: I18nEngine;

  /**
   * The currently selected language.
   */
  private _language: SupportedLanguages;

  get language() {
    return this._language;
  }

  /**
   * Stores if we caught the `game/start` signal from the game.
   */
  private static _gameStartSignal: Promise<boolean>;
  private static _gameStartSignalResolver: undefined | ((value: boolean) => void);

  private static _possibleEngineState: EngineState | undefined = undefined;

  private _userInterface: UserInterface;
  engine: Engine;

  constructor(
    gamePage: GamePage,
    i18nEngine: I18nEngine,
    language: SupportedLanguages = DefaultLanguage
  ) {
    cinfo("Kitten Scientists constructed.");

    this.gamePage = gamePage;
    this.i18nEngine = i18nEngine;
    this._language = language;

    this.engine = new Engine(this);
    this._userInterface = new UserInterface(this);
    this._userInterface.construct();
    this._userInterface.refreshUi();
  }

  /**
   * Runs some validations against the game to determine if internal control
   * structures still match up with expectations.
   * Issues should be logged to the console.
   */
  validateGame() {
    ScienceSettings.validateGame(this.gamePage, this.engine.scienceManager.settings);
    SpaceSettings.validateGame(this.gamePage, this.engine.spaceManager.settings);
    WorkshopSettings.validateGame(this.gamePage, this.engine.workshopManager.settings);
  }

  run(): void {
    if (!this.engine.isLanguageSupported(this._language)) {
      cwarn(
        `Requested language '${this._language}' is not available. Falling back to '${DefaultLanguage}'.`
      );
      this._language = DefaultLanguage;
    }

    // Increase messages displayed in log
    // TODO: This should be configurable.
    this.gamePage.console.maxMessages = 1000;

    this.refreshUi();

    if (this.engine.settings.enabled) {
      this.engine.start(true);
    }

    cinfo("Kitten Scientists initialized.");
  }

  refreshUi() {
    this._userInterface.refreshUi();
  }

  loadLegacyOptions(source: LegacyStorage) {
    this.engine.stateLoad({
      v: KS_VERSION ?? "latest",
      bonfire: BonfireSettings.fromLegacyOptions(source),
      engine: EngineSettings.fromLegacyOptions(source),
      religion: ReligionSettings.fromLegacyOptions(source),
      science: ScienceSettings.fromLegacyOptions(source),
      space: SpaceSettings.fromLegacyOptions(source),
      time: TimeSettings.fromLegacyOptions(source),
      timeControl: TimeControlSettings.fromLegacyOptions(source),
      trade: TradeSettings.fromLegacyOptions(source),
      village: VillageSettings.fromLegacyOptions(source),
      workshop: WorkshopSettings.fromLegacyOptions(source),
    });
  }

  getLegacyOptions() {
    return Options.asLegacyOptions({
      bonfire: this.engine.bonfireManager.settings,
      engine: this.engine.settings,
      religion: this.engine.religionManager.settings,
      science: this.engine.scienceManager.settings,
      space: this.engine.spaceManager.settings,
      time: this.engine.timeManager.settings,
      timeControl: this.engine.timeControlManager.settings,
      trading: this.engine.tradeManager.settings,
      village: this.engine.villageManager.settings,
      workshop: this.engine.workshopManager.settings,
    });
  }

  getSettings(): EngineState {
    return this.engine.stateSerialize();
  }
  encodeSettings(settings: EngineState) {
    const settingsString = JSON.stringify(settings);
    return window.LZString.compressToBase64(settingsString);
  }
  async copySettings() {
    const settings = this.getSettings();
    const compressedSettings = this.encodeSettings(settings);
    await window.navigator.clipboard.writeText(compressedSettings);
    this.engine.imessage("settings.copied");
  }

  setSettings(settings: EngineState) {
    cinfo("Loading engine state...");
    this.engine.stateLoad(settings);
    this._userInterface.refreshUi();
  }
  decodeSettings(compressedSettings: string): EngineState {
    const settingsString = window.LZString.decompressFromBase64(compressedSettings);
    return JSON.parse(settingsString) as EngineState;
  }
  importSettings(compressedSettings: string) {
    const settings = this.decodeSettings(compressedSettings);
    this.setSettings(settings);
    this.engine.imessage("settings.imported");
  }

  installSaveManager() {
    cinfo("EXPERIMENTAL: Installing save game manager...");
    this.gamePage.managers.push(this.saveManager);
  }

  /**
   * Experimental save manager for Kittens Game.
   * It can be injected manually into the game to cause KS settings to be
   * injected into the save blob.
   *
   *  game.managers.push(kittenScientists.saveManager)
   */
  get saveManager() {
    return this._saveManager;
  }

  private _saveManager = {
    load: (saveData: Record<string, unknown>) => {
      cwarn("EXPERIMENTAL: Looking for Kitten Scientists engine state in save data...");

      const state = UserScript._tryEngineStateFromSaveData(saveData);
      if (!state) {
        return;
      }

      cwarn(
        "EXPERIMENTAL: Found Kitten Scientists engine state in save data. These will NOT be loaded at this time."
      );
      //this.engine.stateLoad(state);
    },
    resetState: () => null,
    save: (saveData: Record<string, unknown>) => {
      cwarn("EXPERIMENTAL: Injecting Kitten Scientists engine state into save data...");
      saveData.ks = { state: [this.getSettings()] };

      // Also save to legacy storage.
      SettingsStorage.setLegacyOptions(this.getLegacyOptions());
      cinfo("Kitten Scientists settings (legacy) saved.");
    },
  };

  private static _tryEngineStateFromSaveData(
    saveData: Record<string, unknown>
  ): EngineState | undefined {
    if ("ks" in saveData === false) {
      cdebug("Failed: `ks` not found in save data.");
      return;
    }

    const ksData = saveData.ks as { state?: Array<EngineState> };
    if ("state" in ksData === false) {
      cdebug("Failed: `ks.state` not found in save data.");
      return;
    }

    const state = ksData.state;
    if (!Array.isArray(state)) {
      cdebug("Failed: `ks.state` not `Array`.");
      return;
    }

    return state[0];
  }

  static async waitForGame(timeout = 30000): Promise<GamePage> {
    const signals: Array<Promise<unknown>> = [sleep(2000)];

    if (isNil(UserScript._gameStartSignal) && typeof UserScript.window.dojo !== "undefined") {
      UserScript._gameStartSignal = new Promise(resolve => {
        UserScript._gameStartSignalResolver = resolve;
      });

      UserScript.window.dojo.subscribe("game/start", () => {
        cdebug("`game/start` signal caught. Fast-tracking script load...");
        mustExist(UserScript._gameStartSignalResolver)(true);
      });

      UserScript.window.dojo.subscribe(
        "server/load",
        (saveData: { ks?: { state?: Array<EngineState> } }) => {
          cinfo(
            "EXPERIMENTAL: `server/load` signal caught. Looking for Kitten Scientists engine state in save data..."
          );

          const state = UserScript._tryEngineStateFromSaveData(saveData);
          if (!state) {
            return;
          }

          cinfo(
            "EXPERIMENTAL: Found! Provided save data will be used as seed for next userscript instance."
          );
          UserScript._possibleEngineState = state;
        }
      );
    }

    if (!isNil(UserScript._gameStartSignal)) {
      signals.push(UserScript._gameStartSignal);
    }

    if (timeout < 0) {
      throw new Error("Unable to find game page. Giving up.");
    }

    if (UserScript._isGameLoaded()) {
      return mustExist(UserScript.window.gamePage);
    }

    cdebug(`Waiting for game... (timeout: ${Math.round(timeout / 1000)}s)`);

    await Promise.race(signals);
    return UserScript.waitForGame(timeout - 2000);
  }

  /**
   * Returns an instance of the userscript in our default confiuration.
   *
   * @returns The default userscript instance.
   */
  static getDefaultInstance(): UserScript {
    const instance = new UserScript(
      mustExist(UserScript.window.gamePage),
      mustExist(UserScript.window.$I),
      localStorage["com.nuclearunicorn.kittengame.language"] as SupportedLanguages | undefined
    );

    // We can already attempt to load the possible engine state and see if this produces errors.
    // As the startup is orchestrated right now by `index.ts`, if there are legacy options, they
    // will be loaded into the instance after we return it from here.
    // Thus, legacy options will overrule modern settings, if they are present.
    if (!isNil(UserScript._possibleEngineState)) {
      try {
        instance.setSettings(UserScript._possibleEngineState);
      } catch (error) {
        cerror("The previous engine state could not be processed!", error);
      }
    }

    instance.installSaveManager();
    return instance;
  }

  private static _isGameLoaded(): boolean {
    return !isNil(UserScript.window.gamePage);
  }

  static get window(): Window {
    try {
      return unsafeWindow as Window;
    } catch (error) {
      return window;
    }
  }
}
