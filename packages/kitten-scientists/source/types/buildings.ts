import { Game, Price } from "./index.js";

export type Building =
  | "academy"
  | "accelerator"
  | "aiCore"
  | "amphitheatre"
  | "aqueduct"
  | "barn"
  | "biolab"
  | "brewery"
  | "calciner"
  | "chapel"
  | "chronosphere"
  | "factory"
  | "field"
  | "harbor"
  | "hut"
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

export type StagedBuilding =
  | "broadcasttower"
  | "dataCenter"
  | "hydroplant"
  | "solarfarm"
  | "spaceport";

// Returned from game.bld.getBuildingExt()
export type BuildingMeta = {
  calculateEffects?: (model: unknown, game: Game) => void;
  description?: string;
  effects: { unicornsPerTickBase?: number };
  flavor?: string;
  label?: string;
  name: Building;
  noStackable?: boolean;
  on: number;
  priceRatio?: number;
  prices?: Array<Price>;
  stage?: number;
  stages?: Array<{
    calculateEffects?: (model: unknown, game: Game) => void;
    calculateEnergyProduction?: (game: Game, season: unknown) => void;
    description: string;
    effects?: { catnipDemandRatio?: number };
    flavor?: string;
    label: string;
    priceRatio: number;
    prices: Array<Price>;
    stageUnlocked: boolean;
  }>;
  unlockRatio?: number;
  unlockable?: boolean;
  unlocked: boolean;
  /**
   * How many of these do you have?
   */
  val: number;
};
export type BuildingExt = {
  meta: BuildingMeta;
};
