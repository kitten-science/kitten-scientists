import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { SpaceBuildings } from "../types/index.js";
import { Setting, SettingThreshold } from "./Settings.js";
export class ResetSpaceBuildingSetting extends SettingThreshold {
  #building;
  get building() {
    return this.#building;
  }
  constructor(building, enabled = false, threshold = -1) {
    super(enabled, threshold);
    this.#building = building;
  }
}
export class ResetSpaceSettings extends Setting {
  buildings;
  constructor(enabled = false) {
    super(enabled);
    this.buildings = this.initBuildings();
  }
  initBuildings() {
    const items = {};
    for (const item of SpaceBuildings) {
      items[item] = new ResetSpaceBuildingSetting(item);
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
      building.trigger = item?.trigger ?? building.trigger;
    });
  }
}
//# sourceMappingURL=ResetSpaceSettings.js.map
