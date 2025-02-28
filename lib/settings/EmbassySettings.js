import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { Races } from "../types/index.js";
import { SettingMax, SettingTrigger } from "./Settings.js";
export class EmbassySetting extends SettingMax {
  #race;
  get race() {
    return this.#race;
  }
  constructor(race, enabled = false) {
    super(enabled);
    this.#race = race;
  }
}
export class EmbassySettings extends SettingTrigger {
  races;
  constructor(enabled = false) {
    super(enabled);
    this.races = this.initRaces();
  }
  initRaces() {
    const items = {};
    for (const item of Races) {
      items[item] = new EmbassySetting(item);
    }
    return items;
  }
  load(settings) {
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
//# sourceMappingURL=EmbassySettings.js.map
