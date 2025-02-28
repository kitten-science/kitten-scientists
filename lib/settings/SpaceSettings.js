import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { SpaceBuildings } from "../types/index.js";
import { MissionSettings } from "./MissionSettings.js";
import { SettingTrigger, SettingTriggerMax } from "./Settings.js";
export class SpaceBuildingSetting extends SettingTriggerMax {
  #building;
  get building() {
    return this.#building;
  }
  constructor(building) {
    super();
    this.#building = building;
  }
}
export class SpaceSettings extends SettingTrigger {
  buildings;
  unlockMissions;
  constructor(enabled = false, trigger = -1, unlockMissions = new MissionSettings()) {
    super(enabled, trigger);
    this.buildings = this.initBuildings();
    this.unlockMissions = unlockMissions;
  }
  initBuildings() {
    const items = {};
    for (const item of SpaceBuildings) {
      items[item] = new SpaceBuildingSetting(item);
    }
    return items;
  }
  static validateGame(game, settings) {
    MissionSettings.validateGame(game, settings.unlockMissions);
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
    this.unlockMissions.load(settings.unlockMissions);
  }
}
//# sourceMappingURL=SpaceSettings.js.map
