export type CraftItems =
  | "alloy"
  | "beam"
  | "blueprint"
  | "catnip"
  | "compedium"
  | "concrate"
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

export type TabId = "Religion" | "Time" | "Village";

export type BuildButton = { model: { enabled: boolean; metadata: unknown; name: string } };

export type GameTab = {
  children: Array<{ children: Array<{ children: Array<BuildButton> }> }>;
  render: () => void;
  rUpgradeButtons: Array<BuildButton>;
  tabId: TabId;
  zgUpgradeButtons: Array<BuildButton>;
};

export type GamePage = {
  bld: {
    getBuildingExt: (
      building: "aqueduct" | "chronosphere" | "pasture" | "unicornPasture"
    ) => { meta: { stage: number; val: number } };
  };
  calendar: {
    cycle: number;
    cycleEffectsFestival: (options: { catnip: number }) => { catnip: number };
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
  getCMBRBonus: () => number;
  getDisplayValueExt: (value: number) => string;
  getEffect: (
    effect:
      | "catnipDemandWorkerRatioGlobal"
      | "catnipJobRatio"
      | "catnipPerTickBase"
      | "hunterRatio"
      | "mapPriceReduction"
      | "oilReductionRatio"
      | "priceRatio"
  ) => number;
  getLimitedDR: (value0: number, value1: number) => number;
  getResCraftRatio: (name: string) => number;
  getResourcePerTick: (name: string, value: boolean) => number;
  getResourcePerTickConvertion: (name: "catnip") => number;
  ironWill: boolean;
  msg: (...args: Array<string>) => { span: HTMLElement };
  opts: {
    disableCMBR: boolean;
  };
  prestige: {
    getBurnedParagonRatio: () => number;
    getParagonProductionRatio: () => number;
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
      name: string
    ) =>
      | { craftable: boolean; maxValue: number; name: string; title: string; value: number }
      | undefined;
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
  };
  village: {
    getEffectLeader: (role: "manager", value: number) => number;
    getFreeKittens: () => number;
    getResConsumption: () => { catnip: number };
    getResProduction: () => { catnip: number };
    happiness: number;
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
