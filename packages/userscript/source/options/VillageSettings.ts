import { objectEntries } from "../tools/Entries";
import { Job } from "../types";
import { Setting, SettingMax, SettingTrigger } from "./Settings";
import { SettingsSection } from "./SettingsSection";
import { KittenStorageType } from "./SettingsStorage";

export type VillageSettingsItems = {
  [item in Job]: SettingMax;
};

export class VillageSettings extends SettingsSection {
  items: VillageSettingsItems = {
    woodcutter: new SettingMax(true, 1),
    farmer: new SettingMax(true, 1),
    scholar: new SettingMax(true, 1),
    hunter: new SettingMax(true, 1),
    miner: new SettingMax(true, 1),
    priest: new SettingMax(true, 1),
    geologist: new SettingMax(true, 1),
    engineer: new SettingMax(true, 1),
  };

  holdFestivals: Setting;
  hunt: SettingTrigger;
  promoteLeader: Setting;

  constructor(
    enabled = false,
    items: VillageSettingsItems = {
      woodcutter: new SettingMax(true, 1),
      farmer: new SettingMax(true, 1),
      scholar: new SettingMax(true, 1),
      hunter: new SettingMax(true, 1),
      miner: new SettingMax(true, 1),
      priest: new SettingMax(true, 1),
      geologist: new SettingMax(true, 1),
      engineer: new SettingMax(true, 1),
    },
    holdFestivals = new Setting(true),
    hunt = new SettingTrigger(true, 0.98),
    promoteLeader = new Setting(true)
  ) {
    super(enabled);
    this.items = items;
    this.holdFestivals = holdFestivals;
    this.hunt = hunt;
    this.promoteLeader = promoteLeader;
  }

  static toLegacyOptions(settings: VillageSettings, subject: KittenStorageType) {
    subject.toggles.distribute = settings.enabled;

    for (const [name, item] of objectEntries(settings.items)) {
      subject.items[`toggle-${name}` as const] = item.enabled;
      subject.items[`set-${name}-max` as const] = item.max;
    }

    subject.items["toggle-festival"] = settings.holdFestivals.enabled;
    subject.items["toggle-hunt"] = settings.hunt.enabled;
    subject.items["toggle-promote"] = settings.promoteLeader.enabled;
  }

  static fromLegacyOptions(subject: KittenStorageType) {
    const options = new VillageSettings();
    options.enabled = subject.toggles.distribute;

    for (const [name, item] of objectEntries(options.items)) {
      item.enabled = subject.items[`toggle-${name}` as const] ?? item.enabled;
      item.max = subject.items[`set-${name}-max` as const] ?? item.max;
    }

    options.holdFestivals.enabled =
      subject.items["toggle-festival"] ?? options.holdFestivals.enabled;
    options.hunt.enabled = subject.items["toggle-hunt"] ?? options.hunt.enabled;
    options.promoteLeader.enabled =
      subject.items["toggle-promote"] ?? options.promoteLeader.enabled;

    return options;
  }
}
