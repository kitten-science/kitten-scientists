import { ReleaseChannel, ReleaseInfoSchema } from "@kitten-science/action-release-info";
import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import gt from "semver/functions/gt.js";
import { Engine, EngineState, GameLanguage } from "./Engine.js";
import { ScienceSettings } from "./settings/ScienceSettings.js";
import { SpaceSettings } from "./settings/SpaceSettings.js";
import { WorkshopSettings } from "./settings/WorkshopSettings.js";
import { cdebug, cerror, cinfo, cwarn } from "./tools/Log.js";
import { Game, I18nEngine } from "./types/index.js";
import { UserInterface } from "./ui/UserInterface.js";
import { UserScriptLoader } from "./UserScriptLoader.js";

declare global {
  const KS_RELEASE_CHANNEL: ReleaseChannel;
  const KS_VERSION: string | undefined;
}

export const ksVersion = (prefix = "") => {
  if (isNil(KS_VERSION)) {
    throw Error(`Build error: KS_VERSION is not defined.`);
  }

  return `${prefix}${KS_VERSION}`;
};

export class KittenScientists {
  readonly game: Game;

  /**
   * A function in the game that allows to retrieve translated messages.
   *
   * Ideally, you should never access this directly and instead use the
   * i18n interface provided by `Engine`.
   */
  readonly i18nEngine: I18nEngine;

  private _userInterface: UserInterface;
  engine: Engine;

  constructor(
    game: Game,
    i18nEngine: I18nEngine,
    gameLanguage: GameLanguage = "en",
    engineState?: EngineState,
  ) {
    cinfo(`Kitten Scientists ${ksVersion("v")} constructed.`);
    cinfo(`You are on the '${String(KS_RELEASE_CHANNEL)}' release channel.`);

    this.game = game;
    this.i18nEngine = i18nEngine;
    try {
      this.engine = new Engine(this, gameLanguage);
      this._userInterface = this._constructUi();
    } catch (error: unknown) {
      cerror("Failed to construct core components.", error);
      throw error;
    }

    if (!isNil(engineState)) {
      this.setSettings(engineState);
    }
  }

  private _constructUi() {
    const ui = new UserInterface(this);
    ui.refreshUi();
    return ui;
  }

  rebuildUi() {
    this._userInterface.destroy();
    this._userInterface = this._constructUi();
  }

  /**
   * Runs some validations against the game to determine if internal control
   * structures still match up with expectations.
   * Issues should be logged to the console.
   */
  validateGame() {
    ScienceSettings.validateGame(this.game, this.engine.scienceManager.settings);
    SpaceSettings.validateGame(this.game, this.engine.spaceManager.settings);
    WorkshopSettings.validateGame(this.game, this.engine.workshopManager.settings);
  }

  /**
   * Start the user script after loading and configuring it.
   */
  run(): void {
    // Increase messages displayed in log
    // TODO: This should be configurable.
    this.game.console.maxMessages = 1000;

    this.refreshUi();

    if (this.engine.settings.enabled) {
      this.engine.start(true);
    }

    this.engine.imessage("status.ks.init");

    this.runUpdateCheck().catch(redirectErrorsToConsole(console));

    UserScriptLoader.window.dojo.subscribe(
      "game/beforesave",
      (saveData: Record<string, unknown>) => {
        cinfo("Injecting Kitten Scientists engine state into save data...");
        const state = this.getSettings();
        saveData.ks = { state: [state] };
        this._userInterface.stateManagementUi.storeAutoSave(state);
        document.dispatchEvent(
          new CustomEvent<typeof saveData>("ks.reportSavegame", { detail: saveData }),
        );
      },
    );
    UserScriptLoader.window.dojo.subscribe("server/load", (saveData: unknown) => {
      const state = UserScriptLoader.tryEngineStateFromSaveData("ks", saveData) as
        | EngineState
        | undefined;

      if (!state) {
        cinfo("The Kittens Game save data did not contain a script state.");
        return;
      }

      cinfo("Found! Loading settings...");
      this.engine.stateLoad(state);
    });
  }

  /**
   * Check which versions of KS are currently published.
   */
  async runUpdateCheck() {
    if (KS_RELEASE_CHANNEL === "fixed") {
      cdebug("No update check on 'fixed' release channel.");
      return;
    }

    try {
      const response = await fetch("https://kitten-science.com/release-info.json");
      const releaseInfo = (await response.json()) as ReleaseInfoSchema;
      cdebug(releaseInfo);

      if (!isNil(KS_VERSION) && gt(releaseInfo[KS_RELEASE_CHANNEL].version, KS_VERSION)) {
        this.engine.imessage("status.ks.upgrade", [
          releaseInfo[KS_RELEASE_CHANNEL].version,
          KS_VERSION,
          releaseInfo[KS_RELEASE_CHANNEL].url.release,
        ]);
      }
    } catch (error) {
      cwarn("Update check failed.");
      cwarn(error);
    }
  }

  /**
   * Requests the user interface to refresh.
   */
  refreshUi() {
    this._userInterface.refreshUi();
  }

  //#region Settings
  /**
   * Encodes an engine states into a string.
   *
   * @param settings The engine state to encode.
   * @param compress Should we use LZString compression?
   * @returns The settings encoded into a string.
   */
  static encodeSettings(settings: EngineState, compress = true): string {
    const settingsString = JSON.stringify(settings);
    return compress ? window.LZString.compressToBase64(settingsString) : settingsString;
  }

  /**
   * Given a serialized engine state, attempts to deserialize that engine state.
   * Assumes the input has been compressed with LZString, will accept uncompressed.
   *
   * @param compressedSettings An engine state that has previously been serialized to a string.
   * @returns The engine state, if valid.
   */
  static decodeSettings(compressedSettings: string): EngineState {
    try {
      const naiveParse = JSON.parse(compressedSettings) as { v?: string };
      return KittenScientists.unknownAsEngineStateOrThrow(naiveParse);
    } catch (_error) {
      /* expected, as we assume the input to be compressed. */
    }

    const settingsString = window.LZString.decompressFromBase64(compressedSettings);
    const parsed = JSON.parse(settingsString) as Record<string, unknown>;
    return KittenScientists.unknownAsEngineStateOrThrow(parsed);
  }

  /**
   * Retrieves the state from the engine.
   *
   * @returns The engine state.
   */
  getSettings(): EngineState {
    return this.engine.stateSerialize();
  }

  getSettingsAsJson(): string {
    return JSON.stringify(this.getSettings());
  }

  /**
   * Updates the engine with a new state.
   *
   * @param settings The engine state to apply.
   */
  setSettings(settings: EngineState) {
    cinfo("Loading engine state...");
    this.engine.stateLoad(settings);
    if (settings.engine.ksColumn.enabled) {
      this.rebuildUi();
    } else {
      this._userInterface.refreshUi();
    }
  }

  /**
   * Loads an encoded state into the engine.
   *
   * @param encodedSettings The encoded settings.
   */
  importSettingsFromString(encodedSettings: string) {
    const settings = KittenScientists.decodeSettings(encodedSettings);
    this.setSettings(settings);
  }

  /**
   * Copies an engine state to the clipboard.
   *
   * @param settings The engine state to copy to the clipboard.
   * The default is this engine's current state.
   * @param compress Should the state be compressed?
   */
  async copySettings(settings = this.getSettings(), compress = true) {
    const encodedSettings = KittenScientists.encodeSettings(settings, compress);
    await window.navigator.clipboard.writeText(encodedSettings);
  }

  /**
   * Determines if an object is an engine state, and throws an
   * exception otherwise.
   *
   * @param subject The object that is hopefully an engine state.
   * @param subject.v The version in the engine state.
   * @returns An engine state.
   */
  static unknownAsEngineStateOrThrow(subject?: unknown): EngineState {
    const v = (subject as { v?: string }).v;
    if (!isNil(v) && typeof v === "string") {
      if (v.startsWith("2")) {
        return subject as EngineState;
      }
    }
    throw new Error("Not a valid engine state.");
  }
  //#endregion

  installSaveManager() {
    cinfo("Installing save game manager...");
    this.game.managers.push(this._saveManager);
  }

  private _saveManager = {
    load: (saveData: Record<string, unknown>) => {
      cinfo("Looking for Kitten Scientists engine state in save data...");

      const state = UserScriptLoader.tryEngineStateFromSaveData("ks", saveData) as
        | EngineState
        | undefined;

      if (!state) {
        cinfo("The Kittens Game save data did not contain a script state.");
        return;
      }

      cinfo("Found Kitten Scientists engine state in save data.");
      this.engine.stateLoad(state);
      this.refreshUi();
    },
    resetState: () => null,
    save: (_saveData: Record<string, unknown>) => {
      // We ignore the manager invocation, because we already handle the
      // `game/beforesave` event, which is intended for external consumers.
    },
  };
}
