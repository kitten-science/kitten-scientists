export type TabId = "Religion" | "Village";
export type GameTab = {
  render: () => void;
  tabId: TabId;
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
    getSolarRevolutionRatio: () => number;
  };
  resPool: {
    get: (name: string) => { title: string };
  };
  space: {
    getBuilding: (building: "hydroponics") => { val: number };
  };
  tabs: Array<GameTab>;
  time: {
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
    getCraft: (name: string) => unknown;
    getCraftPrice: (craft: unknown) => Array<{ name: string; val: number }>;
  };
};
