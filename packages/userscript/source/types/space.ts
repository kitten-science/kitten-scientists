import { BuildButton, GameTab, Panel, Price } from ".";

export type SpaceTab = GameTab & {
  GCPanel: Panel;
  planetPanels: Array<Panel>;
};

export type SpaceUpgrades =
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
  name:SpaceUpgrades;
  priceRatio:number;
  prices: Array<Price>;

  unlocked: boolean;

  val: number;
};
