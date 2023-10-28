import { GameTab, Panel, Price } from "./index.js";

export type SpaceTab = GameTab & {
  GCPanel: Panel;
  planetPanels: Array<Panel>;
};

export type Missions =
  | "centaurusSystemMission"
  | "charonMission"
  | "duneMission"
  | "furthestRingMission"
  | "heliosMission"
  | "kairoMission"
  | "moonMission"
  | "orbitalLaunch"
  | "piscineMission"
  | "rorschachMission"
  | "terminusMission"
  | "umbraMission"
  | "yarnMission";

export type SpaceBuildings =
  | "containmentChamber"
  | "cryostation"
  | "entangler"
  | "heatsink"
  | "hrHarvester"
  | "hydrofracturer"
  | "hydroponics"
  | "moltenCore"
  | "moonBase"
  | "moonOutpost"
  | "orbitalArray"
  | "planetCracker"
  | "researchVessel"
  | "sattelite"
  | "spaceBeacon"
  | "spaceElevator"
  | "spaceStation"
  | "spiceRefinery"
  | "sunforge"
  | "sunlifter"
  | "tectonic"
  | "terraformingStation";

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
