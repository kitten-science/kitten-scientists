import type { Panel, Tab } from "./core.js";
import type { Planet, Price, SpaceBuilding } from "./index.js";

export type SpaceTab = Tab & {
  GCPanel: Panel | null;
  planetPanels: Array<Panel> | null;
};

export type UnsafePlanet = {
  buildings: Array<UnsafeSpaceBuilding>;
  name: Planet;
  label: string;
  routeDays: number;
  reached: boolean;
  routeDaysDefault: number;
  unlocked: boolean;
};

export type UnsafeSpaceBuilding = {
  /**
   * An internationalized label for this space building.
   */
  label: string;
  name: SpaceBuilding;
  priceRatio: number;
  prices: Array<Price>;

  unlocked: boolean;

  val: number;
};
