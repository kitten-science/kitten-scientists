import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { ChronoForgeUpgrades, TimeItemVariant, VoidSpaceUpgrades } from "../types/index.js";
import { Setting, SettingTrigger, SettingTriggerMax } from "./Settings.js";
export class TimeSettingsItem extends SettingTriggerMax {
  #building;
  #variant;
  get building() {
    return this.#building;
  }
  get variant() {
    return this.#variant;
  }
  constructor(building, variant, enabled = false) {
    super(enabled);
    this.#building = building;
    this.#variant = variant;
  }
}
export class TimeSettings extends SettingTrigger {
  buildings;
  fixCryochambers;
  constructor(enabled = false, trigger = -1, fixCryochambers = new Setting()) {
    super(enabled, trigger);
    this.buildings = this.initBuildings();
    this.fixCryochambers = fixCryochambers;
  }
  initBuildings() {
    const items = {};
    for (const item of ChronoForgeUpgrades) {
      items[item] = new TimeSettingsItem(item, TimeItemVariant.Chronoforge);
    }
    for (const item of VoidSpaceUpgrades) {
      if (item === "usedCryochambers") {
        continue;
      }
      items[item] = new TimeSettingsItem(item, TimeItemVariant.VoidSpace);
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
      building.max = item?.max ?? building.max;
      building.trigger = item?.trigger ?? building.trigger;
    });
    this.fixCryochambers.load(settings.fixCryochambers);
  }
}
//# sourceMappingURL=TimeSettings.js.map
