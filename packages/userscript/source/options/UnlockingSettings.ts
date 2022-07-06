import { objectEntries } from "../tools/Entries";
import { PolicySettings } from "./PolicySettings";
import { SettingsSection, SettingToggle } from "./SettingsSection";
import { KittenStorageType } from "./SettingsStorage";

export type UnlockItem = "missions" | "policies" | "techs" | "upgrades";
export type UnlockingSettingsItem = SettingToggle | PolicySettings;

export class UnlockingSettings extends SettingsSection {
  items: {
    [key in UnlockItem]: UnlockingSettingsItem;
  } = {
    upgrades: { enabled: true },
    techs: { enabled: true },
    policies: new PolicySettings(),
    missions: { enabled: true },
  };

  static fromLegacyOptions(subject: KittenStorageType) {
    const options = new UnlockingSettings();
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
