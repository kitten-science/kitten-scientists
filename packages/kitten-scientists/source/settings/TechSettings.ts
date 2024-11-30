import { difference } from "@oliversalzburg/js-utils/data/array.js";
import { Maybe, isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { cwarn } from "../tools/Log.js";
import { Game, Technologies, Technology } from "../types/index.js";
import { SettingTrigger } from "./Settings.js";

export class TechSetting extends SettingTrigger {
  readonly #tech: Technology;

  get tech() {
    return this.#tech;
  }

  constructor(tech: Technology, enabled = false) {
    super(enabled, -1);
    this.#tech = tech;
  }
}

export type TechTechSettings = Record<Technology, TechSetting>;

export class TechSettings extends SettingTrigger {
  techs: TechTechSettings;

  constructor(enabled = false) {
    super(enabled, 0);
    this.techs = this.initTechs();
  }

  private initTechs(): TechTechSettings {
    const items = {} as TechTechSettings;
    Technologies.forEach(item => {
      items[item] = new TechSetting(item);
    });
    return items;
  }

  static validateGame(game: Game, settings: TechSettings) {
    const inSettings = Object.keys(settings.techs);
    const inGame = game.science.techs.map(tech => tech.name);

    const missingInSettings = difference(inGame, inSettings);
    const redundantInSettings = difference(inSettings, inGame);

    for (const tech of missingInSettings) {
      cwarn(`The technology '${tech}' is not tracked in Kitten Scientists!`);
    }
    for (const tech of redundantInSettings) {
      cwarn(`The technology '${tech}' is not a technology in Kittens Game!`);
    }
  }

  load(settings: Maybe<Partial<TechSettings>>) {
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
