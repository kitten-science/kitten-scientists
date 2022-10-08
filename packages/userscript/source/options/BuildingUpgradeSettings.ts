import { StagedBuilding } from "../types";
import { Setting } from "./Settings";
import { SettingsSection } from "./SettingsSection";

export class BuildingUpgradeSettings extends SettingsSection {
  items: {
    [item in StagedBuilding]: Setting;
  } = {
    broadcasttower: new Setting("broadcasttower", true),
    dataCenter: new Setting("dataCenter", true),
    hydroplant: new Setting("hydroplant", true),
    solarfarm: new Setting("solarfarm", true),
  };
}
