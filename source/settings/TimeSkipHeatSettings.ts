import { isNil, type Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { Cycles } from "../types/index.js";
import { Setting, SettingTrigger } from "./Settings.js";
import type { CyclesSettings } from "./TimeSkipSettings.js";

export class TimeSkipHeatSettings extends SettingTrigger {
  readonly cycles: CyclesSettings;
  readonly activeHeatTransferStatus: Setting;

  constructor(activeHeatTransferStatus = new Setting()) {
    super(false, 1);
    this.cycles = this.initCycles();
    this.activeHeatTransferStatus = activeHeatTransferStatus;
  }

  private initCycles(): CyclesSettings {
    const items = {} as CyclesSettings;
    for (const item of Cycles) {
      items[item] = new Setting();
    }
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
