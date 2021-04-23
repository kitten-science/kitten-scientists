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

/**
 * A combination of a resource and an amount.
 */
export type Price = { name: Resource; val: number };

/**
 * Not necessarily a button, but a KG UI element.
 */
export type BuildButton<T = string> = {
  children: Array<BuildButton>;
  controller: {
    _transform: (model: unknown, value: unknown) => void;
    doFixCryochamber: (model: unknown) => boolean; // Fix broken cryochambers
    doShatterAmt: (model: unknown, willSkip: boolean) => void; // Shatter TC button
    onAll: (model: unknown) => void; // Turn on all (steamworks)
    sellInternal: (model: unknown, count: number) => void; // Sell button
  };
  domNode: HTMLDivElement;
  id: T;
  model: {
    enabled: boolean;
    metadata: { name: string };
    name: string;
    prices: Array<Price>;
    visible: boolean;
  };
};

export type GameTab = {
  buttons: Array<BuildButton>;
  censusPanel?: BuildButton; // Probably village tab specific.
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
  | "dataCenter"
  | "factory"
  | "field"
  | "harbor"
  | "hut"
  | "hydroPlant"
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
  | "observatory"
  | "oilWell"
  | "pasture"
  | "quarry"
  | "reactor"
  | "skyPalace"
  | "smelter"
  | "solarFarm"
  | "steamworks"
  | "sunspire"
  | "temple"
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
    effects: { unicornsPerTickBase: number };
    label: string;
    on: number;
    stage: number;
    stages: Array<{ label: string; prices: Array<unknown>; stageUnlocked: boolean }>;
    val: number;
  };
};

export type Challenge = "1000Years" | "anarchy" | "atheism" | "energy" | "winterIsComing";

export * from "./gamePage";
export * from "./religion";
export * from "./space";
export * from "./time";
export * from "./trading";
