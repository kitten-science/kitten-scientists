import { objectEntries } from "../tools/Entries";
import { PolicySettings } from "./PolicySettings";
import { SettingsSection, SettingToggle } from "./SettingsSection";
import { KittenStorageType } from "./SettingsStorage";

export type ScienceItem = "policies" | "techs";
export type ScienceSettingsItem = SettingToggle | PolicySettings;

export class ScienceSettings extends SettingsSection {
  items: {
    [key in ScienceItem]: ScienceSettingsItem;
  } = {
    techs: { enabled: true },
    policies: new PolicySettings(),
  };

  static fromLegacyOptions(subject: KittenStorageType) {
    const options = new ScienceSettings();
    options.enabled = subject.toggles.upgrade;
    for (const [name, item] of objectEntries(options.items)) {
      item.enabled = subject.items[`toggle-${name}` as const] ?? item.enabled;
    }
    for (const [name, item] of objectEntries((options.items.policies as PolicySettings).items)) {
      item.enabled = subject.items[`toggle-${name}` as const] ?? item.enabled;
    }
    return options;
  }
}
