import JQuery from "jquery";
import { Engine } from "./Engine";
import i18nData from "./i18n/i18nData.json";
import { Options } from "./options/Options";
import { objectEntries } from "./tools/Entries";
import { roundToTwo, ucfirst } from "./tools/Format";
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

export type ActivitySummarySection =
  | "build"
  | "craft"
  | "faith"
  | "other"
  | "research"
  | "trade"
  | "upgrade";
export type ActivitySectionBuild = "";
export type ActivitySectionCraft = "";
export type ActivitySectionFaith = "";
export type ActivitySectionOther =
  | "accelerate"
  | "adore"
  | "distribute"
  | "embassy"
  | "feed"
  | "festival"
  | "fix.cry"
  | "hunt"
  | "praise"
  | "promote"
  | "stars"
  | "transcend";
export type ActivitySectionResearch = "";
export type ActivitySectionTrade = "";
export type ActivitySummary = {
  [key: string]: Record<string, number> | number | undefined;
  /*
  lastyear?: number;
  lastday?: number;
  build?: Record<string, number>;
  craft?: Record<string, number>;
  faith?: Record<string, number>;
  other?: {
    [key in ActivitySectionOther]?: number;
  };
  research?: Record<string, number>;
  trade?: Record<string, number>;
  upgrade?: Record<string, number>;
  */
};

export class UserScript {
  readonly gamePage: GamePage;
  readonly i18nEngine: I18nEngine;
  private _language: SupportedLanguages;

  private readonly _i18nData: typeof i18nData;
  options: Options = new Options();

  private _activitySummary: ActivitySummary = {};
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
    this.gamePage.console.maxMessages = 1000;

    this.resetActivitySummary();
    this._userInterface = new UserInterface(this);
    this.engine = new Engine(this);
    this._userInterface.construct();
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
    if (typeof value === "undefined") {
      value = i18nData[DefaultLanguage][key as keyof typeof i18nData[SupportedLanguages]];
      if (!value) {
        cwarn(`i18n key '${key}' not found in default language.`);
        return "$" + key;
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
    cssClasses:
      | "ks-activity"
      | `ks-activity type_ks-${
          | "accelerate"
          | "adore"
          | "build"
          | "craft"
          | "distribute"
          | "faith"
          | "festival"
          | "hunt"
          | "praise"
          | "promote"
          | "research"
          | "star"
          | "timeSkip"
          | "trade"
          | "transcend"
          | "upgrade"}`
      | "ks-default"
      | "ks-summary",
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
    //const color = args.pop();
    //args[1] = args[1] || "ks-default";

    // update the color of the message immediately after adding
    const msg = this.gamePage.msg(...args, cssClasses);
    $(msg.span).css("color", color);

    cdebug(args);
  }

  private _message(...args: Array<number | string>): void {
    //args.push("ks-default");
    //args.push(this.options.msgcolor);
    //args.push("#aa50fe");
    this._printOutput("ks-default", "#aa50fe", ...args);
  }

  private _activity(...args: Array<number | string>): void {
    const activityClass = args.length > 1 ? "type_" + args.pop() : "";
    //args.push("ks-activity" + activityClass);
    //args.push(this.options.activitycolor);
    //args.push("#E65C00");
    this._printOutput(`ks-activity ${activityClass}`, "#e65C00", ...args);
  }

  private _summary(...args: Array<number | string>): void {
    //args.push("ks-summary");
    //args.push(this.options.summarycolor);
    //args.push("#009933");
    this._printOutput("ks-summary", "#009933", ...args);
  }

  warning(...args: Array<number | string>): void {
    args.unshift("Warning!");
    if (console) {
      clog(args);
    }
  }

  imessage(
    key: keyof typeof i18nData[SupportedLanguages],
    args: Array<number | string> = [],
    ...templateArgs: Array<string>
  ): void {
    this._message(this.i18n(key, args), ...templateArgs);
  }
  iactivity(
    key: keyof typeof i18nData[SupportedLanguages],
    args: Array<number | string> = [],
    ...templateArgs: Array<string>
  ): void {
    this._activity(this.i18n(key, args), ...templateArgs);
  }
  private _isummary(
    key: keyof typeof i18nData[SupportedLanguages],
    args: Array<number | string>,
    ...templateArgs: Array<string>
  ): void {
    this._summary(this.i18n(key, args), ...templateArgs);
  }
  private _iwarning(
    key: keyof typeof i18nData[SupportedLanguages],
    args: Array<number | string>,
    ...templateArgs: Array<string>
  ): void {
    this.warning(this.i18n(key, args), ...templateArgs);
  }

  resetActivitySummary(): void {
    this._activitySummary = {
      lastyear: this.gamePage.calendar.year,
      lastday: this.gamePage.calendar.day,
      craft: {},
      trade: {},
      build: {},
      other: {},
    };
  }

  storeForSummary(name: string, amount = 1, section: ActivitySummarySection = "other"): void {
    let summarySection = this._activitySummary[section];
    if (summarySection === undefined) {
      summarySection = this._activitySummary[section] = {};
    }

    if (summarySection[name] === undefined) {
      summarySection[name] = 0;
    }
    (summarySection[name] as number) += amount;
  }

  displayActivitySummary(): void {
    for (const [i, value] of objectEntries<ActivitySectionOther, number>(
      this._activitySummary.other
    )) {
      this._isummary(`summary.${i}`, [this.gamePage.getDisplayValueExt(value)]);
    }

    // Techs
    for (const name in this._activitySummary.research) {
      this._isummary("summary.tech", [ucfirst(name)]);
    }

    // Upgrades
    for (const name in this._activitySummary.upgrade) {
      this._isummary("summary.upgrade", [ucfirst(name)]);
    }

    // Buildings
    for (const name in this._activitySummary.build) {
      this._isummary("summary.building", [
        this.gamePage.getDisplayValueExt(this._activitySummary.build[name]),
        ucfirst(name),
      ]);
    }

    // Order of the Sun
    for (const name in this._activitySummary.faith) {
      this._isummary("summary.sun", [
        this.gamePage.getDisplayValueExt(this._activitySummary.faith[name]),
        ucfirst(name),
      ]);
    }

    // Crafts
    for (const name in this._activitySummary.craft) {
      this._isummary("summary.craft", [
        this.gamePage.getDisplayValueExt(this._activitySummary.craft[name]),
        ucfirst(name),
      ]);
    }

    // Trading
    for (const name in this._activitySummary.trade) {
      this._isummary("summary.trade", [
        this.gamePage.getDisplayValueExt(this._activitySummary.trade[name]),
        ucfirst(name),
      ]);
    }

    // Show time since last run. Assumes that the day and year are always higher.
    if (this._activitySummary.lastyear && this._activitySummary.lastday) {
      let years = this.gamePage.calendar.year - (this._activitySummary.lastyear as number);
      let days = this.gamePage.calendar.day - (this._activitySummary.lastday as number);

      if (days < 0) {
        years -= 1;
        days += 400;
      }

      let duration = "";
      if (years > 0) {
        duration += years + " ";
        duration += years == 1 ? this.i18n("summary.year") : this.i18n("summary.years");
      }

      if (days >= 0) {
        if (years > 0) duration += this.i18n("summary.separator");
        duration += roundToTwo(days) + " ";
        duration += days == 1 ? this.i18n("summary.day") : this.i18n("summary.days");
      }

      this._isummary("summary.head", [duration]);
    }

    // Clear out the old activity
    this.resetActivitySummary();
  }

  static async waitForGame(timeout = 30000): Promise<void> {
    cdebug(`Waiting for game... (timeout: ${Math.round(timeout / 1000)}s)`);

    if (timeout < 0) {
      throw new Error("Unable to find game page.");
    }

    if (UserScript._isGameLoaded()) {
      return;
    }

    await sleep(2000);
    return UserScript.waitForGame(timeout - 2000);
  }

  static async getDefaultInstance(): Promise<UserScript> {
    return new UserScript(
      mustExist(UserScript._window.gamePage),
      mustExist(UserScript._window.$I),
      localStorage["com.nuclearunicorn.kittengame.language"]
    );
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
