import {
  BuildButton,
  Building,
  BuildingExt,
  BuildingInfo,
  Challenge,
  GameTab,
  Price,
  Race,
  RaceInfo,
  ReligionUpgradeInfo,
  ReligionUpgrades,
  Resource,
  Season,
  TabId,
  TranscendenceUpgradeInfo,
  TranscendenceUpgrades,
  ZiggurathUpgradeInfo,
  ZiggurathUpgrades,
} from ".";
import { SpaceItem } from "../Options";
import { ReligionTab } from "./religion";
import { SpaceTab } from "./space";
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
    get: (build: Building) => BuildingInfo;
    getBuildingExt: (building: Building) => BuildingExt;
  };
  calendar: {
    cryptoPrice: number;
    cycle: number;
    cycleEffectsFestival: (options: { catnip: number }) => { catnip: number };
    cycles: Array<{ festivalEffects: { unicorns: number } }>;
    cyclesPerEra: number;
    cycleYear: number;
    day: number;
    festivalDays: number;
    getCurSeason: () => { modifiers: { catnip: number }; name: Season };
    getWeatherMod: () => number;
    observeBtn: BuildButton | null;
    observeHandler: () => void;
    season: number;
    year: number;
    yearsPerCycle: number;
  };
  challenges: {
    currentChallenge: Challenge;
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
  getLimitedDR: (value0: number, value1: number) => number;
  getResCraftRatio: (name: string) => number;
  getResourcePerTick: (name: string, value: boolean) => number;
  getResourcePerTickConvertion: (name: "catnip") => number;
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
    get: (
      name: Resource
    ) =>
      | {
          craftable: boolean;
          maxValue: number;
          name: Resource;
          title: string;
          unlocked: boolean;
          value: number;
        }
      | undefined;
    energyCons: number;
    energyProd: number;
    resources: Array<{
      craftable: boolean;
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
    techs: unknown;
  };
  space: {
    getBuilding: (
      building: SpaceItem
    ) => {
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
      name: string;
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
    meta: Array<{ meta: unknown }>;
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
    getCFU: (name: ChronoForgeUpgrades) => ChronoForgeUpgradeInfo | undefined;
    getVSU: (name: VoidSpaceUpgrades) => VoidSpaceUpgradeInfo | undefined;
    heat: number;
    isAccelerated: boolean;
  };
  timer: {
    ticksTotal: number;
  };
  timeTab: {
    cfPanel: BuildButton;
    visible: boolean;
  };
  unlock: (value: unknown) => void;
  upgrade: (value: unknown) => void;
  ui: {
    activeTabId: TabId;
    render: () => void;
  };
  village: {
    assignJob: (job: unknown, count: number) => void;
    getEffectLeader: (role: "manager" | "scientist", value: number) => number;
    getFreeKittens: () => number;
    getJob: (name: string) => unknown;
    getJobLimit: (name: string) => number;
    getResConsumption: () => { catnip: number };
    getResProduction: () => { catnip: number };
    happiness: number;
    huntAll: () => void;
    jobs: Array<{ name: string; unlocked: boolean; value: number }>;
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
    getCraft: (name: string) => { name: string; unlocked: boolean } | undefined;
    getCraftPrice: (craft: unknown) => Array<Price>;
    upgrades: unknown;
  };
};
