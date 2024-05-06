import { Maybe, isNil } from "@oliversalzburg/js-utils/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { Cycle } from "../types/index.js";
import { Setting, SettingTrigger } from "./Settings.js";

export class TimeSkipHeatSettings extends SettingTrigger {
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
      redmoon: new Setting(true),
      dune: new Setting(true),
      piscine: new Setting(true),
      terminus: new Setting(true),
      kairo: new Setting(true),
    },
  ) {
    super(false, 0);
    this.cycles = cycles;
  }

  load(settings: Maybe<Partial<TimeSkipHeatSettings>>) {
    if (isNil(settings)) {
      return;
    }

    super.load(settings);

    consumeEntriesPedantic(this.cycles, settings.cycles, (cycle, item) => {
      cycle.enabled = item?.enabled ?? cycle.enabled;
    });
  }
}
