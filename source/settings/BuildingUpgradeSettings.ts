import { isNil, type Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { type StagedBuilding, StagedBuildings } from "../types/index.js";
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

  constructor(enabled = false) {
    super(enabled);
    this.buildings = this.initBuildings();
  }

  private initBuildings(): BuildingUpdateBuildingSettings {
    const items = {} as BuildingUpdateBuildingSettings;
    for (const item of StagedBuildings) {
      items[item] = new BuildingUpgradeSetting(item);
    }
    return items;
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
