import { objectEntries } from "../tools/Entries";
import { StagedBuilding } from "../types";
import { Setting } from "./Settings";
import { KittenStorageType } from "./SettingsStorage";

export class BuildingUpgradeSetting extends Setting {
  readonly upgrade: StagedBuilding;

  constructor(upgrade: StagedBuilding, enabled = false) {
    super("", enabled);
    this.upgrade = upgrade;
  }
}

export class BuildingUpgradeSettings extends Setting {
  items: {
    [item in StagedBuilding]: Setting;
  };

  constructor(
    id = "buildingUpgrades",
    enabled = false,
    items = {
      broadcasttower: new BuildingUpgradeSetting("broadcasttower", true),
      dataCenter: new BuildingUpgradeSetting("dataCenter", true),
      hydroplant: new BuildingUpgradeSetting("hydroplant", true),
      solarfarm: new BuildingUpgradeSetting("solarfarm", true),
    }
  ) {
    super(id, enabled);
    this.items = items;
  }

  load(settings: BuildingUpgradeSettings) {
    this.enabled = settings.enabled;

    for (const [name, item] of objectEntries(settings.items)) {
      this.items[name].enabled = item.enabled;
    }
  }

  static toLegacyOptions(settings: BuildingUpgradeSettings, subject: KittenStorageType) {
    subject.items["toggle-buildings"] = settings.enabled;

    for (const [name, item] of objectEntries(settings.items)) {
      subject.items[`toggle-upgrade-${name}` as const] = item.enabled;
    }
  }

  static fromLegacyOptions(subject: KittenStorageType) {
    const options = new BuildingUpgradeSettings();
    options.enabled = subject.items["toggle-buildings"] ?? options.enabled;

    for (const [name, item] of objectEntries(options.items)) {
      item.enabled = subject.items[`toggle-upgrade-${name}` as const] ?? item.enabled;
    }

    return options;
  }
}
