import { type Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import { type SpaceBuilding } from "../types/index.js";
import { Setting, SettingThreshold } from "./Settings.js";
export declare class ResetSpaceBuildingSetting extends SettingThreshold {
  #private;
  get building():
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
  constructor(building: SpaceBuilding, enabled?: boolean, threshold?: number);
}
export type ResetSpaceBuildingSettings = Record<SpaceBuilding, SettingThreshold>;
export declare class ResetSpaceSettings extends Setting {
  readonly buildings: ResetSpaceBuildingSettings;
  constructor(enabled?: boolean);
  private initBuildings;
  load(settings: Maybe<Partial<ResetSpaceSettings>>): void;
}
//# sourceMappingURL=ResetSpaceSettings.d.ts.map
