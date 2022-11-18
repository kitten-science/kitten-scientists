import { consumeEntriesPedantic, objectEntries } from "../tools/Entries";
import { isNil, Maybe } from "../tools/Maybe";
import { StagedBuilding } from "../types";
import { Setting } from "./Settings";
import { LegacyStorage } from "./SettingsStorage";

export class BuildingUpgradeSetting extends Setting {
  readonly upgrade: StagedBuilding;

  constructor(upgrade: StagedBuilding, enabled = false) {
    super(enabled);
    this.upgrade = upgrade;
  }
}

export type BuildingUpdateBuildingSettings = Record<StagedBuilding, BuildingUpgradeSetting>;

export class BuildingUpgradeSettings extends Setting {
  buildings: BuildingUpdateBuildingSettings;

  constructor(
    enabled = false,
    buildings: BuildingUpdateBuildingSettings = {
      broadcasttower: new BuildingUpgradeSetting("broadcasttower", true),
      dataCenter: new BuildingUpgradeSetting("dataCenter", true),
      hydroplant: new BuildingUpgradeSetting("hydroplant", true),
      solarfarm: new BuildingUpgradeSetting("solarfarm", true),
    }
  ) {
    super(enabled);
    this.buildings = buildings;
  }

  load(settings: Maybe<Partial<BuildingUpgradeSettings>>) {
    if (isNil(settings)) {
      return;
    }

    super.load(settings);

    consumeEntriesPedantic(this.buildings, settings.buildings, (building, item) => {
      building.enabled = item?.enabled ?? building.enabled;
    });
  }

  static toLegacyOptions(settings: BuildingUpgradeSettings, subject: LegacyStorage) {
    subject.items["toggle-buildings"] = settings.enabled;

    for (const [name, item] of objectEntries(settings.buildings)) {
      subject.items[`toggle-upgrade-${name}` as const] = item.enabled;
    }
  }

  static fromLegacyOptions(subject: LegacyStorage) {
    const options = new BuildingUpgradeSettings();
    options.enabled = subject.items["toggle-buildings"] ?? options.enabled;

    for (const [name, item] of objectEntries(options.buildings)) {
      item.enabled = subject.items[`toggle-upgrade-${name}` as const] ?? item.enabled;
    }

    return options;
  }
}
