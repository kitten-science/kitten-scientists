import { objectEntries } from "../tools/Entries";
import { SettingsSection, SettingToggle } from "./SettingsSection";
import { KittenStorageType } from "./SettingsStorage";

export type OptionsItem = "autofeed" | "crypto" | "fixCry" | "observe" | "shipOverride";

export type OptionsSettingsItem = SettingToggle & {
  subTrigger?: number;
  $subTrigger?: JQuery<HTMLElement>;
};
export class OptionsSettings extends SettingsSection {
  items: {
    [key in OptionsItem]: OptionsSettingsItem;
  } = {
    observe: { enabled: true },
    shipOverride: { enabled: true },
    autofeed: { enabled: true },

    crypto: { enabled: true, subTrigger: 10000 },
    fixCry: { enabled: false },
  };

  static fromLegacyOptions(subject: KittenStorageType) {
    const options = new OptionsSettings();
    options.enabled = subject.toggles.options;
    for (const [name, item] of objectEntries(options.items)) {
      item.enabled = subject.items[`toggle-${name}` as const] ?? item.enabled;
      item.subTrigger = subject.items[`set-${name}-subTrigger` as const] ?? item.subTrigger;
    }
    return options;
  }
}
