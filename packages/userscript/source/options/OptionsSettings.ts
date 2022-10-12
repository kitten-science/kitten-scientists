import { objectEntries } from "../tools/Entries";
import { Setting, SettingTrigger } from "./Settings";
import { LegacyStorage } from "./SettingsStorage";

export type OptionsItem = "autofeed" | "crypto" | "fixCry" | "observe";

export class OptionsSettingsItem extends SettingTrigger {}

export class OptionsSettings extends Setting {
  readonly items: {
    [key in OptionsItem]: OptionsSettingsItem;
  };

  constructor(
    enabled = false,
    observe = new OptionsSettingsItem(true),
    autofeed = new OptionsSettingsItem(true),
    crypto = new OptionsSettingsItem(true, 10000),
    fixCry = new OptionsSettingsItem(false)
  ) {
    super(enabled);
    this.items = { autofeed, crypto, fixCry, observe };
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
