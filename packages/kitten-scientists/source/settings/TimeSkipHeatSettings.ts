import { Maybe, isNil } from "@oliversalzburg/js-utils/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { Cycles } from "../types/index.js";
import { Setting, SettingTrigger } from "./Settings.js";
import { CyclesSettings } from "./TimeSkipSettings.js";

export class TimeSkipHeatSettings extends SettingTrigger {
  readonly cycles: CyclesSettings;
  readonly activeHeatTransferStatus: Setting;

  constructor(activeHeatTransferStatus = new Setting(false)) {
    super(false, 0);
    this.cycles = this.initCycles();
    this.activeHeatTransferStatus = activeHeatTransferStatus;
  }

  private initCycles(): CyclesSettings {
    const items = {} as CyclesSettings;
    Cycles.forEach(item => {
      items[item] = new Setting(true);
    });
    return items;
  }

  load(settings: Maybe<Partial<TimeSkipHeatSettings>>) {
    if (isNil(settings)) {
      return;
    }

    super.load(settings);

    consumeEntriesPedantic(this.cycles, settings.cycles, (cycle, item) => {
      cycle.enabled = item?.enabled ?? cycle.enabled;
    });
    this.activeHeatTransferStatus.load(settings.activeHeatTransferStatus);
  }
}
