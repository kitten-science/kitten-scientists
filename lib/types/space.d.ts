import type { GameTab, Panel, Price } from "./index.js";
export type SpaceTab = GameTab & {
  GCPanel: Panel | null;
  planetPanels: Array<Panel> | null;
};
export declare const Missions: readonly [
  "centaurusSystemMission",
  "charonMission",
  "duneMission",
  "furthestRingMission",
  "heliosMission",
  "kairoMission",
  "moonMission",
  "orbitalLaunch",
  "piscineMission",
  "rorschachMission",
  "terminusMission",
  "umbraMission",
  "yarnMission",
];
export type Mission = (typeof Missions)[number];
export declare const Planets: readonly [
  "cath",
  "centaurusSystem",
  "charon",
  "dune",
  "furthestRing",
  "helios",
  "kairo",
  "moon",
  "piscine",
  "terminus",
  "umbra",
  "yarn",
];
export type Planet = (typeof Planets)[number];
export type PlanetMeta = {
  buildings: Array<{
    name: SpaceBuilding;
    label: string;
  }>;
  name: Planet;
  label: string;
  routeDays: number;
  reached: boolean;
  routeDaysDefault: number;
  unlocked: boolean;
};
export declare const SpaceBuildings: readonly [
  "containmentChamber",
  "cryostation",
  "entangler",
  "heatsink",
  "hrHarvester",
  "hydrofracturer",
  "hydroponics",
  "moltenCore",
  "moonBase",
  "moonOutpost",
  "orbitalArray",
  "planetCracker",
  "researchVessel",
  "sattelite",
  "spaceBeacon",
  "spaceElevator",
  "spaceStation",
  "spiceRefinery",
  "sunforge",
  "sunlifter",
  "tectonic",
  "terraformingStation",
];
export type SpaceBuilding = (typeof SpaceBuildings)[number];
export type SpaceBuildingInfo = {
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
//# sourceMappingURL=space.d.ts.map
