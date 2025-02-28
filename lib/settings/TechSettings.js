import { difference } from "@oliversalzburg/js-utils/data/array.js";
import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { cinfo, cwarn } from "../tools/Log.js";
import { Technologies, TechnologiesIgnored } from "../types/index.js";
import { SettingTrigger } from "./Settings.js";
export class TechSetting extends SettingTrigger {
  #tech;
  get tech() {
    return this.#tech;
  }
  constructor(tech, enabled = false) {
    super(enabled, -1);
    this.#tech = tech;
  }
}
export class TechSettings extends SettingTrigger {
  techs;
  constructor(enabled = false) {
    super(enabled, 0);
    this.techs = this.initTechs();
  }
  initTechs() {
    const items = {};
    for (const item of Technologies) {
      items[item] = new TechSetting(item);
    }
    return items;
  }
  static validateGame(game, settings) {
    const inSettings = Object.keys(settings.techs);
    const inGame = game.science.techs.map(tech => tech.name);
    const missingInSettings = difference(inGame, inSettings);
    const redundantInSettings = difference(inSettings, inGame);
    for (const tech of missingInSettings) {
      if (TechnologiesIgnored.includes(tech)) {
        continue;
      }
      cwarn(`The technology '${tech}' is not tracked in Kitten Scientists!`);
    }
    for (const tech of redundantInSettings) {
      if (TechnologiesIgnored.includes(tech)) {
        cinfo(`The technology '${tech}' is a technology in Kittens Game, but it's no longer used.`);
        continue;
      }
      cwarn(`The technology '${tech}' is not a technology in Kittens Game!`);
    }
  }
  load(settings) {
    if (isNil(settings)) {
      return;
    }
    super.load(settings);
    consumeEntriesPedantic(this.techs, settings.techs, (tech, item) => {
      tech.enabled = item?.enabled ?? tech.enabled;
      tech.trigger = item?.trigger ?? tech.trigger;
    });
  }
}
//# sourceMappingURL=TechSettings.js.map
