import { BonfireManager } from "./BonfireManager";
import {
  ActivityClass,
  ActivitySummary,
  ActivitySummarySection,
  ActivityTypeClass,
} from "./helper/ActivitySummary";
import de from "./i18n/de.json";
import en from "./i18n/en.json";
import he from "./i18n/he.json";
import zh from "./i18n/zh.json";
import { ReligionManager } from "./ReligionManager";
import { ScienceManager } from "./ScienceManager";
import { BonfireSettings } from "./settings/BonfireSettings";
import { EngineSettings } from "./settings/EngineSettings";
import { ReligionSettings } from "./settings/ReligionSettings";
import { ScienceSettings } from "./settings/ScienceSettings";
import { SpaceSettings } from "./settings/SpaceSettings";
import { TimeControlSettings } from "./settings/TimeControlSettings";
import { TimeSettings } from "./settings/TimeSettings";
import { TradeSettings } from "./settings/TradeSettings";
import { VillageSettings } from "./settings/VillageSettings";
import { WorkshopSettings } from "./settings/WorkshopSettings";
import { SpaceManager } from "./SpaceManager";
import { TimeControlManager } from "./TimeControlManager";
import { TimeManager } from "./TimeManager";
import { cdebug, cerror, cinfo, cwarn } from "./tools/Log";
import { TradeManager } from "./TradeManager";
import { FallbackLanguage, ksVersion, UserScript } from "./UserScript";
import { VillageManager } from "./VillageManager";
import { WorkshopManager } from "./WorkshopManager";

const i18nData = { de, en, he, zh };

export type TickContext = {
  tick: number;
};
export type Automation = {
  tick(context: TickContext): void | Promise<void>;
};
export type EngineState = {
  v: string;
  engine: EngineSettings;
  bonfire: BonfireSettings;
  religion: ReligionSettings;
  science: ScienceSettings;
  space: SpaceSettings;
  timeControl: TimeControlSettings;
  time: TimeSettings;
  trade: TradeSettings;
  village: VillageSettings;
  workshop: WorkshopSettings;
};
export type GameLanguage =
  | "en"
  | "br"
  | "cz"
  | "de"
  | "es"
  | "fr"
  | "fro"
  | "it"
  | "ja"
  | "ko"
  | "nl"
  | "no"
  | "pl"
  | "ro"
  | "ru"
  | "tr"
  | "uk"
  | "zh"
  | "zht";
export type SupportedLanguage = "de" | "en" | "he" | "zh";

export class Engine {
  /**
   * All i18n literals of the userscript.
   */
  private readonly _i18nData: typeof i18nData;

  readonly _host: UserScript;
  readonly settings: EngineSettings;
  readonly bonfireManager: BonfireManager;
  readonly religionManager: ReligionManager;
  readonly scienceManager: ScienceManager;
  readonly spaceManager: SpaceManager;
  readonly timeControlManager: TimeControlManager;
  readonly timeManager: TimeManager;
  readonly tradeManager: TradeManager;
  readonly villageManager: VillageManager;
  readonly workshopManager: WorkshopManager;

  private _activitySummary: ActivitySummary;
  private _timeoutMainLoop: number | undefined = undefined;

  constructor(host: UserScript, gameLanguage: GameLanguage) {
    this.settings = new EngineSettings();

    this._i18nData = i18nData;
    this.setLanguage(gameLanguage, false);

    this._host = host;
    this._activitySummary = new ActivitySummary(this._host);

    this.workshopManager = new WorkshopManager(this._host);

    this.bonfireManager = new BonfireManager(this._host, this.workshopManager);
    this.religionManager = new ReligionManager(
      this._host,
      this.bonfireManager,
      this.workshopManager
    );
    this.scienceManager = new ScienceManager(this._host, this.workshopManager);
    this.spaceManager = new SpaceManager(this._host, this.workshopManager);
    this.timeControlManager = new TimeControlManager(
      this._host,
      this.bonfireManager,
      this.religionManager,
      this.spaceManager,
      this.workshopManager
    );
    this.timeManager = new TimeManager(this._host, this.workshopManager);
    this.tradeManager = new TradeManager(this._host, this.workshopManager);
    this.villageManager = new VillageManager(this._host, this.workshopManager);
  }

  isLanguageSupported(language: string): boolean {
    return language in this._i18nData;
  }

  setLanguage(language: GameLanguage | SupportedLanguage, rebuildUI = true) {
    const previousLanguage = this.settings.language.selected;
    if (!this.isLanguageSupported(language)) {
      cwarn(
        `Requested language '${language}' is not available. Falling back to '${FallbackLanguage}'.`
      );
      this.settings.language.selected = FallbackLanguage;
    } else {
      cinfo(`Selecting language '${language}'.`);
      this.settings.language.selected = language as SupportedLanguage;
    }

    if (previousLanguage !== this.settings.language.selected && rebuildUI) {
      this._host.rebuildUi();
    }
  }

  /**
   * Loads a new state into the engine.
   *
   * @param settings The engine state to load.
   * @param retainMetaBehavior When set to `true`, the engine will not be stopped or started, if the engine
   * state would require that. The settings for state management are also not loaded from the engine state.
   * This is intended to make loading of previous settings snapshots more intuitive.
   */
  stateLoad(settings: EngineState, retainMetaBehavior = false) {
    // For now, we only log a warning on mismatching tags.
    // Ideally, we would perform semver comparison, but that is
    // excessive at this point in time. The goal should be a stable
    // state import of most versions anyway.
    const version = ksVersion();
    if (settings.v !== version) {
      cwarn(
        `Attempting to load engine state with version tag '${settings.v}' when engine is at version '${version}'!`
      );
    }

    // Perform the load of each sub settings section in a try-catch to
    // allow us to still load the other sections if there were schema
    // changes.
    const attemptLoad = (loader: () => unknown, errorMessage: string) => {
      try {
        loader();
      } catch (error) {
        cerror(`Failed load of ${errorMessage} settings.`, error);
      }
    };

    attemptLoad(() => this.settings.load(settings.engine, retainMetaBehavior), "engine");
    attemptLoad(() => this.bonfireManager.settings.load(settings.bonfire), "bonfire");
    attemptLoad(() => this.religionManager.settings.load(settings.religion), "religion");
    attemptLoad(() => this.scienceManager.settings.load(settings.science), "science");
    attemptLoad(() => this.spaceManager.settings.load(settings.space), "space");
    attemptLoad(() => this.timeControlManager.settings.load(settings.timeControl), "time control");
    attemptLoad(() => this.timeManager.settings.load(settings.time), "time");
    attemptLoad(() => this.tradeManager.settings.load(settings.trade), "trade");
    attemptLoad(() => this.villageManager.settings.load(settings.village), "village");
    attemptLoad(() => this.workshopManager.settings.load(settings.workshop), "workshop");

    this.setLanguage(this.settings.language.selected);

    // Ensure the main engine setting is respected.
    if (this.settings.enabled) {
      this.start(false);
    } else {
      this.stop(false);
    }
  }

  stateReset() {
    this.stateLoad({
      v: ksVersion(),
      engine: new EngineSettings(),
      bonfire: new BonfireSettings(),
      religion: new ReligionSettings(),
      science: new ScienceSettings(),
      space: new SpaceSettings(),
      timeControl: new TimeControlSettings(),
      time: new TimeSettings(),
      trade: new TradeSettings(),
      village: new VillageSettings(),
      workshop: new WorkshopSettings(),
    });
  }

  /**
   * Serializes all settings in the engine.
   *
   * @returns A snapshot of the current engine settings state.
   */
  stateSerialize(): EngineState {
    return {
      v: ksVersion(),
      engine: this.settings,
      bonfire: this.bonfireManager.settings,
      religion: this.religionManager.settings,
      science: this.scienceManager.settings,
      space: this.spaceManager.settings,
      timeControl: this.timeControlManager.settings,
      time: this.timeManager.settings,
      trade: this.tradeManager.settings,
      village: this.villageManager.settings,
      workshop: this.workshopManager.settings,
    };
  }

  /**
   * Start the Kitten Scientists engine.
   *
   * @param msg Should we print to the log that the engine was started?
   */
  start(msg = true): void {
    if (this._timeoutMainLoop) {
      return;
    }

    const loop = () => {
      const entry = Date.now();
      this._iterate()
        .then(() => {
          const exit = Date.now();
          const timeTaken = exit - entry;

          // Check if the main loop was terminated during
          // the last iteration.
          if (this._timeoutMainLoop === undefined) {
            return;
          }

          this._timeoutMainLoop = window.setTimeout(
            loop,
            Math.max(10, this._host.engine.settings.interval - timeTaken)
          );
        })
        .catch(error => {
          cwarn(error as string);
        });
    };
    this._timeoutMainLoop = window.setTimeout(loop, this._host.engine.settings.interval);

    if (msg) {
      this._host.engine.imessage("status.ks.enable");
    }
  }

  /**
   * Stop the Kitten Scientists engine.
   *
   * @param msg Should we print to the log that the engine was stopped?
   */
  stop(msg = true): void {
    if (!this._timeoutMainLoop) {
      return;
    }

    clearTimeout(this._timeoutMainLoop);
    this._timeoutMainLoop = undefined;

    if (msg) {
      this._host.engine.imessage("status.ks.disable");
    }
  }

  /**
   * The main loop of the automation script.
   */
  private async _iterate(): Promise<void> {
    const context = { tick: new Date().getTime() };

    // The order in which these actions are performed is probably
    // semi-intentional and should be preserved or improved.
    await this.scienceManager.tick(context);
    this.bonfireManager.tick(context);
    this.spaceManager.tick(context);
    await this.workshopManager.tick(context);
    this.tradeManager.tick(context);
    await this.religionManager.tick(context);
    this.timeManager.tick(context);
    this.villageManager.tick(context);
    await this.timeControlManager.tick(context);
  }

  /**
   * Retrieve an internationalized string literal.
   *
   * @param key The key to retrieve from the translation table.
   * @param args Variable arguments to render into the string.
   * @returns The translated string.
   */
  i18n<TKittenGameLiteral extends `$${string}`>(
    key: keyof typeof i18nData.en | TKittenGameLiteral,
    args: Array<number | string> = []
  ): string {
    let value;

    // Key is to be translated through KG engine.
    if (key.startsWith("$")) {
      value = this._host.i18nEngine(key.slice(1));
    }

    value =
      value ??
      this._i18nData[this.settings.language.selected][
        key as keyof (typeof i18nData)[SupportedLanguage]
      ];

    if (typeof value === "undefined" || value === null) {
      value = i18nData[FallbackLanguage][key as keyof (typeof i18nData)[SupportedLanguage]];
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

  iactivity(
    i18nLiteral: keyof (typeof i18nData)["en"],
    i18nArgs: Array<number | string> = [],
    logStyle?: ActivityClass
  ): void {
    const text = this.i18n(i18nLiteral, i18nArgs);
    if (logStyle) {
      const activityClass: ActivityTypeClass = `type_${logStyle}` as const;
      this._printOutput(`ks-activity ${activityClass}` as const, "#e65C00", text);
    } else {
      this._printOutput("ks-activity", "#e65C00", text);
    }
  }

  imessage(
    i18nLiteral: keyof (typeof i18nData)["en"],
    i18nArgs: Array<number | string> = []
  ): void {
    this._printOutput("ks-default", "#aa50fe", this.i18n(i18nLiteral, i18nArgs));
  }

  storeForSummary(name: string, amount = 1, section: ActivitySummarySection = "other"): void {
    this._activitySummary.storeActivity(name, amount, section);
  }

  getSummary() {
    return this._activitySummary.renderSummary();
  }

  displayActivitySummary(): void {
    const summary = this.getSummary();
    for (const summaryLine of summary) {
      this._printOutput("ks-summary", "#009933", summaryLine);
    }

    // Clear out the old activity
    this.resetActivitySummary();
  }

  resetActivitySummary(): void {
    this._activitySummary.resetActivity();
  }

  private _printOutput(
    cssClasses: "ks-activity" | `ks-activity ${ActivityTypeClass}` | "ks-default" | "ks-summary",
    color: string,
    ...args: Array<number | string>
  ): void {
    if (this.settings.filters.enabled) {
      for (const filterItem of Object.values(this.settings.filters.filters)) {
        if (filterItem.variant === cssClasses && !filterItem.enabled) {
          return;
        }
      }
    }

    // update the color of the message immediately after adding
    const msg = this._host.gamePage.msg(...args, cssClasses);
    $(msg.span).css("color", color);

    cdebug(...args);
  }
}
