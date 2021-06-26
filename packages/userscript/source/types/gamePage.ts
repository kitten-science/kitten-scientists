import {
  AllBuildings,
  BuildButton,
  Building,
  BuildingExt,
  BuildingMeta,
  Challenge,
  GameTab,
  Jobs,
  Price,
  Race,
  RaceInfo,
  ReligionUpgradeInfo,
  ReligionUpgrades,
  Resource,
  ResourceCraftable,
  Season,
  TabId,
  TranscendenceUpgradeInfo,
  TranscendenceUpgrades,
  ZiggurathUpgradeInfo,
  ZiggurathUpgrades,
} from ".";
import { CycleIndices } from "../options/TimeControlSettings";
import { CraftableInfo, ResourceInfo } from "./craft";
import { ReligionTab } from "./religion";
import { SpaceBuildings, SpaceTab } from "./space";
import {
  ChronoForgeUpgradeInfo,
  ChronoForgeUpgrades,
  TimeTab,
  VoidSpaceUpgradeInfo,
  VoidSpaceUpgrades,
} from "./time";
import { TradingTab } from "./trading";
import { VillageTab } from "./village";

export type GamePage = {
  bld: {
    /** @deprecated Use `getBuildingExt()` instead. */
    get: (build: Building) => BuildingMeta;
    getBuildingExt: (building: Building) => BuildingExt;
  };
  calendar: {
    cryptoPrice: number;
    cycle: CycleIndices;
    cycleEffectsFestival: (options: { catnip: number }) => { catnip: number };
    cycles: Array<{ festivalEffects: { unicorns: number }; title: string }>;
    cyclesPerEra: number;
    cycleYear: number;
    day: number;
    festivalDays: number;
    getCurSeason: () => { modifiers: { catnip: number }; name: Season };
    /**
     * Get the production modifier contribution of the weather for certain resource.
     */
    getWeatherMod: (res: Resource) => number;
    observeBtn: BuildButton | null;
    observeHandler: () => void;
    season: number;
    seasons: Array<{ name: Season }>;
    year: number;
    yearsPerCycle: number;
  };
  challenges: {
    currentChallenge: Challenge;
    challenges: Array<{ pending: boolean }>;
    getChallenge: (
      challenge: Challenge
    ) =>
      | { calculateEffects: (model: unknown, game: GamePage) => void; researched: number }
      | undefined;
  };
  console: {
    maxMessages: number;
  };
  craft: (name: string, amount: number) => void;
  devMode: boolean;
  diplomacy: {
    buyBcoin: () => void;
    /**
     * @deprecated Use `buyBcoin` instead.
     */
    buyEcoin: () => void;
    calculateStandingFromPolicies: (race: Race, host: GamePage) => number;
    feedElders: () => void;
    get: (race: Race) => RaceInfo;
    getMarkerCap: () => number;
    calculateTradeBonusFromPolicies: (race: Race, host: GamePage) => number;
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
  diplomacyTab: TradingTab;
  getCMBRBonus: () => number;
  getDisplayValueExt: (value: number) => string;
  getEffect: (
    effect:
      | `${AllBuildings}CostReduction`
      | `${Resource}CostReduction`
      | `${AllBuildings}PriceRatio`
      | "catnipDemandWorkerRatioGlobal"
      | "catnipJobRatio"
      | "catnipPerTickBase"
      | "corruptionBoostRatio"
      | "dataCenterAIRatio"
      | "heatMax"
      | "hunterRatio"
      | "mapPriceReduction"
      | "oilReductionRatio"
      | "priceRatio"
      | "riftChance"
      | "solarRevolutionLimit"
      | "standingRatio"
      | "tradeCatpowerDiscount"
      | "tradeGoldDiscount"
      | "unicornsGlobalRatio"
      | "unicornsPerTickBase"
      | "unicornsRatioReligion"
      | "uplinkDCRatio"
  ) => number;
  /**
   * Calculate diminishing returns.
   */
  getLimitedDR: (effect: number, limit: number) => number;

  /**
   * The resource craft ratio indicates how many items you receive
   * as the result of a single craft. This is subject to a variety
   * of bonus effects.
   * @param name The resource to check.
   */
  getResCraftRatio: (name: ResourceCraftable) => number;

  /**
   * Determine how much of the given resource is produced per tick.
   * @param resName The resource to check.
   * @param withConversion Should resource convertions be taken into account?
   */
  getResourcePerTick: (resName: Resource, withConversion: boolean) => number;

  /**
   * Determine how much of the resource, per tick, is subject to be converted
   * into another resource. For example, smelters convert wood and minerals.
   * @param resName The resource to check.
   */
  getResourcePerTickConvertion: (resName: Resource) => number;

  getTicksPerSecondUI: () => number;
  getUnlimitedDR: (value0: number, value1: number) => number;
  ironWill: boolean;
  msg: (...args: Array<number | string>) => { span: HTMLElement };
  opts: {
    disableCMBR: boolean;
  };
  prestige: {
    getBurnedParagonRatio: () => number;
    getParagonProductionRatio: () => number;
    getPerk: (name: "carnivals" | "numeromancy" | "unicornmancy") => { researched: boolean };
    meta: Array<{ meta: Array<{ researched: boolean }> }>;
  };
  religion: {
    faith: number;
    faithRatio: number;

    getApocryphaBonus: () => number;
    getFaithBonus: () => number;

    /**
     * Get religion upgrades.
     */
    getRU: (name: ReligionUpgrades) => ReligionUpgradeInfo | undefined;

    getSolarRevolutionRatio: () => number;

    /**
     * Get transcendence upgrades.
     */
    getTU: (name: TranscendenceUpgrades) => TranscendenceUpgradeInfo | undefined;

    /**
     * Get ziggurath upgrades.
     */
    getZU: (name: ZiggurathUpgrades) => ZiggurathUpgradeInfo | undefined;

    praise: () => void;

    tcratio: number;
    transcendenceTier: number;

    _getTranscendTotalPrice: (value: number) => number;
    _resetFaithInternal: (value: number) => void;
  };
  religionTab: {
    sacrificeBtn: BuildButton;
  };
  resetAutomatic: () => void;
  resPool: {
    get: (name: Resource) => ResourceInfo;
    energyCons: number;
    energyProd: number;
    resources: Array<{
      craftable: boolean;
      maxValue: number;
      name: Resource;
      title: string;
      type: "common" | "uncommon";
      value: number;
      visible: boolean;
    }>;
    hasRes: (resources: Array<Price>) => boolean;
  };
  science: {
    get: (name: "civil" | "cryptotheology" | "drama" | "nuclearFission") => { researched: boolean };
    techs: Array<{
      description: string;
      effectDesdc: string;
      flavor: string;
      label: string;
      name: string;
      prices: Array<Price>;
      researched: boolean;
      unlocked: boolean;
      unlocks: { upgrades: Array<unknown> };
    }>;
  };
  space: {
    getBuilding: (building: SpaceBuildings) => {
      calculateEffects: (self: unknown, game: GamePage) => void;
      /**
       * An internationalized description for this space building.
       */
      description: string;

      effects: {
        energyConsumption?: number;
        energyProduction?: number;
        observatoryRatio?: number;
        starchartPerTickBaseSpace?: number;
      };

      /**
       * An internationalized label for this space building.
       */
      label: string;
      name: SpaceBuildings;
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
    meta: Array<{ meta: Array<{ label: string; name: string; unlocked: boolean; val: number }> }>;
  };
  tabs: [
    GameTab,
    VillageTab,
    GameTab,
    GameTab,
    TradingTab,
    ReligionTab,
    SpaceTab,
    TimeTab,
    GameTab,
    GameTab,
    GameTab
  ];
  time: {
    /**
     * Get ChronoForge upgrade.
     */
    getCFU: (name: ChronoForgeUpgrades) => ChronoForgeUpgradeInfo | undefined;
    /**
     * Get Void Space upgrade.
     */
    getVSU: (name: VoidSpaceUpgrades) => VoidSpaceUpgradeInfo | undefined;
    heat: number;
    isAccelerated: boolean;
  };
  timer: {
    ticksTotal: number;
  };
  timeTab: TimeTab;
  unlock: (value: unknown) => void;
  upgrade: (value: unknown) => void;
  ui: {
    activeTabId: TabId;
    render: () => void;
  };
  village: {
    assignJob: (job: unknown, count: number) => void;
    getEffectLeader: <TDefaultObject>(
      role: "manager" | "scientist",
      defaultObject: TDefaultObject
    ) => TDefaultObject;
    getFreeKittens: () => number;
    getJob: (name: string) => unknown;
    getJobLimit: (name: string) => number;
    /**
     * Get a list of resource consumptions per tick
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
    jobs: Array<{ name: Jobs; unlocked: boolean; value: number }>;
    leader: { rank: number };
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
    sim: {
      goldToPromote: (rank: number, value0: number, value1: number) => Array<unknown>;
      kittens: Array<unknown>;
      promote: (leader: unknown, rank: number) => number;
    };
  };
  villageTab: VillageTab;
  workshop: {
    get: (
      technology: "chronoforge" | "cryocomputing" | "goldOre" | "machineLearning" | "uplink"
    ) => { researched: boolean };
    getCraft: (name: ResourceCraftable) => CraftableInfo | undefined;
    getCraftPrice: (craft: CraftableInfo) => Array<Price>;
    upgrades: Array<{
      description: string;
      effects: Record<string, number>;
      label: string;
      name: string;
      prices: Array<Price>;
      researched: boolean;
      unlocked: boolean;
      unlocks: { upgrades: Array<unknown> };
    }>;
  };
};
