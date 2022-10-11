import { objectEntries } from "../tools/Entries";
import { Race } from "../types";
import { SettingMax, SettingTrigger } from "./Settings";
import { KittenStorageType } from "./SettingsStorage";

export class EmbassySettings extends SettingTrigger {
  items: {
    [item in Race]: SettingMax;
  };

  constructor(
    enabled = false,
    items = {
      dragons: new SettingMax("dragons", true),
      griffins: new SettingMax("griffins", true),
      leviathans: new SettingMax("leviathans", true),
      lizards: new SettingMax("lizards", true),
      nagas: new SettingMax("nagas", true),
      sharks: new SettingMax("sharks", true),
      spiders: new SettingMax("spiders", true),
      zebras: new SettingMax("zebras", true),
    }
  ) {
    super("embassies", enabled);
    this.items = items;
  }

  load(settings: EmbassySettings) {
    this.enabled = settings.enabled;

    for (const [name, item] of objectEntries(settings.items)) {
      this.items[name].enabled = item.enabled;
      this.items[name].max = item.max;
    }
  }

  static toLegacyOptions(settings: EmbassySettings, subject: KittenStorageType) {
    subject.items["toggle-buildEmbassies"] = settings.enabled;

    for (const [name, item] of objectEntries(settings.items)) {
      subject.items[`toggle-build-${name}` as const] = item.enabled;
      subject.items[`set-build-${name}-max` as const] = item.max;
    }
  }

  static fromLegacyOptions(subject: KittenStorageType) {
    const options = new EmbassySettings();
    options.enabled = subject.items["toggle-buildEmbassies"] ?? options.enabled;

    for (const [name, item] of objectEntries(options.items)) {
      item.enabled = subject.items[`toggle-build-${name}` as const] ?? item.enabled;
      item.max = subject.items[`set-build-${name}-max` as const] ?? item.max;
    }

    return options;
  }
}
