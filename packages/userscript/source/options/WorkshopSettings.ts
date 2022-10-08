import { objectEntries } from "../tools/Entries";
import { GamePage, ResourceCraftable } from "../types";
import { Requirement, Setting, SettingLimitedMax } from "./Settings";
import { SettingsSectionTrigger } from "./SettingsSection";
import { KittenStorageType } from "./SettingsStorage";
import { UpgradeSettings } from "./UpgradeSettings";

export class CraftSettingsItem extends SettingLimitedMax {
  /**
   * Meaning still unclear.
   * This is hardcoded to `0.5` right now.
   */
  limRat = 0.5;

  require: Requirement;

  constructor(id: string, require: Requirement = false, enabled = true, limited = true) {
    super(id, enabled, limited);
    this.require = require;
  }
}

export type WorkshopSettingsItems = {
  [item in ResourceCraftable]: CraftSettingsItem;
};

export class WorkshopSettings extends SettingsSectionTrigger {
  items: WorkshopSettingsItems;

  shipOverride: Setting;
  unlockUpgrades: UpgradeSettings;

  constructor(
    enabled = false,
    trigger = 0.95,
    items: WorkshopSettingsItems = {
      alloy: new CraftSettingsItem("alloy", "titanium"),
      beam: new CraftSettingsItem("beam", "wood"),
      blueprint: new CraftSettingsItem("blueprint", "science"),
      compedium: new CraftSettingsItem("compedium", "science"),
      concrate: new CraftSettingsItem("concrate", false),
      eludium: new CraftSettingsItem("eludium", "unobtainium"),
      gear: new CraftSettingsItem("gear", false),
      kerosene: new CraftSettingsItem("kerosene", "oil"),
      manuscript: new CraftSettingsItem("manuscript", "culture"),
      megalith: new CraftSettingsItem("megalith", false),
      parchment: new CraftSettingsItem("parchment", false, true, false),
      plate: new CraftSettingsItem("plate", "iron"),
      scaffold: new CraftSettingsItem("scaffold", false),
      ship: new CraftSettingsItem("ship", false),
      slab: new CraftSettingsItem("slab", "minerals"),
      steel: new CraftSettingsItem("steel", "coal"),
      tanker: new CraftSettingsItem("tanker", false),
      thorium: new CraftSettingsItem("thorium", "uranium"),
      wood: new CraftSettingsItem("wood", "catnip"),
    },
    unlockUpgrades = new UpgradeSettings("unlockUpgrades"),
    shipOverride = new Setting("shipOverride", true)
  ) {
    super("workshop", enabled, trigger);
    this.items = items;
    this.shipOverride = shipOverride;
    this.unlockUpgrades = unlockUpgrades;
  }

  static validateGame(game: GamePage, settings: WorkshopSettings) {
    UpgradeSettings.validateGame(game, settings.unlockUpgrades);
  }

  load(settings: WorkshopSettings) {
    this.enabled = settings.enabled;

    for (const [name, item] of objectEntries(settings.items)) {
      this.items[name].enabled = item.enabled;
      this.items[name].limited = item.limited;
      this.items[name].max = item.max;
    }

    this.unlockUpgrades.enabled = settings.unlockUpgrades.enabled;
    for (const [name, item] of objectEntries(settings.unlockUpgrades.items)) {
      this.unlockUpgrades.items[name].enabled = item.enabled;
    }

    this.shipOverride.enabled = settings.shipOverride.enabled;
  }

  static toLegacyOptions(settings: WorkshopSettings, subject: KittenStorageType) {
    subject.toggles.craft = settings.enabled;
    subject.triggers.craft = settings.trigger;

    for (const [name, item] of objectEntries(settings.items)) {
      subject.items[`toggle-${name}` as const] = item.enabled;
      subject.items[`toggle-limited-${name}` as const] = item.limited;
    }

    subject.items["toggle-upgrades"] = settings.unlockUpgrades.enabled;
    for (const [name, item] of objectEntries(settings.unlockUpgrades.items)) {
      subject.items[`toggle-upgrade-${name}` as const] = item.enabled;
    }

    subject.items["toggle-shipOverride"] = settings.shipOverride.enabled;
  }

  static fromLegacyOptions(subject: KittenStorageType) {
    const options = new WorkshopSettings();
    options.enabled = subject.toggles.craft;
    options.trigger = subject.triggers.craft;

    for (const [name, item] of objectEntries(options.items)) {
      item.enabled = subject.items[`toggle-${name}` as const] ?? item.enabled;
      item.limited = subject.items[`toggle-limited-${name}` as const] ?? item.limited;
    }

    options.unlockUpgrades.enabled =
      subject.items["toggle-upgrades"] ?? options.unlockUpgrades.enabled;
    for (const [name, item] of objectEntries(options.unlockUpgrades.items)) {
      item.enabled = subject.items[`toggle-upgrade-${name}` as const] ?? item.enabled;
    }

    options.shipOverride.enabled =
      subject.items["toggle-shipOverride"] ?? options.shipOverride.enabled;

    return options;
  }
}
