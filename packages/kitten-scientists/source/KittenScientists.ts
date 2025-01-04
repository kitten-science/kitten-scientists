import { ReleaseChannel, ReleaseInfoSchema } from "@kitten-science/action-release-info";
import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import gt from "semver/functions/gt.js";
import { Engine, EngineState, GameLanguage, SupportedLocale } from "./Engine.js";
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

  private _gameBeforeSaveHandle: ["game/beforesave", number] | undefined;
  private _serverLoadHandle: ["server/load", number] | undefined;

  constructor(
    game: Game,
    i18nEngine: I18nEngine,
    gameLanguage: GameLanguage = "en",
    engineState?: EngineState,
  ) {
    cinfo(`Kitten Scientists ${ksVersion("v")} constructed. Checking for previous instances...`);
    if ("kittenScientists" in UserScriptLoader.window) {
      cwarn("Detected existing KS instance. Trying to unload it...");
      UserScriptLoader.window.kittenScientists?.unload();
    }
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
    ui.stateManagementUi.loadAutoSave();
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
   * Removes Kitten Scientists from the browser.
   */
  unload(): void {
    cwarn("Unloading Kitten Scientists...");
    this.engine.stop();
    this._userInterface.destroy();
    $("#ks-styles").remove();
    if (this._gameBeforeSaveHandle !== undefined) {
      UserScriptLoader.window.dojo.unsubscribe(this._gameBeforeSaveHandle);
      this._gameBeforeSaveHandle = undefined;
    }
    if (this._serverLoadHandle !== undefined) {
      UserScriptLoader.window.dojo.unsubscribe(this._serverLoadHandle);
      this._gameBeforeSaveHandle = undefined;
    }
    const managerIndex = this.game.managers.indexOf(this._saveManager);
    if (-1 < managerIndex) {
      this.game.managers.splice(managerIndex, 1);
    }
    delete window.kittenScientists;
    cwarn("Kitten Scientists have been unloaded!");
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

    if (this._gameBeforeSaveHandle !== undefined) {
      UserScriptLoader.window.dojo.unsubscribe(this._gameBeforeSaveHandle);
      this._gameBeforeSaveHandle = undefined;
    }
    this._gameBeforeSaveHandle = UserScriptLoader.window.dojo.subscribe(
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

    if (this._serverLoadHandle !== undefined) {
      UserScriptLoader.window.dojo.unsubscribe(this._serverLoadHandle);
      this._gameBeforeSaveHandle = undefined;
    }
    this._serverLoadHandle = UserScriptLoader.window.dojo.subscribe(
      "server/load",
      (saveData: unknown) => {
        const state = UserScriptLoader.tryEngineStateFromSaveData("ks", saveData) as
          | EngineState
          | undefined;

        if (!state) {
          cinfo(
            "The Kittens Game save data did not contain a script state. Trying to load Auto-Save settings...",
          );
          return;
        }

        cinfo("Found! Loading settings...");
        this.engine.stateLoad(state);
      },
    );
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

  /**
   * Turns a string like 52.7 into the number 52.7
   * @param value - String representation of an absolute value.
   * @returns A number between 0 and Infinity, where Infinity is represented as -1.
   */
  parseFloat(value: string | null): number | null {
    if (value === null || value === "") {
      return null;
    }

    const hasSuffix = /[KMGTP]$/i.test(value);
    const baseValue = value.substring(0, value.length - (hasSuffix ? 1 : 0));

    let numericValue =
      value.includes("e") || hasSuffix ? parseFloat(baseValue) : parseInt(baseValue);
    if (hasSuffix) {
      const suffix = value.substring(value.length - 1).toUpperCase();
      numericValue = numericValue * Math.pow(1000, ["", "K", "M", "G", "T", "P"].indexOf(suffix));
    }
    if (numericValue === Number.POSITIVE_INFINITY || numericValue < 0) {
      numericValue = -1;
    }

    return numericValue;
  }

  parseAbsolute(value: string | null): number | null {
    const floatValue = this.parseFloat(value);
    return floatValue !== null ? Math.round(floatValue) : null;
  }

  /**
   * Turns a string like 52.7 into the number 0.527
   * @param value - String representation of a percentage.
   * @returns A number between 0 and 1 representing the described percentage.
   */
  parsePercentage(value: string): number {
    const cleanedValue = value.trim().replace(/%$/, "");
    return Math.max(0, Math.min(1, parseFloat(cleanedValue) / 100));
  }

  /**
   * Turns a number into a game-native string representation.
   * Infinity, either by actual value or by -1 representation, is rendered as a symbol.
   * @param value - The number to render as a string.
   * @param host - The host instance which we can use to let the game render values for us.
   * @returns A string representing the given number.
   */
  renderAbsolute(value: number, locale: SupportedLocale | "invariant" = "invariant") {
    if (value < 0 || value === Number.POSITIVE_INFINITY) {
      return "∞";
    }

    return locale !== "invariant" && Math.floor(Math.log10(value)) < 9
      ? new Intl.NumberFormat(locale, { style: "decimal", maximumFractionDigits: 0 }).format(value)
      : this.game.getDisplayValueExt(value, false, false);
  }

  /**
   * Turns a number like 0.527 into a string like 52.7
   * @param value - The number to render as a string.
   * @param locale - The locale in which to render the percentage.
   * @param withUnit - Should the percentage sign be included in the output?
   * @returns A string representing the given percentage.
   */
  renderPercentage(
    value: number,
    locale: SupportedLocale | "invariant" = "invariant",
    withUnit?: boolean,
  ): string {
    if (value < 0 || value === Number.POSITIVE_INFINITY) {
      return "∞";
    }

    return locale !== "invariant"
      ? new Intl.NumberFormat(locale, { style: "percent" }).format(value)
      : `${this.game.getDisplayValueExt(value * 100, false, false)}${withUnit ? "%" : ""}`;
  }

  renderFloat(value: number, locale: SupportedLocale | "invariant" = "invariant"): string {
    if (value < 0 || value === Number.POSITIVE_INFINITY) {
      return "∞";
    }

    return locale !== "invariant"
      ? new Intl.NumberFormat(locale, { style: "decimal" }).format(value)
      : this.game.getDisplayValueExt(value, false, false);
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

  //#region SaveManager
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
  //#endregion
}
