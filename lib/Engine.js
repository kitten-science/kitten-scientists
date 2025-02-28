import { isNil, mustExist } from "@oliversalzburg/js-utils/data/nil.js";
import { unknownToError } from "@oliversalzburg/js-utils/errors/error-serializer.js";
import { measure, measureAsync } from "@oliversalzburg/js-utils/measurement/performance.js";
import { BonfireManager } from "./BonfireManager.js";
import { ksVersion } from "./KittenScientists.js";
import { ReligionManager } from "./ReligionManager.js";
import { ScienceManager } from "./ScienceManager.js";
import { SpaceManager } from "./SpaceManager.js";
import { TimeControlManager } from "./TimeControlManager.js";
import { TimeManager } from "./TimeManager.js";
import { TradeManager } from "./TradeManager.js";
import { FallbackLocale } from "./UserScriptLoader.js";
import { VillageManager } from "./VillageManager.js";
import { WorkshopManager } from "./WorkshopManager.js";
import { ActivitySummary } from "./helper/ActivitySummary.js";
import enUS from "./i18n/en-US.json" assert { type: "json" };
import deDE from "./i18n/translations/de-DE.json" assert { type: "json" };
import heIL from "./i18n/translations/he-IL.json" assert { type: "json" };
import zhCN from "./i18n/translations/zh-CN.json" assert { type: "json" };
import { BonfireSettings } from "./settings/BonfireSettings.js";
import { EngineSettings } from "./settings/EngineSettings.js";
import { ReligionSettings } from "./settings/ReligionSettings.js";
import { ScienceSettings } from "./settings/ScienceSettings.js";
import { SpaceSettings } from "./settings/SpaceSettings.js";
import { TimeControlSettings } from "./settings/TimeControlSettings.js";
import { TimeSettings } from "./settings/TimeSettings.js";
import { TradeSettings } from "./settings/TradeSettings.js";
import { VillageSettings } from "./settings/VillageSettings.js";
import { WorkshopSettings } from "./settings/WorkshopSettings.js";
import { cdebug, cerror, cinfo, cwarn } from "./tools/Log.js";
import { Cycles } from "./types/index.js";
const i18nData = { "de-DE": deDE, "en-US": enUS, "he-IL": heIL, "zh-CN": zhCN };
export class Engine {
  /**
   * All i18n literals of the userscript.
   */
  _i18nData;
  /**
   * Was any state loaded into this engine at any point in time?
   */
  _isLoaded = false;
  get isLoaded() {
    return this._isLoaded;
  }
  _host;
  settings;
  bonfireManager;
  religionManager;
  scienceManager;
  spaceManager;
  timeControlManager;
  timeManager;
  tradeManager;
  villageManager;
  workshopManager;
  _activitySummary;
  _timeoutMainLoop = undefined;
  constructor(host, gameLanguage) {
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
      this.workshopManager,
    );
    this.scienceManager = new ScienceManager(this._host, this.workshopManager);
    this.spaceManager = new SpaceManager(this._host, this.workshopManager);
    this.timeControlManager = new TimeControlManager(
      this._host,
      this.bonfireManager,
      this.religionManager,
      this.spaceManager,
      this.workshopManager,
    );
    this.timeManager = new TimeManager(this._host, this.workshopManager);
    this.tradeManager = new TradeManager(this._host, this.workshopManager);
    this.villageManager = new VillageManager(this._host, this.workshopManager);
  }
  isLanguageSupported(language) {
    return Object.keys(this._i18nData).some(locale => locale.startsWith(`${language}-`));
  }
  isLocaleSupported(locale) {
    return locale in this._i18nData;
  }
  localeSupportsFirstLetterSplits(locale = this.settings.locale.selected) {
    return locale !== "zh-CN";
  }
  localeForLanguage(language) {
    return Object.keys(this._i18nData).find(locale => locale.startsWith(`${language}-`));
  }
  setLanguage(language, rebuildUI = true) {
    const previousLocale = this.settings.locale.selected;
    if (!this.isLanguageSupported(language)) {
      cwarn(
        `Requested language '${language}' is not available. Falling back to '${FallbackLocale}'.`,
      );
      this.settings.locale.selected = FallbackLocale;
    } else {
      const locale = mustExist(this.localeForLanguage(language));
      cinfo(`Selecting language '${locale}'.`);
      this.settings.locale.selected = locale;
    }
    if (previousLocale !== this.settings.locale.selected && rebuildUI) {
      this._host.rebuildUi();
    }
  }
  setLocale(locale, rebuildUI = true) {
    const previousLocale = this.settings.locale.selected;
    if (!this.isLocaleSupported(locale)) {
      cwarn(
        `Requested language '${locale}' is not available. Falling back to '${FallbackLocale}'.`,
      );
      this.settings.locale.selected = FallbackLocale;
    } else {
      cinfo(`Selecting language '${locale}'.`);
      this.settings.locale.selected = locale;
    }
    if (previousLocale !== this.settings.locale.selected && rebuildUI) {
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
  stateLoad(settings, retainMetaBehavior = false) {
    this._isLoaded = true;
    this.stop(false);
    // For now, we only log a warning on mismatching tags.
    // Ideally, we would perform semver comparison, but that is
    // excessive at this point in time. The goal should be a stable
    // state import of most versions anyway.
    const version = ksVersion();
    if (settings.v !== version) {
      cwarn(
        `Attempting to load engine state with version tag '${settings.v}' when engine is at version '${version}'!`,
      );
    }
    // Perform the load of each sub settings section in a try-catch to
    // allow us to still load the other sections if there were schema
    // changes.
    const attemptLoad = (loader, errorMessage) => {
      try {
        loader();
      } catch (error) {
        cerror(`Failed load of ${errorMessage} settings.`, error);
      }
    };
    attemptLoad(() => {
      this.settings.load(settings.engine, retainMetaBehavior);
    }, "engine");
    attemptLoad(() => {
      this.bonfireManager.settings.load(settings.bonfire);
    }, "bonfire");
    attemptLoad(() => {
      this.religionManager.settings.load(settings.religion);
    }, "religion");
    attemptLoad(() => {
      this.scienceManager.settings.load(settings.science);
    }, "science");
    attemptLoad(() => {
      this.spaceManager.settings.load(settings.space);
    }, "space");
    attemptLoad(() => {
      this.timeControlManager.settings.load(settings.timeControl);
    }, "time control");
    attemptLoad(() => {
      this.timeManager.settings.load(settings.time);
    }, "time");
    attemptLoad(() => {
      this.tradeManager.settings.load(settings.trade);
    }, "trade");
    attemptLoad(() => {
      this.villageManager.settings.load(settings.village);
    }, "village");
    attemptLoad(() => {
      this.workshopManager.settings.load(settings.workshop);
    }, "workshop");
    this.setLocale(this.settings.locale.selected);
    // Ensure the main engine setting is respected.
    if (this.settings.enabled) {
      this.start(false);
    } else {
      this.stop(false);
    }
  }
  static get DEFAULT_STATE() {
    return {
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
    };
  }
  stateReset() {
    this.stateLoad(Engine.DEFAULT_STATE);
  }
  /**
   * Serializes all settings in the engine.
   *
   * @returns A snapshot of the current engine settings state.
   */
  stateSerialize() {
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
  start(msg = true) {
    if (this._timeoutMainLoop) {
      return;
    }
    const loop = () => {
      const context = {
        requestGameUiRefresh: false,
        entry: new Date().getTime(),
        exit: 0,
        measurements: {},
      };
      this._iterate(context)
        .then(() => {
          context.exit = new Date().getTime();
          const timeTaken = context.exit - context.entry;
          document.dispatchEvent(new CustomEvent("ks.reportFrame", { detail: context }));
          // Check if the main loop was terminated during
          // the last iteration.
          if (this._timeoutMainLoop === undefined) {
            return;
          }
          this._timeoutMainLoop = window.setTimeout(
            loop,
            Math.max(10, this._host.engine.settings.interval - timeTaken),
          );
        })
        .catch(error => {
          cwarn(unknownToError(error));
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
  stop(msg = true) {
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
  async _iterate(context) {
    // The logic here is inverted, because _disabled_ items are hidden from the log.
    if (!this.settings.filters.disableKGLog.enabled) {
      this._maintainKGLogFilters();
    }
    // The order in which these actions are performed is probably
    // semi-intentional and should be preserved or improved.
    let [, duration] = await measureAsync(() => this.scienceManager.tick(context));
    context.measurements.scienceManager = duration;
    [, duration] = measure(() => {
      this.bonfireManager.tick(context);
    });
    context.measurements.bonfireManager = duration;
    [, duration] = measure(() => {
      this.spaceManager.tick(context);
    });
    context.measurements.spaceManager = duration;
    [, duration] = await measureAsync(() => this.workshopManager.tick(context));
    context.measurements.workshopManager = duration;
    [, duration] = measure(() => {
      this.tradeManager.tick(context);
    });
    context.measurements.tradeManager = duration;
    [, duration] = await measureAsync(() => this.religionManager.tick(context));
    context.measurements.religionManager = duration;
    [, duration] = measure(() => {
      this.timeManager.tick(context);
    });
    context.measurements.timeManager = duration;
    [, duration] = measure(() => {
      this.villageManager.tick(context);
    });
    context.measurements.villageManager = duration;
    [, duration] = await measureAsync(() => this.timeControlManager.tick(context));
    context.measurements.timeControlManager = duration;
    [, duration] = measure(() => {
      if (context.requestGameUiRefresh) {
        this._host.game.ui.render();
      }
    });
    context.measurements.gameUiRefresh = duration;
  }
  /**
   * Ensures all log filters in KG are unchecked. This means the events will not be logged.
   */
  _maintainKGLogFilters() {
    for (const filter of Object.values(this._host.game.console.filters)) {
      filter.enabled = false;
    }
    const filterCheckboxes = window.document.querySelectorAll("[id^=filter-]");
    for (const checkbox of filterCheckboxes) {
      checkbox.checked = false;
    }
  }
  symbolForCycle(cycle) {
    return this._host.game.calendar.cycles.find(entry => entry.name === cycle)?.uglyph ?? "";
  }
  labelForCycle(cycle) {
    const symbol = this.symbolForCycle(cycle);
    const label = this._host.engine.i18n(
      `$space.planet.${cycle === "redmoon" ? "moon" : cycle}.label`,
    );
    return `${symbol} ${label}`;
  }
  labelForPlanet(planet) {
    const cycleCandidate = planet === "moon" ? "redmoon" : planet;
    const cycle = Cycles.includes(cycleCandidate) ? cycleCandidate : undefined;
    const label = this._host.engine.i18n(`$space.planet.${planet}.label`);
    return cycle === undefined ? label : `${this.symbolForCycle(cycle)} ${label}`;
  }
  /**
   * Retrieve an internationalized string literal.
   *
   * @param key The key to retrieve from the translation table.
   * @param args Variable arguments to render into the string.
   * @returns The translated string.
   */
  i18n(key, args = []) {
    let value;
    // Key is to be translated through KG engine.
    if (key.startsWith("$")) {
      value = this._host.i18nEngine(key.slice(1));
    }
    value = value ?? this._i18nData[this.settings.locale.selected][key];
    const check = value;
    if (isNil(check)) {
      value = i18nData[FallbackLocale][key];
      if (!value) {
        cwarn(`i18n key '${key}' not found in default language.`);
        return `$${key}`;
      }
      cwarn(`i18n key '${key}' not found in selected language.`);
    }
    for (let argIndex = 0; argIndex < args.length; ++argIndex) {
      value = value.replace(`{${argIndex}}`, `${args[argIndex]}`);
    }
    return value;
  }
  iactivity(i18nLiteral, i18nArgs = [], logStyle) {
    const text = this.i18n(i18nLiteral, i18nArgs);
    if (logStyle) {
      const activityClass = `type_${logStyle}`;
      this._printOutput(`ks-activity ${activityClass}`, "#e65C00", text);
    } else {
      this._printOutput("ks-activity", "#e65C00", text);
    }
  }
  imessage(i18nLiteral, i18nArgs = []) {
    this._printOutput("ks-default", "#aa50fe", this.i18n(i18nLiteral, i18nArgs));
  }
  storeForSummary(name, amount = 1, section = "other") {
    this._activitySummary.storeActivity(name, amount, section);
  }
  getSummary() {
    return this._activitySummary.renderSummary();
  }
  displayActivitySummary() {
    const summary = this.getSummary();
    for (const summaryLine of summary) {
      this._printOutput("ks-summary", "#009933", summaryLine);
    }
    // Clear out the old activity
    this.resetActivitySummary();
  }
  resetActivitySummary() {
    this._activitySummary.resetActivity();
  }
  _printOutput(cssClasses, color, ...args) {
    if (this.settings.filters.enabled) {
      for (const filterItem of Object.values(this.settings.filters.filters)) {
        if (filterItem.variant === cssClasses && !filterItem.enabled) {
          return;
        }
      }
    }
    // update the color of the message immediately after adding
    const msg = this._host.game.msg(...args, cssClasses);
    $(msg.span).css("color", color);
    cdebug(...args);
  }
  static evaluateSubSectionTrigger(sectionTrigger, subSectionTrigger) {
    return sectionTrigger < 0
      ? subSectionTrigger
      : subSectionTrigger < 0
        ? sectionTrigger
        : subSectionTrigger;
  }
}
//# sourceMappingURL=Engine.js.map
