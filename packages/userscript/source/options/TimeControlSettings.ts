import { ResetBonfireSettings } from "./ResetBonfireSettings";
import { ResetReligionSettings } from "./ResetReligionSettings";
import { ResetResourcesSettings } from "./ResetResourcesSettings";
import { ResetSpaceSettings } from "./ResetSpaceSettings";
import { ResetTimeSettings } from "./ResetTimeSettings";
import { Setting, SettingTrigger } from "./Settings";
import { KittenStorageType } from "./SettingsStorage";
import { TimeSkipSettings } from "./TimeSkipSettings";

export type CycleIndices = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type TimeControlItem = "accelerateTime" | "reset" | "timeSkip";

export class TimeControlSettings extends Setting {
  bonfireBuildings: ResetBonfireSettings;
  religionItems: ResetReligionSettings;
  spaceItems: ResetSpaceSettings;
  timeItems: ResetTimeSettings;
  resources: ResetResourcesSettings;

  accelerateTime: SettingTrigger;
  timeSkip: TimeSkipSettings;
  reset: Setting;

  constructor(
    enabled = false,
    buildItems = new ResetBonfireSettings(),
    religionItems = new ResetReligionSettings(),
    spaceItems = new ResetSpaceSettings(),
    timeItems = new ResetTimeSettings(),
    resources = new ResetResourcesSettings(),
    accelerateTime = new SettingTrigger("accelerateTime", true, 1),
    timeSkip = new TimeSkipSettings(),
    reset = new Setting("reset", false)
  ) {
    super("timeControl", enabled);
    this.bonfireBuildings = buildItems;
    this.religionItems = religionItems;
    this.spaceItems = spaceItems;
    this.timeItems = timeItems;
    this.resources = resources;
    this.accelerateTime = accelerateTime;
    this.timeSkip = timeSkip;
    this.reset = reset;
  }

  load(settings: TimeControlSettings) {
    this.enabled = settings.enabled;

    this.accelerateTime.enabled = settings.accelerateTime.enabled;
    this.reset.enabled = settings.reset.enabled;

    this.accelerateTime.trigger = settings.accelerateTime.trigger;

    this.timeSkip.load(settings.timeSkip);
    this.bonfireBuildings.load(settings.bonfireBuildings);
    this.religionItems.load(settings.religionItems);
    this.spaceItems.load(settings.spaceItems);
    this.timeItems.load(settings.timeItems);

    this.resources.load(settings.resources);
  }

  static toLegacyOptions(settings: TimeControlSettings, subject: KittenStorageType) {
    subject.toggles.timeCtrl = settings.enabled;

    subject.items["toggle-accelerateTime"] = settings.accelerateTime.enabled;
    subject.items["set-accelerateTime-trigger"] = settings.accelerateTime.trigger;

    subject.items["toggle-reset"] = settings.reset.enabled;

    TimeSkipSettings.toLegacyOptions(settings.timeSkip, subject);
    ResetBonfireSettings.toLegacyOptions(settings.bonfireBuildings, subject);
    ResetReligionSettings.toLegacyOptions(settings.religionItems, subject);
    ResetSpaceSettings.toLegacyOptions(settings.spaceItems, subject);
    ResetTimeSettings.toLegacyOptions(settings.timeItems, subject);

    ResetResourcesSettings.toLegacyOptions(settings.resources, subject);
  }

  static fromLegacyOptions(subject: KittenStorageType) {
    const options = new TimeControlSettings();
    options.enabled = subject.toggles.timeCtrl;

    options.accelerateTime.enabled =
      subject.items["toggle-accelerateTime"] ?? options.accelerateTime.enabled;
    options.timeSkip.enabled = subject.items["toggle-timeSkip"] ?? options.timeSkip.enabled;
    options.reset.enabled = subject.items["toggle-reset"] ?? options.reset.enabled;

    options.accelerateTime.trigger =
      subject.items["set-accelerateTime-trigger"] ?? options.accelerateTime.trigger;

    options.timeSkip = TimeSkipSettings.fromLegacyOptions(subject);
    options.bonfireBuildings = ResetBonfireSettings.fromLegacyOptions(subject);
    options.religionItems = ResetReligionSettings.fromLegacyOptions(subject);
    options.spaceItems = ResetSpaceSettings.fromLegacyOptions(subject);
    options.timeItems = ResetTimeSettings.fromLegacyOptions(subject);

    options.resources = ResetResourcesSettings.fromLegacyOptions(subject);

    return options;
  }
}
