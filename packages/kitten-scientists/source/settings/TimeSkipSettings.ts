import { Maybe, isNil } from "@oliversalzburg/js-utils/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { Cycle, Cycles, Season, Seasons } from "../types/index.js";
import { Setting, SettingTriggerMax } from "./Settings.js";

export type CyclesSettings = Record<Cycle, Setting>;
export type SeasonsSettings = Record<Season, Setting>;

export class TimeSkipSettings extends SettingTriggerMax {
  readonly cycles: CyclesSettings;
  readonly seasons: SeasonsSettings;
  readonly ignoreOverheat: Setting;

  constructor(ignoreOverheat = new Setting(false)) {
    super(false, 5);
    this.cycles = this.initCycles();
    this.seasons = this.initSeason();
    this.ignoreOverheat = ignoreOverheat;
  }

  private initCycles(): CyclesSettings {
    const items = {} as CyclesSettings;
    Cycles.forEach(item => {
      items[item] = new Setting(item !== "redmoon");
    });
    return items;
  }

  private initSeason(): SeasonsSettings {
    const items = {} as SeasonsSettings;
    Seasons.forEach(item => {
      items[item] = new Setting(item === "spring");
    });
    return items;
  }

  load(settings: Maybe<Partial<TimeSkipSettings>>) {
    if (isNil(settings)) {
      return;
    }

    super.load(settings);

    consumeEntriesPedantic(this.cycles, settings.cycles, (cycle, item) => {
      cycle.enabled = item?.enabled ?? cycle.enabled;
    });
    consumeEntriesPedantic(this.seasons, settings.seasons, (season, item) => {
      season.enabled = item?.enabled ?? season.enabled;
    });
    this.ignoreOverheat.load(settings.ignoreOverheat);
  }
}
