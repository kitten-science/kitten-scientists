import { StagedBuilding } from "../types";
import { Setting } from "./Settings";
import { SettingsSection } from "./SettingsSection";

export class BuildingUpgradeSettings extends SettingsSection {
  items: {
    [item in StagedBuilding]: Setting;
  } = {
    broadcasttower: new Setting(true),
    dataCenter: new Setting(true),
    hydroplant: new Setting(true),
    solarfarm: new Setting(true),
  };
}
