import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";
import { InvalidOperationError } from "@oliversalzburg/js-utils/errors/InvalidOperationError.js";
import gt from "semver/functions/gt.js";
import { Engine, type EngineState, type SupportedLocale } from "./Engine.js";
import { ScienceSettings } from "./settings/ScienceSettings.js";
import { SpaceSettings } from "./settings/SpaceSettings.js";
import { WorkshopSettings } from "./settings/WorkshopSettings.js";
import { cl } from "./tools/Log.js";
import type { ReleaseChannel, ReleaseInfoSchema } from "./types/_releases.js";
import type { GamePage } from "./types/game.js";
import type { I18nEngine, Locale } from "./types/index.js";
import { UserScriptLoader } from "./UserScriptLoader.js";
import { UserInterface } from "./ui/UserInterface.js";

declare global {
  const GM:
    | {
        info?: {
          scriptHandler?: string;
        };
      }
    | undefined;
  const RELEASE_CHANNEL: ReleaseChannel;
  const RELEASE_VERSION: string | undefined;
}

export const ksVersion = (prefix = "") => {
  if (isNil(RELEASE_VERSION)) {
    throw Error("Build error: RELEASE_VERSION is not defined.");
  }

  return `${prefix}${RELEASE_VERSION}`;
};

export class KittenScientists {
  readonly game: GamePage;

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
    game: GamePage,
    i18nEngine: I18nEngine,
    gameLanguage: Locale = "en",
    engineState?: EngineState,
  ) {
    console.info(
      ...cl(`Kitten Scientists ${ksVersion("v")} constructed. Checking for previous instances...`),
    );
    if ("kittenScientists" in UserScriptLoader.window) {
      console.warn(...cl("Detected existing KS instance. Trying to unload it..."));
      UserScriptLoader.window.kittenScientists?.unload();
    }
    console.info(...cl(`You are on the '${String(RELEASE_CHANNEL)}' release channel.`));

    this.game = game;
    this.i18nEngine = i18nEngine;
    try {
      this.engine = new Engine(this, gameLanguage);
      this._userInterface = new UserInterface(this);
    } catch (error: unknown) {
      console.error(...cl("Failed to construct core components.", error));
      throw error;
    }

    if (!isNil(engineState)) {
      this.setSettings(engineState);
    } else {
      this._userInterface.stateManagementUi.loadAutoSave();
    }
  }

  rebuildUi() {
    this._userInterface.destroy();
    this._userInterface = new UserInterface(this);
    this._userInterface.forceFullRefresh();
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
    console.warn(...cl("Unloading Kitten Scientists..."));
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
    UserScriptLoader.window.kittenScientists = undefined;
    console.warn(...cl("Kitten Scientists have been unloaded!"));
  }

  /**
   * Start the user script after loading and configuring it.
   */
  run(): void {
    this.refreshEntireUserInterface();

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
        console.info(...cl("Injecting Kitten Scientists engine state into save data..."));
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
          console.info(
            ...cl(
              "The Kittens Game save data did not contain a script state. Trying to load Auto-Save settings...",
            ),
          );
          return;
        }

        console.info(...cl("Found! Loading settings..."));
        this.engine.stateLoad(state);
      },
    );
  }

  /**
   * Check which versions of KS are currently published.
   */
  async runUpdateCheck() {
    if (RELEASE_CHANNEL === "fixed") {
      console.debug(...cl("No update check on 'fixed' release channel."));
      return;
    }

    try {
      const response = await fetch("https://kitten-science.com/release-info.json");
      const releaseInfo = (await response.json()) as ReleaseInfoSchema;
      console.debug(...cl(releaseInfo));

      if (
        isNil(releaseInfo[RELEASE_CHANNEL].version) ||
        releaseInfo[RELEASE_CHANNEL].version === ""
      ) {
        console.debug(
          "Could not read current version for our release channel from provided metadata!",
        );
        return;
      }

      if (!isNil(RELEASE_VERSION) && gt(releaseInfo[RELEASE_CHANNEL].version, RELEASE_VERSION)) {
        this.engine.imessage("status.ks.upgrade", [
          releaseInfo[RELEASE_CHANNEL].version,
          RELEASE_VERSION,
          releaseInfo[RELEASE_CHANNEL].url.release,
        ]);
      }
    } catch (error) {
      console.warn(...cl("Update check failed."));
      console.warn(...cl(error));
    }
  }

  /**
   * Requests the user interface to refresh.
   */
  refreshEntireUserInterface(): void {
    console.info(...cl("Requesting entire user interface to be refreshed."));
    this._userInterface.forceFullRefresh();
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
      value.includes("e") || hasSuffix
        ? Number.parseFloat(baseValue)
        : Number.parseInt(baseValue, 10);
    if (hasSuffix) {
      const suffix = value.substring(value.length - 1).toUpperCase();
      numericValue = numericValue * 1000 ** ["", "K", "M", "G", "T", "P"].indexOf(suffix);
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
    return Math.max(0, Math.min(1, Number.parseFloat(cleanedValue) / 100));
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
      ? new Intl.NumberFormat(locale, { maximumFractionDigits: 0, style: "decimal" }).format(value)
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
    return compress
      ? UserScriptLoader.window.LZString.compressToBase64(settingsString)
      : settingsString;
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

    if (compressedSettings.match(/\r?\n/)) {
      throw new InvalidOperationError("Multi-line non-JSON input can't be decoded.");
    }

    const settingsString =
      UserScriptLoader.window.LZString.decompressFromBase64(compressedSettings);
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
    console.info(...cl("Loading engine state..."));
    const requiresUiRebuild =
      this.engine.settings.ksColumn.enabled !== settings.engine.ksColumn.enabled;
    this.engine.stateLoad(settings);

    if (requiresUiRebuild) {
      this.rebuildUi();
    }

    this._userInterface.refresh(true);
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
    await UserScriptLoader.window.navigator.clipboard.writeText(encodedSettings);
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
    console.info(...cl("Installing save game manager..."));
    this.game.managers.push(this._saveManager);
  }

  private _saveManager = {
    load: (saveData: Record<string, unknown>) => {
      console.info(...cl("Looking for Kitten Scientists engine state in save data..."));

      const state = UserScriptLoader.tryEngineStateFromSaveData("ks", saveData) as
        | EngineState
        | undefined;

      if (!state) {
        console.info(...cl("The Kittens Game save data did not contain a script state."));
        return;
      }

      console.info(...cl("Found Kitten Scientists engine state in save data."));
      this.engine.stateLoad(state);
      this.refreshEntireUserInterface();
    },
    resetState: () => null,
    save: (_saveData: Record<string, unknown>) => {
      // We ignore the manager invocation, because we already handle the
      // `game/beforesave` event, which is intended for external consumers.
    },
  };
  //#endregion
}
