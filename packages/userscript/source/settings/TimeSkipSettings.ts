import { consumeEntriesPedantic, objectEntries } from "../tools/Entries";
import { isNil, Maybe } from "../tools/Maybe";
import { Cycle, Season } from "../types";
import { Setting, SettingTriggerMax } from "./Settings";
import { LegacyStorage } from "./SettingsStorage";

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
      charon: new Setting(false),
      umbra: new Setting(false),
      yarn: new Setting(false),
      helios: new Setting(false),
      cath: new Setting(false),
      redmoon: new Setting(false),
      dune: new Setting(false),
      piscine: new Setting(false),
      terminus: new Setting(false),
      kairo: new Setting(false),
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

  static toLegacyOptions(settings: TimeSkipSettings, subject: LegacyStorage) {
    subject.items["toggle-timeSkip"] = settings.enabled;

    subject.items["set-timeSkip-trigger"] = settings.trigger;
    subject.items["set-timeSkip-max"] = settings.max;

    for (const [name, item] of objectEntries(settings.seasons)) {
      subject.items[`toggle-timeSkip-${name}`] = item.enabled;
    }

    subject.items[`toggle-timeSkip-0`] = settings.cycles.charon.enabled;
    subject.items[`toggle-timeSkip-1`] = settings.cycles.umbra.enabled;
    subject.items[`toggle-timeSkip-2`] = settings.cycles.yarn.enabled;
    subject.items[`toggle-timeSkip-3`] = settings.cycles.helios.enabled;
    subject.items[`toggle-timeSkip-4`] = settings.cycles.cath.enabled;
    subject.items[`toggle-timeSkip-5`] = settings.cycles.redmoon.enabled;
    subject.items[`toggle-timeSkip-6`] = settings.cycles.dune.enabled;
    subject.items[`toggle-timeSkip-7`] = settings.cycles.piscine.enabled;
    subject.items[`toggle-timeSkip-8`] = settings.cycles.terminus.enabled;
    subject.items[`toggle-timeSkip-9`] = settings.cycles.kairo.enabled;
  }

  static fromLegacyOptions(subject: LegacyStorage) {
    const settings = new TimeSkipSettings();
    settings.enabled = subject.items["toggle-timeSkip"] ?? settings.enabled;

    settings.trigger = subject.items["set-timeSkip-trigger"] ?? settings.trigger;
    settings.max = subject.items["set-timeSkip-max"] ?? settings.max;

    for (const [name, item] of objectEntries(settings.seasons)) {
      item.enabled = subject.items[`toggle-timeSkip-${name}`] ?? item.enabled;
    }

    settings.cycles.charon.enabled =
      subject.items[`toggle-timeSkip-0`] ?? settings.cycles.charon.enabled;
    settings.cycles.umbra.enabled =
      subject.items[`toggle-timeSkip-1`] ?? settings.cycles.umbra.enabled;
    settings.cycles.yarn.enabled =
      subject.items[`toggle-timeSkip-2`] ?? settings.cycles.yarn.enabled;
    settings.cycles.helios.enabled =
      subject.items[`toggle-timeSkip-3`] ?? settings.cycles.helios.enabled;
    settings.cycles.cath.enabled =
      subject.items[`toggle-timeSkip-4`] ?? settings.cycles.cath.enabled;
    settings.cycles.redmoon.enabled =
      subject.items[`toggle-timeSkip-5`] ?? settings.cycles.redmoon.enabled;
    settings.cycles.dune.enabled =
      subject.items[`toggle-timeSkip-6`] ?? settings.cycles.dune.enabled;
    settings.cycles.piscine.enabled =
      subject.items[`toggle-timeSkip-7`] ?? settings.cycles.piscine.enabled;
    settings.cycles.terminus.enabled =
      subject.items[`toggle-timeSkip-8`] ?? settings.cycles.terminus.enabled;
    settings.cycles.kairo.enabled =
      subject.items[`toggle-timeSkip-9`] ?? settings.cycles.kairo.enabled;

    return settings;
  }
}
