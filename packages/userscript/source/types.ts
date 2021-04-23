import { SpaceItem } from "./Options";

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
  | "necrocorn"
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
  | "tears"
  | "temporalFlux"
  | "thorium"
  | "timeCrystal"
  | "titanium"
  | "unicorns"
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
    _transform: (model: unknown, value: unknown) => void;
    doShatterAmt: (model: unknown, willSkip: boolean) => void; // Shatter TC button
    sellInternal: (model: unknown, count: number) => void; // Sell button
  };
  domNode: HTMLDivElement;
  id: string;
  model: {
    enabled: boolean;
    metadata: { name: string };
    name: string;
    prices: Array<{ name: "tears" | "unicorns"; val: number }>;
    visible: boolean;
  };
};

export type GameTab = {
  buttons: Array<BuildButton>;
  censusPanel?: BuildButton; // Probably village tab specific.
  cfPanel?: BuildButton; // Chronoforge?
  children: Array<BuildButton>;
  GCPanel?: BuildButton; // Something in space
  planetPanels?: Array<BuildButton>; // Probably space tab specific
  racePanels?: Array<{
    race: {
      name: string;
    };
    tradeBtn: BuildButton;
  }>; // Probably trading tab specific
  render: () => void;
  rUpgradeButtons?: Array<BuildButton>;
  tabId: TabId;
  visible: boolean;
  vsPanel?: BuildButton;
  zgUpgradeButtons?: Array<BuildButton>;
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
export type ReligionUpgrades =
  | "apocripha"
  | "basilica"
  | "goldenSpire"
  | "scholasticism"
  | "solarchant"
  | "solarRevolution"
  | "stainedGlass"
  | "sunAltar"
  | "templars"
  | "transcendence";
export type TranscendenceUpgrades =
  | "blackCore"
  | "blackLibrary"
  | "blackNexus"
  | "blackObelisk"
  | "blackRadiance"
  | "blazar"
  | "darkNova"
  | "holyGenocide"
  | "singularity";
export type ZiggurathUpgrades =
  | "blackPyramid"
  | "ivoryCitadel"
  | "ivoryTower"
  | "marker"
  | "skyPalace"
  | "sunspire"
  | "unicornGraveyard"
  | "unicornNecropolis"
  | "unicornTomb"
  | "unicornUtopia";

export type AbstractReligionUpgradeInfo = {
  /**
   * An internationalized label for this space building.
   */
  label: string;
};

export type ReligionUpgradeInfo = AbstractReligionUpgradeInfo & {
  calculateEffects: (self: unknown, game: GamePage) => void;
  /**
   * An internationalized description for this space building.
   */
  description: string;

  effects: {
    faithRatioReligion?: number;
  };

  faith: number;

  name: ReligionUpgrades;
  noStackable: boolean;
  priceRatio: number;
};

export type ZiggurathUpgradeInfo = AbstractReligionUpgradeInfo & {
  calculateEffects: (self: unknown, game: GamePage) => void;
  defaultUnlocked: boolean;

  /**
   * An internationalized description for this space building.
   */
  description: string;

  effects: {
    unicornsRatioReligion?: number;
  };

  name: ZiggurathUpgrades;
  priceRatio: number;
  prices: Array<{ name: Resource; val: number }>;
  unlocked: boolean;
  unlocks: {
    zigguratUpgrades: Array<"ivoryTower">;
  };
};

export type TranscendenceUpgradeInfo = AbstractReligionUpgradeInfo & {
  calculateEffects: (self: unknown, game: GamePage) => void;

  /**
   * An internationalized description for this space building.
   */
  description: string;

  effects: {
    solarRevolutionLimit?: number;
  };

  flavor: string;

  name: TranscendenceUpgrades;
  priceRatio: number;
  prices: Array<{ name: Resource; val: number }>;
  tier: number;
  unlocked: boolean;
  unlocks: {
    zigguratUpgrades: Array<"ivoryTower">;
  };
};

export type GamePage = {
  bld: {
    get: (build: "aiCore" | "biolab" | "steamworks") => unknown;
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
    getCurSeason: () => { modifiers: { catnip: number }; name: string };
    getWeatherMod: () => number;
    season: number;
    year: number;
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
    getRU: (name: ReligionUpgrades) => ReligionUpgradeInfo;

    getSolarRevolutionRatio: () => number;

    /**
     * Get transcendence upgrades.
     */
    getTU: (name: TranscendenceUpgrades) => TranscendenceUpgradeInfo;

    /**
     * Get ziggurath upgrades.
     */
    getZU: (name: ZiggurathUpgrades) => ZiggurathUpgradeInfo;

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
    get: (name: "civil" | "cryptotheology" | "drama" | "nuclearFission") => { researched: boolean };
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
      prices: Array<{ name: Resource; val: number }>;
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
    getEffectLeader: (role: "manager" | "scientist", value: number) => number;
    getFreeKittens: () => number;
    getJob: (name: string) => unknown;
    getJobLimit: (name: string) => number;
    getResConsumption: () => { catnip: number };
    getResProduction: () => { catnip: number };
    happiness: number;
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
  workshop: {
    get: (
      technology: "chronoforge" | "cryocomputing" | "goldOre" | "machineLearning" | "uplink"
    ) => { researched: boolean };
    getCraft: (name: string) => { name: string; unlocked: boolean } | undefined;
    getCraftPrice: (craft: unknown) => Array<{ name: Resource; val: number }>;
  };
};
