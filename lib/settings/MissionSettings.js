import { difference } from "@oliversalzburg/js-utils/data/array.js";
import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { cwarn } from "../tools/Log.js";
import { Missions } from "../types/index.js";
import { Setting } from "./Settings.js";
export class MissionSetting extends Setting {
  #mission;
  get mission() {
    return this.#mission;
  }
  constructor(mission, enabled = false) {
    super(enabled);
    this.#mission = mission;
  }
}
export class MissionSettings extends Setting {
  missions;
  constructor(enabled = false) {
    super(enabled);
    this.missions = this.initMissions();
  }
  initMissions() {
    const items = {};
    for (const item of Missions) {
      items[item] = new MissionSetting(item);
    }
    return items;
  }
  static validateGame(game, settings) {
    const inSettings = Object.keys(settings.missions);
    const inGame = game.space.programs.map(program => program.name);
    const missingInSettings = difference(inGame, inSettings);
    const redundantInSettings = difference(inSettings, inGame);
    for (const mission of missingInSettings) {
      cwarn(`The space mission '${mission}' is not tracked in Kitten Scientists!`);
    }
    for (const mission of redundantInSettings) {
      cwarn(`The space mission '${mission}' is not a space mission in Kittens Game!`);
    }
  }
  load(settings) {
    if (isNil(settings)) {
      return;
    }
    super.load(settings);
    consumeEntriesPedantic(this.missions, settings.missions, (mission, item) => {
      mission.enabled = item?.enabled ?? mission.enabled;
    });
  }
}
//# sourceMappingURL=MissionSettings.js.map
