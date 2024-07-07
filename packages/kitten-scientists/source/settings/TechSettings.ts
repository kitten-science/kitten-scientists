import { difference } from "@oliversalzburg/js-utils/data/array.js";
import { Maybe, isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { cwarn } from "../tools/Log.js";
import { Game, Technologies, Technology } from "../types/index.js";
import { Setting } from "./Settings.js";

export class TechSetting extends Setting {
  readonly #tech: Technology;

  get tech() {
    return this.#tech;
  }

  constructor(tech: Technology, enabled = false) {
    super(enabled);
    this.#tech = tech;
  }
}

export type TechTechSettings = Record<Technology, TechSetting>;

export class TechSettings extends Setting {
  techs: TechTechSettings;

  constructor(enabled = false) {
    super(enabled);
    this.techs = this.initTechs();
  }

  private initTechs(): TechTechSettings {
    const items = {} as TechTechSettings;
    Technologies.forEach(item => {
      items[item] = new TechSetting(item, true);
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
    });
  }
}
