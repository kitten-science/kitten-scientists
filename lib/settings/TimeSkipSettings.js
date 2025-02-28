import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { TimeSkipHeatSettings } from "../settings/TimeSkipHeatSettings.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { Cycles, Seasons } from "../types/index.js";
import { Setting, SettingThresholdMax } from "./Settings.js";
export class TimeSkipSettings extends SettingThresholdMax {
  cycles;
  seasons;
  activeHeatTransfer;
  ignoreOverheat;
  constructor(ignoreOverheat = new Setting(), activeHeatTransfer = new TimeSkipHeatSettings()) {
    super(false, 5);
    this.cycles = this.initCycles();
    this.seasons = this.initSeason();
    this.activeHeatTransfer = activeHeatTransfer;
    this.ignoreOverheat = ignoreOverheat;
  }
  initCycles() {
    const items = {};
    for (const item of Cycles) {
      items[item] = new Setting();
    }
    return items;
  }
  initSeason() {
    const items = {};
    for (const item of Seasons) {
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
    consumeEntriesPedantic(this.seasons, settings.seasons, (season, item) => {
      season.enabled = item?.enabled ?? season.enabled;
    });
    this.ignoreOverheat.load(settings.ignoreOverheat);
    this.activeHeatTransfer.load(settings.activeHeatTransfer);
  }
}
//# sourceMappingURL=TimeSkipSettings.js.map
