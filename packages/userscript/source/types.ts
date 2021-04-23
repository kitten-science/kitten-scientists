export type CraftItems =
  | "alloy"
  | "beam"
  | "blueprint"
  | "catnip"
  | "compedium"
  | "concrate"
  | "culture"
  | "eludium"
  | "gear"
  | "iron"
  | "kerosene"
  | "manuscript"
  | "megalith"
  | "parchment"
  | "plate"
  | "scaffold"
  | "ship"
  | "slab"
  | "steel"
  | "tanker"
  | "thorium"
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

export type BuildButton = {
  children: Array<BuildButton>;
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
  children: Array<BuildButton>;
  render: () => void;
  rUpgradeButtons: Array<BuildButton>;
  tabId: TabId;
  zgUpgradeButtons: Array<BuildButton>;
};

export type Building = "aqueduct" | "chronosphere" | "pasture" | "unicornPasture" | "ziggurat";
export type BuildingExt = {
  meta: {
    effects: { unicornsPerTickBase: number };
    label: string;
    on: number;
    stage: number;
    stages: Array<{ label: string }>;
    val: number;
  };
};

export type GamePage = {
  bld: {
    get: (build: "steamworks") => unknown;
    getBuildingExt: (building: Building) => BuildingExt;
  };
  calendar: {
    cycle: number;
    cycleEffectsFestival: (options: { catnip: number }) => { catnip: number };
    cycles: Array<{ festivalEffects: { unicorns: number } }>;
    festivalDays: unknown;
    getCurSeason: () => { modifiers: { catnip: number } };
    getWeatherMod: () => number;
  };
  challenges: {
    currentChallenge: "anarchy" | "winterIsComing";
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
    feedElders: () => void;
    get: (race: "leviathans") => unknown;
    getMarkerCap: () => number;
    sellBcoin: () => void;
    /**
     * @deprecated Use `sellBcoin` instead.
     */
    sellEcoin: () => void;
  };
  getCMBRBonus: () => number;
  getDisplayValueExt: (value: number) => string;
  getEffect: (
    effect:
      | "catnipDemandWorkerRatioGlobal"
      | "catnipJobRatio"
      | "catnipPerTickBase"
      | "corruptionBoostRatio"
      | "hunterRatio"
      | "mapPriceReduction"
      | "oilReductionRatio"
      | "priceRatio"
      | "riftChance"
      | "tradeCatpowerDiscount"
      | "tradeGoldDiscount"
      | "unicornsGlobalRatio"
      | "unicornsPerTickBase"
      | "unicornsRatioReligion"
  ) => number;
  getLimitedDR: (value0: number, value1: number) => number;
  getResCraftRatio: (name: string) => number;
  getResourcePerTick: (name: string, value: boolean) => number;
  getResourcePerTickConvertion: (name: "catnip") => number;
  getTicksPerSecondUI: () => number;
  ironWill: boolean;
  msg: (...args: Array<string>) => { span: HTMLElement };
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
    getRU: (name: string) => unknown;
    getSolarRevolutionRatio: () => number;
    getTU: (name: string) => unknown;
    getZU: (name: string) => unknown;
  };
  resPool: {
    get: (
      name: "blackcoin" | "relic"
    ) =>
      | { craftable: boolean; maxValue: number; name: string; title: string; value: number }
      | undefined;
    resources: Array<{ value: number }>;
  };
  space: {
    getBuilding: (building: "hydroponics") => { val: number };
  };
  tabs: Array<GameTab>;
  time: {
    getCFU: (name: string) => unknown;
    getVSU: (name: "usedCryochambers") => { val: number };
  };
  timer: {
    ticksTotal: number;
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
      kittens: Array<unknown>;
    };
  };
  workshop: {
    get: (technology: "goldOre") => { researched: boolean };
    getCraft: (name: string) => { name: string; unlocked: boolean };
    getCraftPrice: (craft: unknown) => Array<{ name: CraftItems; val: number }>;
  };
};
