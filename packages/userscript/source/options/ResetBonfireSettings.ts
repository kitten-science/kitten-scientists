import { BonfireItem } from "./BonfireSettings";
import { SettingTrigger } from "./Settings";

export class ResetBonfireBuildingSetting extends SettingTrigger {
  readonly building: BonfireItem;

  constructor(building: BonfireItem, enabled = false, trigger = 1) {
    super(building, enabled, trigger);
    this.building = building;
  }
}

export type ResetBonfireSettings = {
  // unicornPasture is handled in the Religion section.
  [item in Exclude<BonfireItem, "unicornPasture">]: ResetBonfireBuildingSetting;
};
