import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { Buildings, StagedBuildings } from "../types/index.js";
import { Setting, SettingThreshold } from "./Settings.js";
export class ResetBonfireBuildingSetting extends SettingThreshold {
  /**
   * In case this is an upgrade of another building, this is the name of the
   * base building.
   */
  #baseBuilding = undefined;
  get baseBuilding() {
    return this.#baseBuilding;
  }
  #building;
  get building() {
    return this.#building;
  }
  /**
   * In case this is an upgradable building, this indicates the level of
   * the stage.
   */
  #stage = 0;
  get stage() {
    return this.#stage;
  }
  constructor(building, enabled = false, threshold = -1, baseStage) {
    super(enabled, threshold);
    this.#building = building;
    if (baseStage) {
      this.#stage = 1;
      this.#baseBuilding = baseStage;
    }
  }
}
export class ResetBonfireSettings extends Setting {
  buildings;
  constructor(enabled = false) {
    super(enabled);
    this.buildings = this.initBuildings();
  }
  initBuildings() {
    const baseStage = {
      broadcasttower: "amphitheatre",
      dataCenter: "library",
      hydroplant: "aqueduct",
      solarfarm: "pasture",
      spaceport: "warehouse",
    };
    const items = {};
    for (const item of Buildings) {
      if (item === "unicornPasture") {
        continue;
      }
      items[item] = new ResetBonfireBuildingSetting(item);
    }
    for (const item of StagedBuildings) {
      items[item] = new ResetBonfireBuildingSetting(item, false, -1, baseStage[item]);
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
//# sourceMappingURL=ResetBonfireSettings.js.map
