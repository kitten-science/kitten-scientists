import { objectEntries } from "../tools/Entries";
import { Job } from "../types";
import { SettingsSection, SettingToggle } from "./SettingsSection";
import { KittenStorageType } from "./SettingsStorage";

export type DistributeItems = Job;
export type DistributeSettingsItem = SettingToggle & {
  limited: boolean;
  $limited?: JQuery<HTMLElement>;

  max: number;
  $max?: JQuery<HTMLElement>;
};
export class DistributeSettings extends SettingsSection {
  items: {
    [item in DistributeItems]: DistributeSettingsItem;
  } = {
    woodcutter: { enabled: true, limited: true, max: 1 },
    farmer: { enabled: true, limited: true, max: 1 },
    scholar: { enabled: true, limited: true, max: 1 },
    hunter: { enabled: true, limited: true, max: 1 },
    miner: { enabled: true, limited: true, max: 1 },
    priest: { enabled: true, limited: true, max: 1 },
    geologist: { enabled: true, limited: true, max: 1 },
    engineer: { enabled: true, limited: true, max: 1 },
  };

  static toLegacyOptions(settings: DistributeSettings, subject: KittenStorageType) {
    subject.toggles.distribute = settings.enabled;

    for (const [name, item] of objectEntries(settings.items)) {
      subject.items[`toggle-${name}` as const] = item.enabled;
      subject.items[`toggle-limited-${name}` as const] = item.limited;
      subject.items[`set-${name}-max` as const] = item.max;
    }
  }

  static fromLegacyOptions(subject: KittenStorageType) {
    const options = new DistributeSettings();
    options.enabled = subject.toggles.distribute;

    for (const [name, item] of objectEntries(options.items)) {
      item.enabled = subject.items[`toggle-${name}` as const] ?? item.enabled;
      item.limited = subject.items[`toggle-limited-${name}` as const] ?? item.limited;
      item.max = subject.items[`set-${name}-max` as const] ?? item.max;
    }
    return options;
  }
}
