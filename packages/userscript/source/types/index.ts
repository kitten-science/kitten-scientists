export type Season = "autumn" | "spring" | "summer" | "winter";
export type Resource =
  | "alloy"
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
  | "spice"
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
  render: () => void;
  tabId: TabId;
  visible: boolean;
  vsPanel?: BuildButton;
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

export type Challenge = "1000Years" | "anarchy" | "atheism" | "energy" | "winterIsComing";

export * from "./gamePage";
export * from "./religion";
export * from "./space";
export * from "./time";
export * from "./trading";
