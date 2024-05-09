import { GameTab, Panel, Price } from "./index.js";

export type SpaceTab = GameTab & {
  GCPanel: Panel;
  planetPanels: Array<Panel>;
};

export const MissionsArray = [
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
export type Missions = (typeof MissionsArray)[number];

export const SpaceBuildingsArray = [
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
export type SpaceBuildings = (typeof SpaceBuildingsArray)[number];

export type SpaceBuildingInfo = {
  /**
   * An internationalized label for this space building.
   */
  label: string;
  name: SpaceBuildings;
  priceRatio: number;
  prices: Array<Price>;

  unlocked: boolean;

  val: number;
};
