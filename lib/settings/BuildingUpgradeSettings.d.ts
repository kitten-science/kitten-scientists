import { type Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import { type StagedBuilding } from "../types/index.js";
import { Setting } from "./Settings.js";
export declare class BuildingUpgradeSetting extends Setting {
  #private;
  get upgrade(): "broadcasttower" | "dataCenter" | "hydroplant" | "solarfarm" | "spaceport";
  constructor(upgrade: StagedBuilding, enabled?: boolean);
}
export type BuildingUpdateBuildingSettings = Record<StagedBuilding, BuildingUpgradeSetting>;
export declare class BuildingUpgradeSettings extends Setting {
  buildings: BuildingUpdateBuildingSettings;
  constructor(enabled?: boolean);
  private initBuildings;
  load(settings: Maybe<Partial<BuildingUpgradeSettings>>): void;
}
//# sourceMappingURL=BuildingUpgradeSettings.d.ts.map
