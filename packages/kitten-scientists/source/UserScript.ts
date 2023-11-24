import { ReleaseChannel, ReleaseInfoSchema } from "@kitten-science/action-release-info";
import { sleep } from "@oliversalzburg/js-utils/async.js";
import { Maybe, isNil, mustExist } from "@oliversalzburg/js-utils/nil.js";
import JQuery from "jquery";
import gt from "semver/functions/gt.js";
import { Engine, EngineState, GameLanguage, SupportedLanguage } from "./Engine.js";
import { ScienceSettings } from "./settings/ScienceSettings.js";
import { SpaceSettings } from "./settings/SpaceSettings.js";
import { WorkshopSettings } from "./settings/WorkshopSettings.js";
import { State } from "./state/State.js";
import { cdebug, cerror, cinfo, cwarn } from "./tools/Log.js";
import { Game } from "./types/index.js";
import { UserInterface } from "./ui/UserInterface.js";

declare global {
  const KS_RELEASE_CHANNEL: ReleaseChannel;
  const KS_VERSION: string | undefined;

  let unsafeWindow: Window | undefined;
  interface Window {
    $: JQuery;
    $I?: Maybe<I18nEngine>;
    dojo: {
      clone: <T>(subject: T) => T;
      subscribe: (event: string, handler: (...args: any[]) => void) => void;
    };
    game?: Maybe<Game>;
    gamePage?: Maybe<Game>;
    LZString: {
      compressToBase64: (input: string) => string;
      compressToUTF16: (input: string) => string;
      decompressFromBase64: (input: string) => string;
      decompressFromUTF16: (input: string) => string;
    };
  }
}

export type I18nEngine = (key: string, args?: Array<number | string>) => string;

export const FallbackLanguage: GameLanguage & SupportedLanguage = "en";

export const ksVersion = (prefix = "") => {
  if (isNil(KS_VERSION)) {
    throw Error(`Build error: KS_VERSION is not defined.`);
  }

  return `${prefix}${KS_VERSION}`;
};

// How long to wait for KG to load, in milliseconds.
const TIMEOUT_DEFAULT = 2 * 60 * 1000;

// Allows the user to define a timeout override in their browser's web storage.
// This allows users to extend the timeout period, in case their local configuration
// requires it.
const TIMEOUT_OVERRIDE =
  "localStorage" in globalThis && !isNil(localStorage["ks.timeout"])
    ? Number(localStorage["ks.timeout"])
    : undefined;

export class UserScript {
  readonly game: Game;

  /**
   * A function in the game that allows to retrieve translated messages.
   *
   * Ideally, you should never access this directly and instead use the
   * i18n interface provided by `Engine`.
   */
  readonly i18nEngine: I18nEngine;

  /**
   * Stores if we caught the `game/start` signal from the game.
   */
  private static _gameStartSignal: Promise<boolean>;
  private static _gameStartSignalResolver: undefined | ((value: boolean) => void);

  private static _possibleEngineState: EngineState | undefined = undefined;

  private _userInterface: UserInterface;
  engine: Engine;

  constructor(game: Game, i18nEngine: I18nEngine, gameLanguage: GameLanguage = FallbackLanguage) {
    cinfo(`Kitten Scientists ${ksVersion("v")} constructed.`);
    cinfo(`You are on the '${String(KS_RELEASE_CHANNEL)}' release channel.`);

    this.game = game;
    this.i18nEngine = i18nEngine;

    this.engine = new Engine(this, gameLanguage);
    this._userInterface = this._constructUi();
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

    cinfo("Kitten Scientists initialized.");

    this.runUpdateCheck().catch(console.error);

    UserScript.window.dojo.subscribe("game/beforesave", (saveData: Record<string, unknown>) => {
      cinfo("Injecting Kitten Scientists engine state into save data...");
      saveData.ks = { state: [this.getSettings()] };
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
      const response = await fetch("https://ks.rm-rf.link/release-info.json");
      const releaseInfo = (await response.json()) as ReleaseInfoSchema;
      cdebug(releaseInfo);

      if (!isNil(KS_VERSION) && gt(releaseInfo[KS_RELEASE_CHANNEL].version, KS_VERSION)) {
        cinfo("Looks like there's a new version out!");
        cinfo(
          `We have '${KS_VERSION}' and there is '${releaseInfo[KS_RELEASE_CHANNEL].version}' available.`,
        );
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
      return UserScript.unknownAsEngineStateOrThrow(naiveParse);
    } catch (error) {
      /* expected, as we assume the input to be compressed. */
    }

    const settingsString = window.LZString.decompressFromBase64(compressedSettings);
    const parsed = JSON.parse(settingsString) as Record<string, unknown>;
    return UserScript.unknownAsEngineStateOrThrow(parsed);
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
    this._userInterface.refreshUi();
  }

  /**
   * Loads an encoded state into the engine.
   *
   * @param encodedSettings The encoded settings.
   */
  importSettingsFromString(encodedSettings: string) {
    const settings = UserScript.decodeSettings(encodedSettings);
    this.setSettings(settings);
    this.engine.imessage("settings.imported");
  }

  /**
   * Import settings from a URL.
   * This is an experimental feature, and only allows using profiles from
   * https://kitten-science.com/ at this time.
   *
   * @param url - The URL of the profile to load.
   */
  async importSettingsFromUrl(url: string) {
    const importState = new State(url);
    const settings = await importState.resolve();
    settings.report.aggregate(console);

    const stateIsValid = await importState.validate();
    if (!stateIsValid) {
      cerror("Imported state is invalid and not imported.");
      return;
    }

    const state = importState.merge();
    this.setSettings(state);
    this.engine.imessage("settings.imported");
  }

  /**
   * Copies an engine state to the clipboard.
   *
   * @param settings The engine state to copy to the clipboard.
   * The default is this engine's current state.
   * @param compress Should the state be compressed?
   */
  async copySettings(settings = this.getSettings(), compress = true) {
    const encodedSettings = UserScript.encodeSettings(settings, compress);
    await window.navigator.clipboard.writeText(encodedSettings);
    this.engine.imessage("settings.copied");
  }

  /**
   * Determines if an object is an engine state, and throws an
   * exception otherwise.
   *
   * @param subject The object that is hopefully an engine state.
   * @param subject.v The version in the engine state.
   * @returns An engine state.
   */
  static unknownAsEngineStateOrThrow(subject?: { v?: string }): EngineState {
    const v = subject?.v;
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

      const state = UserScript._tryEngineStateFromSaveData(saveData);
      if (!state) {
        return;
      }

      cinfo("Found Kitten Scientists engine state in save data.");
      this.engine.stateLoad(state);
      this.refreshUi();
    },
    resetState: () => null,
    save: (saveData: Record<string, unknown>) => {
      // We ignore the manager invocation, because we already handle the
      // `game/beforesave` event, which is intended for external consumers.
    },
  };

  private static _tryEngineStateFromSaveData(
    saveData: Record<string, unknown>,
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

  static async waitForGame(timeout = TIMEOUT_OVERRIDE ?? TIMEOUT_DEFAULT): Promise<Game> {
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
            "`server/load` signal caught. Looking for Kitten Scientists engine state in save data...",
          );

          const state = UserScript._tryEngineStateFromSaveData(saveData);
          if (!state) {
            cinfo("The Kittens Game save data did not contain an engine state.");
            return;
          }

          cinfo("Found! Provided save data will be used as seed for next userscript instance.");
          UserScript._possibleEngineState = state;
        },
      );
    }

    if (!isNil(UserScript._gameStartSignal)) {
      signals.push(UserScript._gameStartSignal);
    }

    if (timeout < 0) {
      throw new Error(
        "Unable to find game. Giving up. Maybe the game is not exported at `window.game`?",
      );
    }

    if (UserScript._isGameLoaded()) {
      return mustExist(UserScript.window.game);
    }

    cdebug(`Waiting for game... (timeout: ${Math.round(timeout / 1000)}s)`);

    await Promise.race(signals);
    return UserScript.waitForGame(timeout - 2000);
  }

  /**
   * Returns an instance of the userscript in our default configuration.
   *
   * @returns The default userscript instance.
   */
  static getDefaultInstance(): UserScript {
    const instance = new UserScript(
      mustExist(UserScript.window.game),
      mustExist(UserScript.window.$I),
      localStorage["com.nuclearunicorn.kittengame.language"] as GameLanguage | undefined,
    );

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
    return (
      !isNil(UserScript.window.game) &&
      !Object.prototype.toString.apply(UserScript.window.game).includes("HTMLDivElement")
    );
  }

  static get window(): Window {
    try {
      return unsafeWindow as Window;
    } catch (error) {
      return window;
    }
  }
}
