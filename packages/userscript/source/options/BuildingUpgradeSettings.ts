import { StagedBuilding } from "../types";
import { SettingsSection, SettingToggle } from "./SettingsSection";

export type BuildingUpgradeSettingsItem = SettingToggle;
export class BuildingUpgradeSettings extends SettingsSection {
  items: {
    [item in StagedBuilding]: BuildingUpgradeSettingsItem;
  } = {
    broadcasttower: { enabled: true },
    dataCenter: { enabled: true },
    hydroplant: { enabled: true },
    solarfarm: { enabled: true },
  };
}
