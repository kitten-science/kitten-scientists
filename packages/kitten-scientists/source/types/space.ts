import { GameTab, Panel, Price } from "./index.js";

export type SpaceTab = GameTab & {
  GCPanel: Panel | null;
  planetPanels: Array<Panel> | null;
};

export const Missions = [
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
] as const;
export type Mission = (typeof Missions)[number];

export const Planets = [
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
] as const;
export type Planet = (typeof Planets)[number];

export type PlanetMeta = {
  buildings: Array<{ name: SpaceBuilding; label: string }>;
  name: Planet;
  label: string;
  routeDays: number;
  reached: boolean;
  routeDaysDefault: number;
  unlocked: boolean;
};

export const SpaceBuildings = [
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
] as const;
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
