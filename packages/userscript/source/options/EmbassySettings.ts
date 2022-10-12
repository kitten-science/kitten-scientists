import { objectEntries } from "../tools/Entries";
import { Race } from "../types";
import { SettingMax, SettingTrigger } from "./Settings";
import { KittenStorageType } from "./SettingsStorage";

export class EmbassySetting extends SettingMax {
  readonly race: Race;

  constructor(race: Race, enabled = false) {
    super(enabled);
    this.race = race;
  }
}

export class EmbassySettings extends SettingTrigger {
  items: {
    [item in Race]: SettingMax;
  };

  constructor(
    enabled = false,
    items = {
      dragons: new EmbassySetting("dragons", true),
      griffins: new EmbassySetting("griffins", true),
      leviathans: new EmbassySetting("leviathans", true),
      lizards: new EmbassySetting("lizards", true),
      nagas: new EmbassySetting("nagas", true),
      sharks: new EmbassySetting("sharks", true),
      spiders: new EmbassySetting("spiders", true),
      zebras: new EmbassySetting("zebras", true),
    }
  ) {
    super(enabled);
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
