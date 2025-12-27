import { difference } from "@oliversalzburg/js-utils/data/array.js";
import { isNil, type Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { cl } from "../tools/Log.js";
import type { GamePage } from "../types/game.js";
import { type Mission, Missions } from "../types/index.js";
import { Setting } from "./Settings.js";

export class MissionSetting extends Setting {
  readonly #mission: Mission;

  get mission() {
    return this.#mission;
  }

  constructor(mission: Mission, enabled = false) {
    super(enabled);
    this.#mission = mission;
  }
}

export type MissionMissionSettings = Record<Mission, MissionSetting>;

export class MissionSettings extends Setting {
  missions: MissionMissionSettings;

  constructor(enabled = false) {
    super(enabled);
    this.missions = this.initMissions();
  }

  private initMissions(): MissionMissionSettings {
    const items = {} as MissionMissionSettings;
    for (const item of Missions) {
      items[item] = new MissionSetting(item);
    }
    return items;
  }

  static validateGame(game: GamePage, settings: MissionSettings) {
    const inSettings = Object.keys(settings.missions);
    const inGame = game.space.programs.map(program => program.name);

    const missingInSettings = difference(inGame, inSettings);
    const redundantInSettings = difference(inSettings, inGame);

    for (const _ of missingInSettings) {
      console.warn(...cl(`The space mission '${_}' is not tracked in Kitten Scientists!`));
    }
    for (const _ of redundantInSettings) {
      console.warn(...cl(`The space mission '${_}' is not a space mission in Kittens Game!`));
    }
  }

  load(settings: Maybe<Partial<MissionSettings>>) {
    if (isNil(settings)) {
      return;
    }

    super.load(settings);

    consumeEntriesPedantic(this.missions, settings.missions, (mission, item) => {
      mission.enabled = item?.enabled ?? mission.enabled;
    });
  }
}
