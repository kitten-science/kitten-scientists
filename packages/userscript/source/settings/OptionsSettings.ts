import { objectEntries } from "../tools/Entries";
import { Setting, SettingTrigger } from "./Settings";
import { LegacyStorage } from "./SettingsStorage";

export type OptionsItem = "observe";

export class OptionsSettingsItem extends SettingTrigger {}

export class OptionsSettings extends Setting {
  readonly items: {
    [key in OptionsItem]: OptionsSettingsItem;
  };

  constructor(enabled = false, observe = new OptionsSettingsItem(true)) {
    super(enabled);
    this.items = { observe };
  }

  load(settings: OptionsSettings) {
    this.enabled = settings.enabled;

    for (const [name, item] of objectEntries(settings.items)) {
      this.items[name].enabled = item.enabled;
      this.items[name].trigger = item.trigger;
    }
  }

  static toLegacyOptions(settings: OptionsSettings, subject: LegacyStorage) {
    for (const [name, item] of objectEntries(settings.items)) {
      subject.items[`toggle-${name}` as const] = item.enabled;
      subject.items[`set-${name}-trigger` as const] = item.trigger;
    }
  }

  static fromLegacyOptions(subject: LegacyStorage) {
    const options = new OptionsSettings();
    options.enabled = subject.toggles.options;
    for (const [name, item] of objectEntries(options.items)) {
      item.enabled = subject.items[`toggle-${name}` as const] ?? item.enabled;
      item.trigger = subject.items[`set-${name}-trigger` as const] ?? item.trigger;
    }
    return options;
  }
}
