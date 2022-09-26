import { objectEntries } from "../tools/Entries";
import { ChronoForgeUpgrades, TimeItemVariant, VoidSpaceUpgrades } from "../types";
import { Requirement } from "./Options";
import { Setting } from "./Settings";
import { SettingsSectionTrigger } from "./SettingsSection";
import { KittenStorageType } from "./SettingsStorage";

/**
 * The upgrades on the Time tab that we have options for.
 */
export type TimeItem = Exclude<ChronoForgeUpgrades | VoidSpaceUpgrades, "usedCryochambers">;
export class TimeSettingsItem extends Setting {
  require: Requirement;

  variant: TimeItemVariant;

  constructor(variant: TimeItemVariant, require: Requirement = false, enabled = false) {
    super(enabled);

    this.require = require;
    this.variant = variant;
  }
}

export type TimeSettingsItems = {
  [item in TimeItem]: TimeSettingsItem;
};

export class TimeSettings extends SettingsSectionTrigger {
  items: TimeSettingsItems;

  constructor(
    enabled = false,
    trigger = 1,
    items: TimeSettingsItems = {
      temporalBattery: new TimeSettingsItem(TimeItemVariant.Chronoforge),
      blastFurnace: new TimeSettingsItem(TimeItemVariant.Chronoforge),
      timeBoiler: new TimeSettingsItem(TimeItemVariant.Chronoforge),
      temporalAccelerator: new TimeSettingsItem(TimeItemVariant.Chronoforge),
      temporalImpedance: new TimeSettingsItem(TimeItemVariant.Chronoforge),
      ressourceRetrieval: new TimeSettingsItem(TimeItemVariant.Chronoforge),

      cryochambers: new TimeSettingsItem(TimeItemVariant.VoidSpace),
      voidHoover: new TimeSettingsItem(TimeItemVariant.VoidSpace, "antimatter"),
      voidRift: new TimeSettingsItem(TimeItemVariant.VoidSpace),
      chronocontrol: new TimeSettingsItem(TimeItemVariant.VoidSpace, "temporalFlux"),
      voidResonator: new TimeSettingsItem(TimeItemVariant.VoidSpace),
    }
  ) {
    super(enabled, trigger);
    this.items = items;
  }

  static toLegacyOptions(settings: TimeSettings, subject: KittenStorageType) {
    subject.toggles.time = settings.enabled;
    subject.triggers.time = settings.trigger;

    for (const [name, item] of objectEntries(settings.items)) {
      subject.items[`toggle-${name}` as const] = item.enabled;
    }
  }

  static fromLegacyOptions(subject: KittenStorageType) {
    const options = new TimeSettings();
    options.enabled = subject.toggles.time;
    options.trigger = subject.triggers.time;

    for (const [name, item] of objectEntries(options.items)) {
      item.enabled = subject.items[`toggle-${name}` as const] ?? item.enabled;
    }
    return options;
  }
}
