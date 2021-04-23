import { SpaceItems } from "./Options";

export type Resource =
  | "alloy"
  | "beam"
  | "blackcoin"
  | "bloodstone"
  | "blueprint"
  | "catnip"
  | "compedium"
  | "concrate"
  | "culture"
  | "eludium"
  | "gear"
  | "gold"
  | "iron"
  | "kerosene"
  | "manpower"
  | "manuscript"
  | "megalith"
  | "parchment"
  | "plate"
  | "relic"
  | "scaffold"
  | "science"
  | "ship"
  | "slab"
  | "slabs" // deprecated: Use `slab` instead
  | "steel"
  | "tanker"
  | "temporalFlux"
  | "thorium"
  | "timeCrystal"
  | "titanium"
  | "uranium"
  | "wood";

export type TabId =
  | "Bonfire"
  | "Religion"
  | "Science"
  | "Space"
  | "Time"
  | "Trade"
  | "Village"
  | "Workshop";

/**
 * Not necessarily a button, but a KG UI element.
 */
export type BuildButton = {
  children: Array<BuildButton>;
  controller: {
    doShatterAmt: (model: unknown, willSkip: boolean) => void; // Shatter TC button
    sellInternal: (model: unknown, count: number) => void; // Sell button
  };
  domNode: HTMLDivElement;
  id: string;
  model: {
    enabled: boolean;
    metadata: unknown;
    name: string;
    prices: Array<{ name: "tears" | "unicorns"; val: number }>;
    visible: boolean;
  };
};

export type GameTab = {
  buttons: Array<BuildButton>;
  censusPanel: BuildButton; // Probably village tab specific.
  children: Array<BuildButton>;
  planetPanels: Array<BuildButton>; // Probably space tab specific
  racePanels: Array<{
    race: {
      name: string;
    };
    tradeBtn: BuildButton;
  }>; // Probably trading tab specific
  render: () => void;
  rUpgradeButtons: Array<BuildButton>;
  tabId: TabId;
  visible: boolean;
  zgUpgradeButtons: Array<BuildButton>;
};

/**
 * The type names of all supported buildings.
 */
export type Building =
  | "academy"
  | "accelerator"
  | "aiCore"
  | "amphitheatre"
  | "aqueduct"
  | "barn"
  | "biolab"
  | "brewery"
  | "broadcastTower"
  | "calciner"
  | "chapel"
  | "chronosphere"
  | "dataCenter"
  | "factory"
  | "field"
  | "harbor"
  | "hut"
  | "hydroPlant"
  | "library"
  | "logHouse"
  | "lumberMill"
  | "magneto"
  | "mansion"
  | "mine"
  | "mint"
  | "observatory"
  | "oilWell"
  | "pasture"
  | "quarry"
  | "reactor"
  | "smelter"
  | "solarFarm"
  | "steamworks"
  | "temple"
  | "tradepost"
  | "unicornPasture"
  | "warehouse"
  | "workshop"
  | "zebraForge"
  | "zebraOutpost"
  | "zebraWorkshop"
  | "ziggurat";

export type BuildingExt = {
  meta: {
    effects: { unicornsPerTickBase: number };
    label: string;
    on: number;
    stage: number;
    stages: Array<{ label: string; prices: Array<unknown>; stageUnlocked: boolean }>;
    val: number;
  };
};

export type Race =
  | "dragons"
  | "griffins"
  | "nagas"
  | "leviathans"
  | "lizards"
  | "sharks"
  | "spiders"
  | "zebras";
export type RaceInfo = {
  buys: Array<{ name: Resource; val: number }>;
  embassyLevel: number;
  embassyPrices: unknown;
  energy: number;
  name: Race;
  sells: Array<{ chance: number; name: Resource; seasons: Record<string, number>; value: number }>;
  standing: number;
  unlocked: boolean;
};

export type Challenge = "1000Years" | "anarchy" | "atheism" | "energy" | "winterIsComing";

export type GamePage = {
  bld: {
    get: (build: "aiCore" | "biolab" | "steamworks") => unknown;
    getBuildingExt: (building: Building) => BuildingExt;
  };
  calendar: {
    cycle: number;
    cycleEffectsFestival: (options: { catnip: number }) => { catnip: number };
    cycles: Array<{ festivalEffects: { unicorns: number } }>;
    cyclesPerEra: number;
    cycleYear: number;
    day: number;
    festivalDays: unknown;
    getCurSeason: () => { modifiers: { catnip: number }; name: string };
    getWeatherMod: () => number;
    season: number;
    yearsPerCycle: number;
  };
  challenges: {
    currentChallenge: Challenge;
    getChallenge: (challenge: Challenge) => { researched: number };
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
    sellBcoin: () => void;
    /**
     * @deprecated Use `sellBcoin` instead.
     */
    sellEcoin: () => void;
    unlockRandomRace: () => { title: string };
  };
  diplomacyTab: GameTab;
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
    getPerk: (name: "numeromancy" | "unicornmancy") => { researched: boolean };
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
    getRU: (name: string) => unknown;

    getSolarRevolutionRatio: () => number;

    /**
     * Get transcendence upgrades.
     */
    getTU: (name: string) => unknown;

    /**
     * Get ziggurath upgrades.
     */
    getZU: (name: string) => unknown;

    transcendenceTier: number;

    _resetFaithInternal: (value: number) => void;
  };
  resetAutomatic: () => void;
  resPool: {
    get: (
      name: Resource
    ) =>
      | {
          craftable: boolean;
          maxValue: number;
          name: string;
          title: string;
          unlocked: boolean;
          value: number;
        }
      | undefined;
    energyCons: number;
    energyProd: number;
    resources: Array<{ value: number }>;
  };
  science: {
    get: (name: "civil" | "cryptotheology" | "nuclearFission") => { researched: boolean };
  };
  space: {
    getBuilding: (building: SpaceItems) => { label: string; unlocked: boolean; val: number };
    meta: Array<{ meta: unknown }>;
  };
  tabs: Array<GameTab>;
  time: {
    getCFU: (name: string) => unknown;
    getVSU: (name: "usedCryochambers") => { val: number };
    heat: number;
    isAccelerated: boolean;
  };
  timer: {
    ticksTotal: number;
  };
  timeTab: {
    cfPanel: BuildButton;
  };
  unlock: (value: unknown) => void;
  upgrade: (value: unknown) => void;
  ui: {
    activeTabId: TabId;
    render: () => void;
  };
  village: {
    assignJob: (job: unknown, count: number) => void;
    getEffectLeader: (role: "manager", value: number) => number;
    getFreeKittens: () => number;
    getJob: (name: string) => unknown;
    getJobLimit: (name: string) => number;
    getResConsumption: () => { catnip: number };
    getResProduction: () => { catnip: number };
    happiness: number;
    jobs: Array<{ name: string; unlocked: boolean; value: number }>;
    leader: unknown;
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
  workshop: {
    get: (
      technology: "chronoforge" | "cryocomputing" | "goldOre" | "machineLearning" | "uplink"
    ) => { researched: boolean };
    getCraft: (name: string) => { name: string; unlocked: boolean } | undefined;
    getCraftPrice: (craft: unknown) => Array<{ name: Resource; val: number }>;
  };
};
