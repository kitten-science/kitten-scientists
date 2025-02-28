import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { Cycles } from "../types/index.js";
import { Setting, SettingTrigger } from "./Settings.js";
export class TimeSkipHeatSettings extends SettingTrigger {
  cycles;
  activeHeatTransferStatus;
  constructor(activeHeatTransferStatus = new Setting()) {
    super(false, 1);
    this.cycles = this.initCycles();
    this.activeHeatTransferStatus = activeHeatTransferStatus;
  }
  initCycles() {
    const items = {};
    for (const item of Cycles) {
      items[item] = new Setting();
    }
    return items;
  }
  load(settings) {
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
//# sourceMappingURL=TimeSkipHeatSettings.js.map
