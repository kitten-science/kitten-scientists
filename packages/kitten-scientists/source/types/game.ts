import { AnyFunction } from "@oliversalzburg/js-utils/core.js";
import { CycleIndices } from "../settings/TimeControlSettings.js";
import { CraftableInfo, ResourceInfo } from "./craft.js";
import {
  AllBuildings,
  BuildButton,
  Building,
  BuildingEffects,
  BuildingExt,
  BuildingMeta,
  Challenge,
  GameTab,
  KGSaveData,
  Kitten,
  Policy,
  Price,
  Race,
  RaceInfo,
  ReligionUpgrade,
  ReligionUpgradeInfo,
  Resource,
  ResourceCraftable,
  Season,
  TabId,
  TranscendenceUpgrade,
  TranscendenceUpgradeInfo,
  UpgradeInfo,
  WorkshopTab,
  ZiggurathUpgrade,
  ZiggurathUpgradeInfo,
} from "./index.js";
import { ReligionTab } from "./religion.js";
import { PolicyInfo, Technology, TechInfo as TechnologyInfo } from "./science.js";
import { Mission, SpaceBuilding, SpaceTab } from "./space.js";
import {
  ChronoForgeUpgrade,
  ChronoForgeUpgradeInfo,
  TimeTab,
  VoidSpaceUpgrade,
  VoidSpaceUpgradeInfo,
} from "./time.js";
import { TradeTab } from "./trade.js";
import { JobInfo, VillageTab } from "./village.js";

type Server = {
  showMotd: boolean;
  motdTitle: string | null;
  motdContent: string | null;

  game: Game | null;
  motdContentPrevious: string | null;
  motdFreshMessage: string | null;

  userProfile: unknown;
  chiral: null;

  lastBackup: null;
  saveData: null;

  setUserProfile: (userProfile: unknown) => void;
  getServerUrl: () => string;
  refresh: () => void;
  _xhr: (url: string, method: string, data: unknown, handler: AnyFunction) => Promise<unknown>;
  syncUserProfile: () => void;
  syncSaveData: () => Promise<unknown>;
  pushSave: () => void;
  pushSaveMetadata: (guid: string, metadata: unknown) => Promise<unknown>;
  loadSave: (guid: string) => void;
  save: (saveData: unknown) => void;
  sendCommand: (command: unknown) => void;
  setChiral: (data: unknown) => void;
};

export type Game = {
  bld: {
    buildingGroups: Array<{
      title: string;
      buildings: Array<Building>;
    }>;
    /** @deprecated Use `getBuildingExt()` instead. */
    get: (build: Building) => BuildingMeta;
    getBuildingExt: (building: Building) => BuildingExt;
    meta: [{ meta: Array<BuildingMeta> }];
  };
  calendar: {
    cryptoPrice: number;
    cycle: CycleIndices;
    cycleEffectsFestival: (options: { catnip: number }) => { catnip: number };
    cycles: Array<{ festivalEffects: { unicorns?: number }; title: string }>;
    cyclesPerEra: number;
    cycleYear: number;
    day: number;
    daysPerSeason: number;

    eventChance: number;

    /**
     * How many festival days are remaining?
     */
    festivalDays: number;

    futureSeasonTemporalParadox: number;

    getCurSeason: () => { modifiers: { catnip: number }; name: Season };
    /**
     * Get the production modifier contribution of the weather for certain resource.
     */
    getWeatherMod: (res: { name: Resource }) => number;
    observeBtn: BuildButton | null;
    observeHandler: () => void;
    season: number;
    seasons: Array<{ name: Season }>;
    seasonsPerYear: number;
    ticksPerDay: number;
    year: number;
    yearsPerCycle: number;
  };
  challenges: {
    currentChallenge?: Challenge;
    challenges: Array<{ pending: boolean }>;
    getChallenge: (challenge: Challenge) => {
      active: boolean;
      calculateEffects: (model: unknown, game: Game) => void;
      researched: number;
    };
    isActive: (challenge: Challenge) => boolean;
  };
  compressLZData: (data: string) => string;
  console: {
    filters: Record<string, { enabled: boolean; title: string; unlocked: boolean }>;
    maxMessages: number;
  };
  craft: (name: string, amount: number) => void;
  decompressLZData: (lzData: string) => string;
  devMode: boolean;
  diplomacy: {
    buyBcoin: () => void;
    /**
     * @deprecated Use `buyBcoin` instead.
     */
    buyEcoin: () => void;
    calculateStandingFromPolicies: (race: Race, host: Game) => number;
    feedElders: () => void;
    get: (race: Race) => RaceInfo;
    getMarkerCap: () => number;
    calculateTradeBonusFromPolicies: (race: Race, host: Game) => number;
    getTradeRatio: () => number;
    races: Array<RaceInfo>;
    sellBcoin: () => void;
    /**
     * @deprecated Use `sellBcoin` instead.
     */
    sellEcoin: () => void;
    tradeMultiple: (race: RaceInfo, amount: number) => void;
    unlockRandomRace: () => { title: string };
  };
  diplomacyTab: TradeTab;
  getCMBRBonus: () => number;
  getDisplayValueExt: (
    value: number,
    prefix?: boolean,
    usePerTickHack?: boolean,
    precision?: number,
    postifx?: string,
  ) => string;
  getEffect: (
    effect:
      | `${AllBuildings}CostReduction`
      | `${Resource}CostReduction`
      | `${AllBuildings}PriceRatio`
      | "catnipDemandWorkerRatioGlobal"
      | "catnipJobRatio"
      | "catnipPerTickBase"
      | "coldHarshness"
      | "corruptionBoostRatio"
      | "dataCenterAIRatio"
      | "heatMax"
      | "heatPerTick"
      | "hunterRatio"
      | "mapPriceReduction"
      | "oilReductionRatio"
      | "priceRatio"
      | "riftChance"
      | "shatterCostIncreaseChallenge"
      | "shatterVoidCost"
      | "solarRevolutionLimit"
      | "standingRatio"
      | "temporalFluxProduction"
      | "temporalParadoxDay"
      | "tradeCatpowerDiscount"
      | "tradeGoldDiscount"
      | "unicornsGlobalRatio"
      | "unicornsPerTickBase"
      | "unicornsRatioReligion"
      | "uplinkDCRatio",
  ) => number;
  /**
   * Calculate limited diminishing returns.
   */
  getLimitedDR: (effect: number, limit: number) => number;

  /**
   * The resource craft ratio indicates how many items you receive
   * as the result of a single craft. This is subject to a variety
   * of bonus effects.
   *
   * @param name The resource to check.
   */
  getResCraftRatio: (name: ResourceCraftable) => number;

  getResourcePerDay: (resName: Resource) => number;
  getResourceOnYearProduction: (resName: Resource) => number;

  /**
   * Determine how much of the given resource is produced per tick.
   *
   * @param resName The resource to check.
   * @param withConversion Should resource convertions be taken into account?
   */
  getResourcePerTick: (resName: Resource, withConversion: boolean) => number;

  /**
   * Determine how much of the resource, per tick, is subject to be converted
   * into another resource. For example, smelters convert wood and minerals.
   *
   * @param resName The resource to check.
   */
  getResourcePerTickConvertion: (resName: Resource) => number;

  /**
   * How many ticks pass per second.
   * Subject to time acceleration.
   */
  getTicksPerSecondUI: () => number;

  /**
   * Calculate unlimited diminishing returns.
   */
  getUnlimitedDR: (value: number, stripe: number) => number;

  /**
   * Are we in iron will mode?
   */
  ironWill: boolean;
  managers: Array<{
    load: (saveData: Record<string, unknown>) => void;
    save: (saveData: Record<string, unknown>) => void;
  }>;
  msg: (...args: Array<number | string>) => { span: HTMLElement };
  opts: {
    disableCMBR: boolean;
    /**
     * Should `confirm()` calls be skipped in the game?
     */
    noConfirm: boolean;
    usePerSecondValues: boolean;
  };
  prestige: {
    /**
     * The production modifier from burned paragon only.
     */
    getBurnedParagonRatio: () => number;

    /**
     * The production modifier produced by paragon and burned paragon.
     */
    getParagonProductionRatio: () => number;

    getPerk: (name: "carnivals" | "numeromancy" | "unicornmancy") => { researched: boolean };
    meta: Array<{ meta: Array<{ researched: boolean }> }>;
  };
  religion: {
    faith: number;
    faithRatio: number;

    /**
     * The modifier applied to faith generation.
     */
    getApocryphaBonus: () => number;

    /**
     * @deprecated No longer exists. Use `getApocryphaBonus()`
     */
    getFaithBonus: () => number;

    /**
     * Get religion upgrades.
     */
    getRU: (name: ReligionUpgrade) => ReligionUpgradeInfo | undefined;

    /**
     * The modifier produced from collected faith.
     * Subject to challenges.
     */
    getSolarRevolutionRatio: () => number;

    /**
     * Get transcendence upgrades.
     */
    getTU: (name: TranscendenceUpgrade) => TranscendenceUpgradeInfo | undefined;

    /**
     * Get ziggurath upgrades.
     */
    getZU: (name: ZiggurathUpgrade) => ZiggurathUpgradeInfo | undefined;

    meta: Array<{
      meta: Array<ReligionUpgradeInfo | ZiggurathUpgradeInfo | TranscendenceUpgradeInfo>;
      provider: { getEffect: (bld: unknown, effect: unknown) => unknown };
    }>;

    pactsManager: {
      necrocornDeficit: number;
    };

    praise: () => void;

    religionUpgrades: Array<ReligionUpgradeInfo>;
    tcratio: number;
    transcendenceTier: number;
    transcendenceUpgrades: Array<TranscendenceUpgradeInfo>;
    zigguratUpgrades: Array<ZiggurathUpgradeInfo>;

    /**
     * Determine the price (worship) to reach the given transcendence tier.
     */
    _getTranscendTotalPrice: (tier: number) => number;

    /**
     * Reset faith and increase praise bonus according to transcendence tier.
     */
    _resetFaithInternal: (bonusRatio: number) => void;
  };
  religionTab: ReligionTab;
  resetAutomatic: () => void;
  resPool: {
    get: (name: Resource) => ResourceInfo;
    energyCons: number;
    energyProd: number;
    resources: Array<ResourceInfo>;
    hasRes: (resources: Array<Price>) => boolean;
  };
  /**
   * Saves the game and returns the save game.
   */
  save(): KGSaveData;
  /**
   * Import a savegame blob.
   */
  saveImportDropboxText(lzdata: string, callback: (error?: Error) => unknown): void;
  science: {
    get: (name: Technology) => TechnologyInfo;
    getPolicy: (name: Policy) => PolicyInfo;
    policies: Array<PolicyInfo>;
    techs: Array<TechnologyInfo>;
  };
  server: Server;
  space: {
    getBuilding: (building: SpaceBuilding) => {
      calculateEffects: (self: unknown, game: Game) => void;
      /**
       * An internationalized description for this space building.
       */
      description: string;

      effects: Partial<BuildingEffects>;

      /**
       * An internationalized label for this space building.
       */
      label: string;
      name: SpaceBuilding;
      priceRatio: number;
      prices: Array<Price>;
      requiredTech: Array<"sattelites">;
      unlocked: boolean;
      unlocks: { policies: Array<"militarizeSpace" | "outerSpaceTreaty"> };
      unlockScheme: {
        name: "space";
        threshold: number;
      };
      upgrades: {
        buildings: Array<"observatory">;
      };
      val: number;
    };
    meta: Array<{
      meta: Array<{
        effects?: Partial<BuildingEffects>;
        label: string;
        name: string;
        on: number;
        prices: Array<Price>;
        unlocked: boolean;
        val: number;
      }>;
    }>;
    planets: Array<{ label: string; buildings: Array<{ name: SpaceBuilding; label: string }> }>;
    programs: Array<{ name: Mission; label: string }>;
  };
  stats: {
    statGroups: Array<{
      title: string;
      group: Array<{
        name:
          | "averageKittens"
          | "buildingsConstructed"
          | "eventsObserved"
          | "kittensDead"
          | "timePlayed"
          | "totalChallengesCompleted"
          | "totalClicks"
          | "totalCrafts"
          | "totalKittens"
          | "totalParagon"
          | "totalResets"
          | "totalTrades"
          | "totalYears"
          | "transcendenceTier"
          | "unicornsSacrificed";
        title: string;
        val: number;
        unlocked: boolean;
        defaultUnlocked: boolean;
      }>;
    }>;
  };
  tabs: [
    GameTab,
    VillageTab,
    GameTab,
    GameTab,
    TradeTab,
    ReligionTab,
    SpaceTab,
    TimeTab,
    GameTab,
    GameTab,
    GameTab,
  ];
  telemetry: {
    buildRevision: number;
    guid: string;
    version: string;
  };
  ticksPerSecond: number;
  time: {
    chronoforgeUpgrades: Array<ChronoForgeUpgradeInfo>;
    /**
     * Get ChronoForge upgrade.
     */
    getCFU: (name: ChronoForgeUpgrade) => ChronoForgeUpgradeInfo;
    /**
     * Get Void Space upgrade.
     */
    getVSU: (name: VoidSpaceUpgrade) => VoidSpaceUpgradeInfo;
    heat: number;
    isAccelerated: boolean;
    meta: Array<{
      meta: Array<ChronoForgeUpgradeInfo | VoidSpaceUpgradeInfo>;
      provider: { getEffect: (item: unknown, effect: unknown) => unknown };
    }>;
    voidspaceUpgrades: Array<{
      name: Exclude<VoidSpaceUpgrade, "usedCryochambers">;
      label: string;
    }>;
  };
  timeAccelerationRatio: () => number;
  timer: {
    ticksTotal: number;
  };
  timeTab: TimeTab;
  unlock: (value: unknown) => void;
  upgrade: (value: unknown) => void;
  ui: {
    activeTabId: TabId;
    confirm: (
      title: string,
      message: string,
      callbackOk: () => void,
      callbackCancel: () => void,
    ) => void;
    render: () => void;
  };
  village: {
    assignJob: (job: unknown, count: number) => void;
    getEffectLeader: <TDefaultObject>(
      role: "manager" | "scientist",
      defaultObject: TDefaultObject,
    ) => TDefaultObject;
    getFreeKittens: () => number;
    getJob: (name: string) => unknown;
    getJobLimit: (name: string) => number;
    /**
     * Get a list of resource consumptions per tick
     *
     * @see getResProduction
     */
    getResConsumption: () => { catnip: number };
    /**
     * Get a list of resource modifiers per tick
     * This method returns positive villager production that can be multiplied by building bonuses
     */
    getResProduction: () => { catnip: number };
    happiness: number;
    huntAll: () => void;
    jobs: Array<JobInfo>;
    leader: Kitten | null;
    /**
     * @deprecated
     */
    map: {
      expeditionNode: {
        x: number;
        y: number;
      };
      explore: (x: number, y: number) => void;
      toLevel: (x: number, y: number) => number;
      getExplorationPrice: (x: number, y: number) => number;
      villageData: Record<string, unknown>;
    };
    promoteKittens(): void;
    sim: {
      goldToPromote: (rank: number, value0: number, value1: number) => Array<unknown>;
      kittens: Array<Kitten>;
      promote: (leader: unknown, rank: number) => number;
    };
  };
  villageTab: VillageTab;
  workshop: {
    crafts: Array<CraftableInfo>;
    get: (
      technology: "chronoforge" | "cryocomputing" | "goldOre" | "machineLearning" | "uplink",
    ) => { researched: boolean };
    getCraft: (name: ResourceCraftable) => CraftableInfo | undefined;
    getCraftPrice: (craft: CraftableInfo) => Array<Price>;
    upgrades: Array<UpgradeInfo>;
  };
  workshopTab: WorkshopTab;
};
