import { Building } from "./buildings";
import { ReligionUpgrades, TranscendenceUpgrades, ZiggurathUpgrades } from "./religion";
import { SpaceBuildings } from "./space";
import { ChronoForgeUpgrades, VoidSpaceUpgrades } from "./time";

export type Season = "autumn" | "spring" | "summer" | "winter";
export type Cycle =
  | "charon"
  | "umbra"
  | "yarn"
  | "helios"
  | "cath"
  | "redmoon"
  | "dune"
  | "piscine"
  | "t-minus"
  | "kairo";

export type ResourceCraftable =
  | "alloy"
  | "beam"
  | "blueprint"
  | "compedium"
  | "concrate"
  | "eludium"
  | "gear"
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

export type Resource =
  | ResourceCraftable
  | "antimatter"
  | "blackcoin"
  | "bloodstone"
  | "catnip"
  | "coal"
  | "culture"
  | "faith"
  | "furs"
  | "gold"
  | "iron"
  | "ivory"
  | "karma"
  | "manpower"
  | "minerals"
  | "necrocorn"
  | "oil"
  | "paragon"
  | "relic"
  | "science"
  | "slabs" // deprecated: Use `slab` instead
  | "spice"
  | "tears"
  | "temporalFlux"
  | "timeCrystal"
  | "titanium"
  | "unicorns"
  | "unobtainium"
  | "uranium"
  | "void"
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

export type Job =
  | "engineer"
  | "farmer"
  | "geologist"
  | "hunter"
  | "miner"
  | "priest"
  | "scholar"
  | "woodcutter";

export type AllBuildings =
  | Building
  | ChronoForgeUpgrades
  | ReligionUpgrades
  | SpaceBuildings
  | TranscendenceUpgrades
  | VoidSpaceUpgrades
  | ZiggurathUpgrades;

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
    doShatterAmt: (model: unknown, amt: number) => void; // Shatter TC button
    incrementValue: (model: unknown) => void;
    onAll: (model: unknown) => void; // Turn on all (steamworks)
    payPrice: (model: unknown) => void;
    sellInternal: (model: unknown, end: number) => void; // Sell button
  };
  domNode: HTMLDivElement;
  id: T;
  model: {
    enabled: boolean;
    metadata: {
      breakIronWill: boolean;
      /**
       * How many items of this can be built at any time?
       * Used to limit Resource Retrieval to 100.
       */
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

export type Challenge = "1000Years" | "anarchy" | "atheism" | "energy" | "winterIsComing";

export * from "./buildings";
export * from "./gamePage";
export * from "./religion";
export * from "./science";
export * from "./space";
export * from "./time";
export * from "./trading";
