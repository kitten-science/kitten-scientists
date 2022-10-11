import { ResetSettings } from "./ResetSettings";
import { Setting, SettingTrigger } from "./Settings";
import { KittenStorageType } from "./SettingsStorage";
import { TimeSkipSettings } from "./TimeSkipSettings";

export type CycleIndices = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type TimeControlItem = "accelerateTime" | "reset" | "timeSkip";

export class TimeControlSettings extends Setting {
  accelerateTime: SettingTrigger;
  timeSkip: TimeSkipSettings;
  reset: ResetSettings;

  constructor(
    enabled = false,
    accelerateTime = new SettingTrigger("accelerateTime", true, 1),
    reset = new ResetSettings(),
    timeSkip = new TimeSkipSettings()
  ) {
    super("timeControl", enabled);
    this.accelerateTime = accelerateTime;
    this.reset = reset;
    this.timeSkip = timeSkip;
  }

  load(settings: TimeControlSettings) {
    this.enabled = settings.enabled;

    this.accelerateTime.enabled = settings.accelerateTime.enabled;
    this.reset.enabled = settings.reset.enabled;

    this.accelerateTime.trigger = settings.accelerateTime.trigger;
    this.reset.load(settings.reset);
    this.timeSkip.load(settings.timeSkip);
  }

  static toLegacyOptions(settings: TimeControlSettings, subject: KittenStorageType) {
    subject.toggles.timeCtrl = settings.enabled;

    subject.items["toggle-accelerateTime"] = settings.accelerateTime.enabled;
    subject.items["set-accelerateTime-trigger"] = settings.accelerateTime.trigger;

    ResetSettings.toLegacyOptions(settings.reset, subject);
    TimeSkipSettings.toLegacyOptions(settings.timeSkip, subject);
  }

  static fromLegacyOptions(subject: KittenStorageType) {
    const options = new TimeControlSettings();
    options.enabled = subject.toggles.timeCtrl;

    options.accelerateTime.enabled =
      subject.items["toggle-accelerateTime"] ?? options.accelerateTime.enabled;
    options.timeSkip.enabled = subject.items["toggle-timeSkip"] ?? options.timeSkip.enabled;

    options.accelerateTime.trigger =
      subject.items["set-accelerateTime-trigger"] ?? options.accelerateTime.trigger;

    options.reset = ResetSettings.fromLegacyOptions(subject);
    options.timeSkip = TimeSkipSettings.fromLegacyOptions(subject);

    return options;
  }
}
