import { isNil, Maybe } from "../tools/Maybe";
import { ResetSettings } from "./ResetSettings";
import { Setting, SettingTrigger } from "./Settings";
import { LegacyStorage } from "./SettingsStorage";
import { TimeSkipSettings } from "./TimeSkipSettings";

export type CycleIndices = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type TimeControlItem = "accelerateTime" | "reset" | "timeSkip";

export class TimeControlSettings extends Setting {
  accelerateTime: SettingTrigger;
  timeSkip: TimeSkipSettings;
  reset: ResetSettings;

  constructor(
    enabled = false,
    accelerateTime = new SettingTrigger(true, 1),
    reset = new ResetSettings(),
    timeSkip = new TimeSkipSettings()
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

  static fromLegacyOptions(subject: LegacyStorage) {
    const options = new TimeControlSettings();
    options.enabled = subject.toggles.timeCtrl;

    options.accelerateTime.enabled =
      subject.items["toggle-accelerateTime"] ?? options.accelerateTime.enabled;
    options.accelerateTime.trigger =
      subject.items["set-accelerateTime-trigger"] ?? options.accelerateTime.trigger;

    options.reset = ResetSettings.fromLegacyOptions(subject);
    options.timeSkip = TimeSkipSettings.fromLegacyOptions(subject);

    return options;
  }
}
