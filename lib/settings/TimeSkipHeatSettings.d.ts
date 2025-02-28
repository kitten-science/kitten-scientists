import { type Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import { Setting, SettingTrigger } from "./Settings.js";
import type { CyclesSettings } from "./TimeSkipSettings.js";
export declare class TimeSkipHeatSettings extends SettingTrigger {
  readonly cycles: CyclesSettings;
  readonly activeHeatTransferStatus: Setting;
  constructor(activeHeatTransferStatus?: Setting);
  private initCycles;
  load(settings: Maybe<Partial<TimeSkipHeatSettings>>): void;
}
//# sourceMappingURL=TimeSkipHeatSettings.d.ts.map
