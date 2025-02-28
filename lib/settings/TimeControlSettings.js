import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { ResetSettings } from "./ResetSettings.js";
import { Setting, SettingTrigger } from "./Settings.js";
import { TimeSkipSettings } from "./TimeSkipSettings.js";
export class TimeControlSettings extends Setting {
  accelerateTime;
  timeSkip;
  reset;
  constructor(
    enabled = false,
    accelerateTime = new SettingTrigger(false, 1),
    reset = new ResetSettings(),
    timeSkip = new TimeSkipSettings(),
  ) {
    super(enabled);
    this.accelerateTime = accelerateTime;
    this.reset = reset;
    this.timeSkip = timeSkip;
  }
  load(settings) {
    if (isNil(settings)) {
      return;
    }
    super.load(settings);
    this.accelerateTime.load(settings.accelerateTime);
    this.reset.load(settings.reset);
    this.timeSkip.load(settings.timeSkip);
  }
}
//# sourceMappingURL=TimeControlSettings.js.map
