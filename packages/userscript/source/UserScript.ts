import { ReleaseChannel, ReleaseInfo } from "@kitten-science/action-release-info";
import JQuery from "jquery";
import gt from "semver/functions/gt";
import { Engine, EngineState, SupportedLanguages } from "./Engine";
import { ScienceSettings } from "./settings/ScienceSettings";
import { SpaceSettings } from "./settings/SpaceSettings";
import { WorkshopSettings } from "./settings/WorkshopSettings";
import { cdebug, cerror, cinfo, cwarn } from "./tools/Log";
import { isNil, Maybe, mustExist } from "./tools/Maybe";
import { sleep } from "./tools/Sleep";
import { GamePage } from "./types";
import { UserInterface } from "./ui/UserInterface";

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

export const ksVersion = (prefix = "") => {
  if (isNil(KS_VERSION)) {
    throw Error(`Build error: KS_VERSION is not defined.`);
  }

  return `${prefix}${KS_VERSION}`;
};

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
    cinfo(`Kitten Scientists ${ksVersion("v")} constructed.`);
    cinfo(`You are on the '${String(KS_RELEASE_CHANNEL)}' release channel.`);

    this.gamePage = gamePage;
    this.i18nEngine = i18nEngine;
    this._language = language;

    this.engine = new Engine(this);
    this._userInterface = new UserInterface(this);
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

    this.runUpdateCheck().catch(console.error);

    UserScript.window.dojo.subscribe("game/beforesave", (saveData: Record<string, unknown>) => {
      cinfo("Injecting Kitten Scientists engine state into save data...");
      saveData.ks = { state: [this.getSettings()] };
    });
  }

  async runUpdateCheck() {
    if (KS_RELEASE_CHANNEL === "fixed") {
      cdebug("No update check on 'fixed' release channel.");
      return;
    }

    try {
      const response = await fetch("https://ks.rm-rf.link/release-info.json");
      const releaseInfo = (await response.json()) as ReleaseInfo;
      cdebug(releaseInfo);

      if (!isNil(KS_VERSION) && gt(KS_VERSION, releaseInfo[KS_RELEASE_CHANNEL].version)) {
        cinfo("Looks like there's a new version out!");
        cinfo(
          `We have '${KS_VERSION}' and there is '${releaseInfo[KS_RELEASE_CHANNEL].version}' available.`
        );
      }
    } catch (error) {
      cwarn("Update check failed.");
      cwarn(error);
    }
  }

  refreshUi() {
    this._userInterface.refreshUi();
  }

  getSettings(): EngineState {
    return this.engine.stateSerialize();
  }
  encodeSettings(settings: EngineState, compress = true) {
    const settingsString = JSON.stringify(settings);
    return compress ? window.LZString.compressToBase64(settingsString) : settingsString;
  }
  async copySettings(settings = this.getSettings(), compress = true) {
    const encodedSettings = this.encodeSettings(settings, compress);
    await window.navigator.clipboard.writeText(encodedSettings);
    this.engine.imessage("settings.copied");
  }

  setSettings(settings: EngineState) {
    cinfo("Loading engine state...");
    this.engine.stateLoad(settings);
    this._userInterface.refreshUi();
  }

  unknownAsEngineStateOrThrow(subject?: { v?: string }): EngineState {
    const v = subject?.v;
    if (!isNil(v) && typeof v === "string") {
      if (v.startsWith("2")) {
        return subject as EngineState;
      }
    }
    throw new Error("Not a valid engine state.");
  }

  /**
   * Given a serialized engine state, attempts to deserialize that engine state.
   * Assumes the input has been compressed with LZString, will accept uncompressed.
   *
   * @param compressedSettings An engine state that has previously been serialized to a string.
   * @returns The engine state, if valid.
   */
  decodeSettings(compressedSettings: string): EngineState {
    try {
      const naiveParse = JSON.parse(compressedSettings) as { v?: string };
      return this.unknownAsEngineStateOrThrow(naiveParse);
    } catch (error) {
      /* expected, as we assume the input to be compressed. */
    }

    const settingsString = window.LZString.decompressFromBase64(compressedSettings);
    const parsed = JSON.parse(settingsString) as Record<string, unknown>;
    return this.unknownAsEngineStateOrThrow(parsed);
  }
  importSettings(compressedSettings: string) {
    const settings = this.decodeSettings(compressedSettings);
    this.setSettings(settings);
    this.engine.imessage("settings.imported");
  }

  installSaveManager() {
    cinfo("Installing save game manager...");
    this.gamePage.managers.push(this._saveManager);
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
            "`server/load` signal caught. Looking for Kitten Scientists engine state in save data..."
          );

          const state = UserScript._tryEngineStateFromSaveData(saveData);
          if (!state) {
            cinfo("The Kittens Game save data did not contain an engine state.");
            return;
          }

          cinfo("Found! Provided save data will be used as seed for next userscript instance.");
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
   * Returns an instance of the userscript in our default configuration.
   *
   * @returns The default userscript instance.
   */
  static getDefaultInstance(): UserScript {
    const instance = new UserScript(
      mustExist(UserScript.window.gamePage),
      mustExist(UserScript.window.$I),
      localStorage["com.nuclearunicorn.kittengame.language"] as SupportedLanguages | undefined
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
