import { isNil, type Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import { ResetSettings } from "./ResetSettings.js";
import { Setting, SettingTrigger } from "./Settings.js";
import { TimeSkipSettings } from "./TimeSkipSettings.js";

export type CycleIndices = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type TimeControlItem = "accelerateTime" | "reset" | "timeSkip";

export class TimeControlSettings extends Setting {
  accelerateTime: SettingTrigger;
  timeSkip: TimeSkipSettings;
  reset: ResetSettings;

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

  load(settings: Maybe<Partial<TimeControlSettings>>) {
    if (isNil(settings)) {
      return;
    }

    super.load(settings);

    this.accelerateTime.load(settings.accelerateTime);
    this.reset.load(settings.reset);
    this.timeSkip.load(settings.timeSkip);
  }
}
