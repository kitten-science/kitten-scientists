import { objectEntries } from "../tools/Entries";
import { Job } from "../types";
import { Setting, SettingMax, SettingTrigger } from "./Settings";
import { SettingsSection } from "./SettingsSection";
import { KittenStorageType } from "./SettingsStorage";

export class VillageAdditionSettings {
  holdFestivals = new Setting(true);
  hunt = new SettingTrigger(true, 0.98);
  promoteLeader = new Setting(true);
}

export type VillageSettingsItems = {
  [item in Job]: SettingMax;
};

export class VillageSettings extends SettingsSection {
  addition = new VillageAdditionSettings();

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
    this.addition.holdFestivals = holdFestivals;
    this.addition.hunt = hunt;
    this.addition.promoteLeader = promoteLeader;
  }

  static toLegacyOptions(settings: VillageSettings, subject: KittenStorageType) {
    subject.toggles.distribute = settings.enabled;

    for (const [name, item] of objectEntries(settings.items)) {
      subject.items[`toggle-${name}` as const] = item.enabled;
      subject.items[`set-${name}-max` as const] = item.max;
    }

    subject.items["toggle-festival"] = settings.addition.holdFestivals.enabled;
    subject.items["toggle-hunt"] = settings.addition.hunt.enabled;
    subject.items["toggle-promote"] = settings.addition.promoteLeader.enabled;
  }

  static fromLegacyOptions(subject: KittenStorageType) {
    const options = new VillageSettings();
    options.enabled = subject.toggles.distribute;

    for (const [name, item] of objectEntries(options.items)) {
      item.enabled = subject.items[`toggle-${name}` as const] ?? item.enabled;
      item.max = subject.items[`set-${name}-max` as const] ?? item.max;
    }

    options.addition.holdFestivals.enabled =
      subject.items["toggle-festival"] ?? options.addition.holdFestivals.enabled;
    options.addition.hunt.enabled = subject.items["toggle-hunt"] ?? options.addition.hunt.enabled;
    options.addition.promoteLeader.enabled =
      subject.items["toggle-promote"] ?? options.addition.promoteLeader.enabled;

    return options;
  }
}
