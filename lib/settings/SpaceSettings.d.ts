import { type Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import { type Game, type SpaceBuilding } from "../types/index.js";
import { MissionSettings } from "./MissionSettings.js";
import { SettingTrigger, SettingTriggerMax } from "./Settings.js";
export declare class SpaceBuildingSetting extends SettingTriggerMax {
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
  constructor(building: SpaceBuilding);
}
export type SpaceBuildingSettings = Record<SpaceBuilding, SpaceBuildingSetting>;
export declare class SpaceSettings extends SettingTrigger {
  buildings: SpaceBuildingSettings;
  unlockMissions: MissionSettings;
  constructor(enabled?: boolean, trigger?: number, unlockMissions?: MissionSettings);
  private initBuildings;
  static validateGame(game: Game, settings: SpaceSettings): void;
  load(settings: Maybe<Partial<SpaceSettings>>): void;
}
//# sourceMappingURL=SpaceSettings.d.ts.map
