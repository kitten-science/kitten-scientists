import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { ChronoForgeUpgrades, TimeItemVariant, VoidSpaceUpgrades } from "../types/index.js";
import { Setting, SettingThreshold } from "./Settings.js";
export class ResetTimeBuildingSetting extends SettingThreshold {
  #building;
  #variant;
  get building() {
    return this.#building;
  }
  get variant() {
    return this.#variant;
  }
  constructor(id, variant, enabled = false, threshold = -1) {
    super(enabled, threshold);
    this.#building = id;
    this.#variant = variant;
  }
}
export class ResetTimeSettings extends Setting {
  buildings;
  constructor(enabled = false) {
    super(enabled);
    this.buildings = this.initBuildings();
  }
  initBuildings() {
    const items = {};
    for (const item of ChronoForgeUpgrades) {
      items[item] = new ResetTimeBuildingSetting(item, TimeItemVariant.Chronoforge);
    }
    for (const item of VoidSpaceUpgrades) {
      if (item === "usedCryochambers") {
        continue;
      }
      items[item] = new ResetTimeBuildingSetting(item, TimeItemVariant.VoidSpace);
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
//# sourceMappingURL=ResetTimeSettings.js.map
