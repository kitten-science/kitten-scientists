import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { Buildings, StagedBuildings } from "../types/index.js";
import { BuildingUpgradeSettings } from "./BuildingUpgradeSettings.js";
import { Setting, SettingTrigger, SettingTriggerMax } from "./Settings.js";
export class BonfireBuildingSetting extends SettingTriggerMax {
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
  constructor(building, enabled = false, trigger = -1, max = 0, baseStage) {
    super(enabled, trigger, max);
    this.#building = building;
    if (baseStage) {
      this.#stage = 1;
      this.#baseBuilding = baseStage;
    }
  }
}
export class BonfireSettings extends SettingTrigger {
  buildings;
  gatherCatnip;
  turnOnMagnetos;
  turnOnSteamworks;
  turnOnReactors;
  upgradeBuildings;
  constructor(
    enabled = false,
    trigger = -1,
    gatherCatnip = new Setting(),
    turnOnSteamworks = new Setting(),
    turnOnMagnetos = new Setting(),
    turnOnReactors = new Setting(),
    upgradeBuildings = new BuildingUpgradeSettings(),
  ) {
    super(enabled, trigger);
    this.buildings = this.initBuildings();
    this.gatherCatnip = gatherCatnip;
    this.turnOnSteamworks = turnOnSteamworks;
    this.turnOnMagnetos = turnOnMagnetos;
    this.turnOnReactors = turnOnReactors;
    this.upgradeBuildings = upgradeBuildings;
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
      items[item] = new BonfireBuildingSetting(item);
    }
    for (const item of StagedBuildings) {
      items[item] = new BonfireBuildingSetting(item, false, -1, 0, baseStage[item]);
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
    this.gatherCatnip.enabled = settings.gatherCatnip?.enabled ?? this.gatherCatnip.enabled;
    this.turnOnSteamworks.enabled =
      settings.turnOnSteamworks?.enabled ?? this.turnOnSteamworks.enabled;
    this.turnOnMagnetos.enabled = settings.turnOnMagnetos?.enabled ?? this.turnOnMagnetos.enabled;
    this.turnOnReactors.enabled = settings.turnOnReactors?.enabled ?? this.turnOnReactors.enabled;
    this.upgradeBuildings.load(settings.upgradeBuildings);
  }
}
//# sourceMappingURL=BonfireSettings.js.map
