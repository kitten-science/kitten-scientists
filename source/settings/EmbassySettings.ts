import { isNil, type Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { type Race, Races } from "../types/index.js";
import { SettingMax, SettingTrigger } from "./Settings.js";

export class EmbassySetting extends SettingMax {
  readonly #race: Race;

  get race() {
    return this.#race;
  }

  constructor(race: Race, enabled = false) {
    super(enabled);
    this.#race = race;
  }
}

export type EmbassyRaceSettings = Record<Race, SettingMax>;

export class EmbassySettings extends SettingTrigger {
  races: EmbassyRaceSettings;

  constructor(enabled = false) {
    super(enabled);
    this.races = this.initRaces();
  }

  private initRaces(): EmbassyRaceSettings {
    const items = {} as EmbassyRaceSettings;
    for (const item of Races) {
      // Leviathans have no embassies.
      if (item === "leviathans") {
        continue;
      }
      items[item] = new EmbassySetting(item);
    }
    return items;
  }

  load(settings: Maybe<Partial<EmbassySettings>>) {
    if (isNil(settings)) {
      return;
    }

    super.load(settings);

    consumeEntriesPedantic(this.races, settings.races, (race, item) => {
      race.enabled = item?.enabled ?? race.enabled;
      race.max = item?.max ?? race.max;
    });
  }
}
