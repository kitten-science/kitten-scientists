import { objectEntries } from "../tools/Entries";
import { SettingsSection, SettingToggle, SettingTrigger } from "./SettingsSection";
import { KittenStorageType } from "./SettingsStorage";

export type OptionsItem = "autofeed" | "crypto" | "fixCry" | "observe" | "shipOverride";

export type OptionsSettingsItem = SettingToggle & Partial<SettingTrigger>;
export class OptionsSettings extends SettingsSection {
  items: {
    [key in OptionsItem]: OptionsSettingsItem;
  } = {
    observe: { enabled: true },
    shipOverride: { enabled: true },
    autofeed: { enabled: true },

    crypto: { enabled: true, trigger: 10000 },
    fixCry: { enabled: false },
  };

  static fromLegacyOptions(subject: KittenStorageType) {
    const options = new OptionsSettings();
    options.enabled = subject.toggles.options;
    for (const [name, item] of objectEntries(options.items)) {
      item.enabled = subject.items[`toggle-${name}` as const] ?? item.enabled;
      item.trigger = subject.items[`set-${name}-trigger` as const] ?? item.trigger;
    }
    return options;
  }
}
