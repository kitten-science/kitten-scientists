import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { StagedBuildings } from "../types/index.js";
import { Setting } from "./Settings.js";
export class BuildingUpgradeSetting extends Setting {
  #upgrade;
  get upgrade() {
    return this.#upgrade;
  }
  constructor(upgrade, enabled = false) {
    super(enabled);
    this.#upgrade = upgrade;
  }
}
export class BuildingUpgradeSettings extends Setting {
  buildings;
  constructor(enabled = false) {
    super(enabled);
    this.buildings = this.initBuildings();
  }
  initBuildings() {
    const items = {};
    for (const item of StagedBuildings) {
      items[item] = new BuildingUpgradeSetting(item);
    }
    return items;
  }
  load(settings) {
    if (isNil(settings)) {
      return;
    }
    super.load(settings);
    consumeEntriesPedantic(this.buildings, settings.buildings, (building, item) => {
      building.enabled = item?.enabled ?? building.enabled;
    });
  }
}
//# sourceMappingURL=BuildingUpgradeSettings.js.map
