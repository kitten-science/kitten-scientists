import { Maybe, isNil } from "@oliversalzburg/js-utils/lib/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { StagedBuilding } from "../types/index.js";
import { Setting } from "./Settings.js";

export class BuildingUpgradeSetting extends Setting {
  readonly #upgrade: StagedBuilding;

  get upgrade() {
    return this.#upgrade;
  }

  constructor(upgrade: StagedBuilding, enabled = false) {
    super(enabled);
    this.#upgrade = upgrade;
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
    },
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
}
