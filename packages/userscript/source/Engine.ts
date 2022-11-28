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
import { cdebug, cerror, cwarn } from "./tools/Log";
import { TradeManager } from "./TradeManager";
import { DefaultLanguage, ksVersion, UserScript } from "./UserScript";
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
export type SupportedLanguages = "de" | "en" | "he" | "zh";

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
  private _intervalMainLoop: number | undefined = undefined;

  constructor(host: UserScript) {
    this._i18nData = i18nData;

    this._host = host;
    this._activitySummary = new ActivitySummary(this._host);

    this.settings = new EngineSettings();

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
    if (this._intervalMainLoop) {
      return;
    }

    const loop = () => {
      const entry = Date.now();
      this._iterate()
        .then(() => {
          const exit = Date.now();
          const timeTaken = exit - entry;
          this._intervalMainLoop = window.setTimeout(
            loop,
            Math.max(10, this._host.engine.settings.interval - timeTaken)
          );
        })
        .catch(error => {
          cwarn(error as string);
        });
    };
    this._intervalMainLoop = window.setTimeout(loop, this._host.engine.settings.interval);

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
    if (!this._intervalMainLoop) {
      return;
    }

    clearTimeout(this._intervalMainLoop);
    this._intervalMainLoop = undefined;

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

  getEnergyReport() {
    const accelerator = this._host.gamePage.bld.getBuildingExt("accelerator").meta;
    const aqueduct = this._host.gamePage.bld.getBuildingExt("aqueduct").meta;
    const biolab = this._host.gamePage.bld.getBuildingExt("biolab").meta;
    const calciner = this._host.gamePage.bld.getBuildingExt("calciner").meta;
    const chronosphere = this._host.gamePage.bld.getBuildingExt("chronosphere").meta;
    const factory = this._host.gamePage.bld.getBuildingExt("factory").meta;
    const library = this._host.gamePage.bld.getBuildingExt("library").meta;
    const lunaroutpost = this._host.gamePage.space.getBuilding("moonOutpost");
    const magneto = this._host.gamePage.bld.getBuildingExt("magneto").meta;
    const moonbase = this._host.gamePage.space.getBuilding("moonBase");
    const oilwell = this._host.gamePage.bld.getBuildingExt("oilWell").meta;
    const orbitalarray = this._host.gamePage.space.getBuilding("orbitalArray");
    const pasture = this._host.gamePage.bld.getBuildingExt("pasture").meta;
    const reactor = this._host.gamePage.bld.getBuildingExt("reactor").meta;
    const satellite = this._host.gamePage.space.getBuilding("sattelite");
    const spacestation = this._host.gamePage.space.getBuilding("spaceStation");
    const steamworks = this._host.gamePage.bld.getBuildingExt("steamworks").meta;
    const sunlifter = this._host.gamePage.space.getBuilding("sunlifter");

    const acceleratorCount = accelerator.on;
    const biolabCount = biolab.on;
    const calcinerCount = calciner.on;
    const chronosphereCount = chronosphere.val;
    const datacenterCount = library.stage === 1 ? library.on : 0;
    const factoryCount = factory.on;
    const hydroPlantCount = aqueduct.stage === 1 ? aqueduct.on : 0;
    const lunaroutpostCount = lunaroutpost.on;
    const magnetoCount = magneto.on;
    const moonbaseCount = moonbase.on;
    const oilwellCount = oilwell.on;
    const orbitalarrayCount = orbitalarray.on;
    const reactorCount = reactor.on;
    const satelliteCount = satellite.val;
    const solarFarmCount = pasture.stage === 1 ? pasture.on : 0;
    const spacestationCount = spacestation.on;
    const steamworksCount = steamworks.on;
    const sunlifterCount = sunlifter.val;

    const acceleratorEnergy =
      0 < acceleratorCount ? -(accelerator.effects.energyConsumption ?? 0) : 0;
    const biolabEnergy = 0 < biolabCount ? -(biolab.effects.energyConsumption ?? 0) : 0;
    const calcinerEnergy = 0 < calcinerCount ? -(calciner.effects.energyConsumption ?? 0) : 0;
    const chronosphereEnergy =
      0 < chronosphereCount ? -(chronosphere.effects.energyConsumption ?? 0) : 0;
    const datacenterEnergy =
      0 < datacenterCount ? -(library.stages?.[1]?.effects?.energyConsumption ?? 0) : 0;
    const factoryEnergy = 0 < factoryCount ? -(factory.effects.energyConsumption ?? 0) : 0;
    const hydroPlantEnergy =
      0 < hydroPlantCount ? aqueduct.stages?.[1]?.effects?.energyProduction ?? 0 : 0;
    const lunaroutpostEnergy =
      0 < lunaroutpostCount ? -(lunaroutpost.effects.energyConsumption ?? 0) : 0;
    const magnetoEnergy = 0 < magnetoCount ? magneto.effects.energyProduction ?? 0 : 0;
    const moonbaseEnergy = 0 < moonbaseCount ? -(moonbase.effects.energyConsumption ?? 0) : 0;
    const oilwellEnergy = 0 < oilwellCount ? -(oilwell.effects.energyConsumption ?? 0) : 0;
    const orbitalarrayEnergy =
      0 < orbitalarrayCount ? -(orbitalarray.effects.energyConsumption ?? 0) : 0;
    const reactorEnery = 0 < reactorCount ? reactor.effects.energyProduction ?? 0 : 0;
    const satelitteEnergy = 0 < satelliteCount ? satellite.effects.energyProduction ?? 0 : 0;
    const solarFarmEnergy =
      0 < solarFarmCount
        ? pasture.stages?.[1]?.calculateEnergyProduction?.(
            this._host.gamePage,
            this._host.gamePage.calendar.season
          ) ?? 0
        : 0;
    const spacestationEnergy =
      0 < spacestationCount ? -(spacestation.effects.energyConsumption ?? 0) : 0;
    const steamworksEnergy = 0 < steamworksCount ? steamworks.effects.energyProduction ?? 0 : 0;
    const sunlifterEnergy = 0 < sunlifterCount ? sunlifter.effects.energyProduction ?? 0 : 0;

    const acceleratorTotal = acceleratorCount * acceleratorEnergy;
    const biolabTotal = biolabCount * biolabEnergy;
    const calcinerTotal = calcinerCount * calcinerEnergy;
    const chronosphereTotal = chronosphereCount * chronosphereEnergy;
    const datacenterTotal = datacenterCount * datacenterEnergy;
    const factoryTotal = factoryCount * factoryEnergy;
    const hydroPlantTotal = hydroPlantCount * hydroPlantEnergy;
    const lunaroutpostTotal = lunaroutpostCount * lunaroutpostEnergy;
    const magnetoTotal = magnetoCount * magnetoEnergy;
    const moonbaseTotal = moonbaseCount * moonbaseEnergy;
    const oilwellTotal = oilwellCount * oilwellEnergy;
    const orbitalarrayTotal = orbitalarrayCount * orbitalarrayEnergy;
    const reactorTotal = reactorCount * reactorEnery;
    const satelliteTotal = satelliteCount * satelitteEnergy;
    const solarFarmTotal = solarFarmCount * solarFarmEnergy;
    const spacestationTotal = spacestationCount * spacestationEnergy;
    const steamworksTotal = steamworksCount * steamworksEnergy;
    const sunlifterTotal = sunlifterCount * sunlifterEnergy;

    const energyChallenge = this._host.gamePage.challenges.getChallenge("energy");

    const energyConsumption: Record<
      string,
      {
        Count: number | undefined;
        "Energy consumption": number | string | undefined;
        Total: number;
      }
    > = {};
    const energyProduction = new Array<{
      Building: string;
      Count: number | undefined;
      "Energy production": number | string | undefined;
      Total: number;
    }>();

    const consumptionTotal =
      acceleratorTotal +
      biolabTotal +
      calcinerTotal +
      chronosphereTotal +
      datacenterTotal +
      factoryTotal +
      lunaroutpostTotal +
      moonbaseTotal +
      oilwellTotal +
      orbitalarrayTotal +
      spacestationTotal;

    const discountTotal =
      energyChallenge.on * (energyChallenge.effects.energyConsumptionRatio ?? 0) * consumptionTotal;

    energyConsumption["Accelerator"] = {
      Count: acceleratorCount,
      "Energy consumption": acceleratorEnergy,
      Total: acceleratorTotal,
    };
    energyConsumption["Biolab"] = {
      Count: biolabCount,
      "Energy consumption": biolabEnergy,
      Total: biolabTotal,
    };
    energyConsumption["Calciner"] = {
      Count: calcinerCount,
      "Energy consumption": calcinerEnergy,
      Total: calcinerTotal,
    };
    energyConsumption["Chronosphere"] = {
      Count: chronosphereCount,
      "Energy consumption": chronosphereEnergy,
      Total: chronosphereTotal,
    };
    energyConsumption["Data center"] = {
      Count: datacenterCount,
      "Energy consumption": datacenterEnergy,
      Total: datacenterTotal,
    };
    energyConsumption["Factory"] = {
      Count: factoryCount,
      "Energy consumption": factoryEnergy,
      Total: factoryTotal,
    };
    energyConsumption["Lunar outpost"] = {
      Count: lunaroutpostCount,
      "Energy consumption": lunaroutpostEnergy,
      Total: lunaroutpostTotal,
    };
    energyConsumption["Moon base"] = {
      Count: moonbaseCount,
      "Energy consumption": moonbaseEnergy,
      Total: moonbaseTotal,
    };
    energyConsumption["Oil well"] = {
      Count: oilwellCount,
      "Energy consumption": oilwellEnergy,
      Total: oilwellTotal,
    };
    energyConsumption["Orbital array"] = {
      Count: orbitalarrayCount,
      "Energy consumption": orbitalarrayEnergy,
      Total: orbitalarrayTotal,
    };
    energyConsumption["Space station"] = {
      Count: spacestationCount,
      "Energy consumption": spacestationEnergy,
      Total: spacestationTotal,
    };
    energyConsumption["Energy challenge discount"] = {
      Count: energyChallenge.on,
      "Energy consumption": `${Math.round(
        (energyChallenge.effects.energyConsumptionRatio ?? 0) * 100
      )}%`,
      Total: discountTotal,
    };
    energyConsumption["Total"] = {
      Count: undefined,
      "Energy consumption": undefined,
      Total: consumptionTotal + discountTotal,
    };

    energyProduction.push(
      {
        Building: "Hydro plant",
        Count: hydroPlantCount,
        "Energy production": hydroPlantEnergy,
        Total: hydroPlantTotal,
      },
      {
        Building: "Magneto",
        Count: magnetoCount,
        "Energy production": magnetoEnergy,
        Total: magnetoTotal,
      },
      {
        Building: "Reactor",
        Count: reactorCount,
        "Energy production": reactorEnery,
        Total: reactorTotal,
      },
      {
        Building: "Satellite",
        Count: satelliteCount,
        "Energy production": satelitteEnergy,
        Total: satelliteTotal,
      },
      {
        Building: "Solar farm",
        Count: solarFarmCount,
        "Energy production": solarFarmEnergy,
        Total: solarFarmTotal,
      },
      {
        Building: "Steamworks",
        Count: steamworksCount,
        "Energy production": steamworksEnergy,
        Total: steamworksTotal,
      },
      {
        Building: "Sunlifter",
        Count: sunlifterCount,
        "Energy production": sunlifterEnergy,
        Total: sunlifterTotal,
      },
      {
        Building: "Total",
        Count: undefined,
        "Energy production": undefined,
        Total:
          hydroPlantTotal +
          magnetoEnergy +
          reactorTotal +
          satelliteTotal +
          solarFarmTotal +
          steamworksTotal +
          sunlifterTotal,
      }
    );

    console.table(energyConsumption);
    console.table(energyProduction);
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
      this._i18nData[this._host.language][key as keyof typeof i18nData[SupportedLanguages]];

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

  iactivity(
    i18nLiteral: keyof typeof i18nData[SupportedLanguages],
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
    i18nLiteral: keyof typeof i18nData[SupportedLanguages],
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
