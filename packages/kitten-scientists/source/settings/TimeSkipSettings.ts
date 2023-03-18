import { consumeEntriesPedantic } from "../tools/Entries";
import { isNil, Maybe } from "../tools/Maybe";
import { Cycle, Season } from "../types";
import { Setting, SettingTriggerMax } from "./Settings";

export class TimeSkipSettings extends SettingTriggerMax {
  readonly seasons: Record<Season, Setting>;

  readonly cycles: Record<Cycle, Setting>;

  get cyclesList(): Array<Setting> {
    return [
      this.cycles.charon,
      this.cycles.umbra,
      this.cycles.yarn,
      this.cycles.helios,
      this.cycles.cath,
      this.cycles.redmoon,
      this.cycles.dune,
      this.cycles.piscine,
      this.cycles.terminus,
      this.cycles.kairo,
    ];
  }

  constructor(
    cycles = {
      charon: new Setting(true),
      umbra: new Setting(true),
      yarn: new Setting(true),
      helios: new Setting(true),
      cath: new Setting(true),
      redmoon: new Setting(false),
      dune: new Setting(true),
      piscine: new Setting(true),
      terminus: new Setting(true),
      kairo: new Setting(true),
    },
    seasons = {
      spring: new Setting(true),
      summer: new Setting(false),
      autumn: new Setting(false),
      winter: new Setting(false),
    }
  ) {
    super(false, 5);
    this.seasons = seasons;
    this.cycles = cycles;
  }

  load(settings: Maybe<Partial<TimeSkipSettings>>) {
    if (isNil(settings)) {
      return;
    }

    super.load(settings);

    consumeEntriesPedantic(this.seasons, settings.seasons, (season, item) => {
      season.enabled = item?.enabled ?? season.enabled;
    });
    consumeEntriesPedantic(this.cycles, settings.cycles, (cycle, item) => {
      cycle.enabled = item?.enabled ?? cycle.enabled;
    });
  }
}