import { SpaceBuildings } from "../types";
import { SettingTrigger } from "./Settings";

export class ResetSpaceBuildingSetting extends SettingTrigger {
  readonly building: SpaceBuildings;

  constructor(building: SpaceBuildings, enabled = false, trigger = 1) {
    super(building, enabled, trigger);
    this.building = building;
  }
}

export type ResetSpaceSettings = {
  [item in SpaceBuildings]: SettingTrigger;
};
