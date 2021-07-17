import JQuery from "jquery";
import {
  ActivityClass,
  ActivitySummary,
  ActivitySummarySection,
  ActivityTypeClass,
} from "./ActivitySummary";
import { Engine } from "./Engine";
import i18nData from "./i18n/i18nData.json";
import { Options } from "./options/Options";
import { cdebug, cinfo, clog, cwarn } from "./tools/Log";
import { isNil, Maybe, mustExist } from "./tools/Maybe";
import { sleep } from "./tools/Sleep";
import { GamePage } from "./types";
import { UserInterface } from "./ui/UserInterface";

declare global {
  let unsafeWindow: Window | undefined;
  const dojo: {
    clone: <T>(subject: T) => T;
  };
  interface Window {
    gamePage?: Maybe<GamePage>;
    $: JQuery;
    $I?: Maybe<I18nEngine>;
  }
}

export type I18nEngine = (key: string, args?: Array<number | string>) => string;

export type SupportedLanguages = keyof typeof i18nData;
export const DefaultLanguage: SupportedLanguages = "en";

export class UserScript {
  readonly gamePage: GamePage;
  readonly i18nEngine: I18nEngine;
  private _language: SupportedLanguages;

  private readonly _i18nData: typeof i18nData;
  options: Options = new Options();

  private _activitySummary: ActivitySummary;
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

    this._i18nData = i18nData;

    this._userInterface = new UserInterface(this);
    this.engine = new Engine(this);

    this._userInterface.construct();
    this.injectOptions(new Options());

    this._activitySummary = new ActivitySummary(this);
  }

  injectOptions(options: Options): void {
    this.options = options;
    this._userInterface?.setState(this.options);
  }

  async run(): Promise<void> {
    if (this._language in this._i18nData === false) {
      cwarn(
        `Requested language '${this._language}' is not available. Falling back to '${DefaultLanguage}'.`
      );
      this._language = DefaultLanguage;
    }

    // Increase messages displayed in log
    // TODO: This should be configurable.
    this.gamePage.console.maxMessages = 1000;

    this.resetActivitySummary();

    cwarn("Kitten Scientists initialized. Engine NOT started for now.");

    this._userInterface.refreshUi();
    //engine.start(false);
  }

  /**
   * Retrieve an internationalized string literal.
   * @param key The key to retrieve from the translation table.
   * @param args Variable arguments to render into the string.
   * @returns The translated string.
   */
  i18n<TKittenGameLiteral extends `$${string}`>(
    key: keyof typeof i18nData[SupportedLanguages] | TKittenGameLiteral,
    args: Array<number | string> = []
  ): string {
    // Key is to be translated through KG engine.
    if (key.startsWith("$")) {
      return this.i18nEngine(key.slice(1));
    }

    let value = this._i18nData[this._language][key as keyof typeof i18nData[SupportedLanguages]];
    if (typeof value === "undefined" || value === null) {
      value = i18nData[DefaultLanguage][key as keyof typeof i18nData[SupportedLanguages]];
      if (!value) {
        cwarn(`i18n key '${key}' not found in default language.`);
        return `$${key}`;
      }
      cwarn(`i18n key '${key}' not found in selected language.`);
    }
    if (args) {
      for (let argIndex = 0; argIndex < args.length; ++argIndex) {
        value = value.replace(`{${argIndex}}`, `${args[argIndex]}`);
      }
    }
    return value;
  }

  private _printOutput(
    cssClasses: "ks-activity" | `ks-activity ${ActivityTypeClass}` | "ks-default" | "ks-summary",
    color: string,
    ...args: Array<number | string>
  ): void {
    if (this.options.auto.filters.enabled) {
      for (const filterItem of Object.values(this.options.auto.filters.items)) {
        if (filterItem.enabled && filterItem.variant === args[1]) {
          return;
        }
      }
    }

    // update the color of the message immediately after adding
    const msg = this.gamePage.msg(...args, cssClasses);
    $(msg.span).css("color", color);

    cdebug(args);
  }

  private _message(...args: Array<number | string>): void {
    this._printOutput("ks-default", "#aa50fe", ...args);
  }

  private _activity(text: string, logStyle?: ActivityClass): void {
    if (logStyle) {
      const activityClass: ActivityTypeClass = `type_${logStyle}` as const;
      this._printOutput(`ks-activity ${activityClass}` as const, "#e65C00", text);
    } else {
      this._printOutput("ks-activity", "#e65C00", text);
    }
  }

  private _summary(...args: Array<number | string>): void {
    this._printOutput("ks-summary", "#009933", ...args);
  }

  warning(...args: Array<number | string>): void {
    args.unshift("Warning!");
    if (console) {
      clog(args);
    }
  }

  imessage(
    i18nLiteral: keyof typeof i18nData[SupportedLanguages],
    i18nArgs: Array<number | string> = []
  ): void {
    this._message(this.i18n(i18nLiteral, i18nArgs));
  }
  iactivity(
    i18nLiteral: keyof typeof i18nData[SupportedLanguages],
    i18nArgs: Array<number | string> = [],
    logStyle?: ActivityClass
  ): void {
    this._activity(this.i18n(i18nLiteral, i18nArgs), logStyle);
  }
  private _isummary(
    i18nLiteral: keyof typeof i18nData[SupportedLanguages],
    i18nArgs: Array<number | string>
  ): void {
    this._summary(this.i18n(i18nLiteral, i18nArgs));
  }
  private _iwarning(
    i18nLiteral: keyof typeof i18nData[SupportedLanguages],
    i18nArgs: Array<number | string>
  ): void {
    this.warning(this.i18n(i18nLiteral, i18nArgs));
  }

  resetActivitySummary(): void {
    this._activitySummary.resetActivity();
  }

  storeForSummary(name: string, amount = 1, section: ActivitySummarySection = "other"): void {
    this._activitySummary.storeActivity(name, amount, section);
  }

  displayActivitySummary(): void {
    const summary = this._activitySummary.renderSummary();
    for (const summaryLine of summary) {
      this._summary(summaryLine);
    }

    // Clear out the old activity
    this.resetActivitySummary();
  }

  static async waitForGame(timeout = 30000): Promise<GamePage> {
    cdebug(`Waiting for game... (timeout: ${Math.round(timeout / 1000)}s)`);

    if (timeout < 0) {
      throw new Error("Unable to find game page.");
    }

    if (UserScript._isGameLoaded()) {
      return mustExist(UserScript._window.gamePage);
    }

    await sleep(2000);
    return UserScript.waitForGame(timeout - 2000);
  }

  static async getDefaultInstance(): Promise<UserScript> {
    const instance = new UserScript(
      mustExist(UserScript._window.gamePage),
      mustExist(UserScript._window.$I),
      localStorage["com.nuclearunicorn.kittengame.language"]
    );
    return instance;
  }

  private static _isGameLoaded(): boolean {
    return !isNil(UserScript._window.gamePage);
  }

  private static get _window(): Window {
    try {
      return unsafeWindow as Window;
    } catch (error) {
      return window;
    }
  }
}
