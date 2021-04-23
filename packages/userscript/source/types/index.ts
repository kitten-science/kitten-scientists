import { GamePage } from "./gamePage";

export type Season = "autumn" | "spring" | "summer" | "winter";
export type Resource =
  | "alloy"
  | "antimatter"
  | "beam"
  | "blackcoin"
  | "bloodstone"
  | "blueprint"
  | "catnip"
  | "coal"
  | "compedium"
  | "concrate"
  | "culture"
  | "eludium"
  | "faith"
  | "furs"
  | "gear"
  | "gold"
  | "iron"
  | "ivory"
  | "karma"
  | "kerosene"
  | "manpower"
  | "manuscript"
  | "megalith"
  | "minerals"
  | "necrocorn"
  | "oil"
  | "paragon"
  | "parchment"
  | "plate"
  | "relic"
  | "scaffold"
  | "science"
  | "ship"
  | "slab"
  | "slabs" // deprecated: Use `slab` instead
  | "spice"
  | "steel"
  | "tanker"
  | "tears"
  | "temporalFlux"
  | "thorium"
  | "timeCrystal"
  | "titanium"
  | "unicorns"
  | "unobtainium"
  | "uranium"
  | "wood"
  | "zebras";

export type TabId =
  | "Bonfire"
  | "Religion"
  | "Science"
  | "Space"
  | "Time"
  | "Trade"
  | "Village"
  | "Workshop";

export type Jobs =
  | "engineer"
  | "farmer"
  | "geologist"
  | "hunter"
  | "miner"
  | "priest"
  | "scholar"
  | "woodcutter";

/**
 * A combination of a resource and an amount.
 */
export type Price = { name: Resource; val: number };

export type Panel = {
  children: Array<BuildButton>;
  visible: boolean;
};

/**
 * Not necessarily a button, but a KG UI element.
 */
export type BuildButton<T = string> = {
  children: Array<BuildButton>;
  controller: {
    _transform: (model: unknown, value: unknown) => void;
    getPrices: (model: unknown) => Array<Price>;
    hasResources: (model: unknown) => boolean; // Probably generic
    doFixCryochamber: (model: unknown) => boolean; // Fix broken cryochambers
    doShatterAmt: (model: unknown, willSkip: boolean) => void; // Shatter TC button
    incrementValue: (model: unknown) => void;
    onAll: (model: unknown) => void; // Turn on all (steamworks)
    payPrice: (model: unknown) => void;
    sellInternal: (model: unknown, count: number) => void; // Sell button
  };
  domNode: HTMLDivElement;
  id: T;
  model: {
    enabled: boolean;
    metadata: {
      breakIronWill: boolean;
      limitBuild?: number;
      name: string;
      unlocks: unknown;
      upgrades: unknown;
      val: number;
    };
    name: string;
    prices: Array<Price>;
    visible: boolean;
  };
  onClick: () => void;
};

export type GameTab = {
  buttons: Array<BuildButton>;
  children: Array<BuildButton>;
  render: () => void;
  tabId: TabId;
  visible: boolean;
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
  | "blackPyramid"
  | "brewery"
  | "broadcastTower"
  | "calciner"
  | "chapel"
  | "chronosphere"
  | "containmentChamber"
  | "cryostation"
  | "dataCenter"
  | "entangler"
  | "factory"
  | "field"
  | "harbor"
  | "heatsink"
  | "hrHarvester"
  | "hut"
  | "hydrofracturer"
  | "hydroPlant"
  | "hydroponics"
  | "ivoryCitadel"
  | "ivoryTower"
  | "library"
  | "logHouse"
  | "lumberMill"
  | "magneto"
  | "mansion"
  | "marker"
  | "mine"
  | "mint"
  | "moltenCore"
  | "moonBase"
  | "moonOutpost"
  | "observatory"
  | "oilWell"
  | "orbitalArray"
  | "pasture"
  | "planetCracker"
  | "quarry"
  | "reactor"
  | "researchVessel"
  | "sattelite"
  | "skyPalace"
  | "smelter"
  | "solarFarm"
  | "spaceBeacon"
  | "spaceElevator"
  | "spaceStation"
  | "spiceRefinery"
  | "steamworks"
  | "sunforge"
  | "sunlifter"
  | "sunspire"
  | "tectonic"
  | "temple"
  | "terraformingStation"
  | "tradepost"
  | "unicornGraveyard"
  | "unicornNecropolis"
  | "unicornPasture"
  | "unicornTomb"
  | "unicornUtopia"
  | "warehouse"
  | "workshop"
  | "zebraForge"
  | "zebraOutpost"
  | "zebraWorkshop"
  | "ziggurat";

export type BuildingInfo = {
  calculateEffects: (self: unknown, game: GamePage) => void;
  description: string;
  effects: Record<string, unknown>;
  flavor: string;
  isAutomationEnabled: boolean;
  jammed: boolean;
  label: string;
  name: Building;
  on: number;
  priceRatio: number;
  prices: Array<Price>;
  unlockable: boolean;
  unlocked: boolean;
  val: number;
};

export type BuildingExt = {
  meta: {
    calculateEffects: (model: unknown, game: GamePage) => void;
    effects: { unicornsPerTickBase: number };
    label: string;
    name: string;
    on: number;
    priceRatio: number;
    prices: Array<Price>;
    stage: number;
    stages: Array<{
      label: string;
      priceRatio: number;
      prices: Array<Price>;
      stageUnlocked: boolean;
    }>;
    unlocked: boolean;
    val: number;
  };
};

export type Challenge = "1000Years" | "anarchy" | "atheism" | "energy" | "winterIsComing";

export * from "./gamePage";
export * from "./religion";
export * from "./space";
export * from "./time";
export * from "./trading";
