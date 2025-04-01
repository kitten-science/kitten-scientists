import { difference } from "@oliversalzburg/js-utils/data/array.js";
import { type Maybe, isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { cl } from "../tools/Log.js";
import type { GamePage } from "../types/game.js";
import {
  Technologies,
  TechnologiesIgnored,
  type Technology,
  type TechnologyIgnored,
} from "../types/index.js";
import { SettingTrigger } from "./Settings.js";

type AnyTechnology = Technology | TechnologyIgnored;

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
    super(enabled, -1);
    this.techs = this.initTechs();
  }

  private initTechs(): TechTechSettings {
    const items = {} as TechTechSettings;
    for (const item of Technologies) {
      items[item] = new TechSetting(item);
    }
    return items;
  }

  static validateGame(game: GamePage, settings: TechSettings) {
    const inSettings = Object.keys(settings.techs);
    const inGame = game.science.techs.map(tech => tech.name);

    const missingInSettings = difference(inGame, inSettings) as Array<AnyTechnology>;
    const redundantInSettings = difference(inSettings, inGame) as Array<AnyTechnology>;

    for (const tech of missingInSettings) {
      if (TechnologiesIgnored.includes(tech as TechnologyIgnored)) {
        continue;
      }

      console.warn(...cl(`The technology '${tech}' is not tracked in Kitten Scientists!`));
    }
    for (const tech of redundantInSettings) {
      if (TechnologiesIgnored.includes(tech as TechnologyIgnored)) {
        console.info(
          ...cl(
            `The technology '${tech}' is a technology in Kittens Game, but it's no longer used.`,
          ),
        );
        continue;
      }

      console.warn(...cl(`The technology '${tech}' is not a technology in Kittens Game!`));
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
