import { objectEntries } from "../tools/Entries";
import { GamePage, ResourceCraftable } from "../types";
import { ResourceSettings, ResourcesSettingsItem } from "./ResourcesSettings";
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

  constructor(require: Requirement = false, enabled = true, limited = true) {
    super(enabled, limited);
    this.require = require;
  }
}

export type WorkshopSettingsItems = {
  [item in ResourceCraftable]: CraftSettingsItem;
};

export class WorkshopSettings extends SettingsSectionTrigger {
  items: WorkshopSettingsItems;
  resources: ResourceSettings;

  shipOverride: Setting;
  unlockUpgrades: UpgradeSettings;

  constructor(
    enabled = false,
    trigger = 0.95,
    items: WorkshopSettingsItems = {
      wood: new CraftSettingsItem("catnip"),
      beam: new CraftSettingsItem("wood"),
      slab: new CraftSettingsItem("minerals"),
      steel: new CraftSettingsItem("coal"),
      plate: new CraftSettingsItem("iron"),
      alloy: new CraftSettingsItem("titanium"),
      concrate: new CraftSettingsItem(false),
      gear: new CraftSettingsItem(false),
      scaffold: new CraftSettingsItem(false),
      ship: new CraftSettingsItem(false),
      tanker: new CraftSettingsItem(false),
      parchment: new CraftSettingsItem(false, true, false),
      manuscript: new CraftSettingsItem("culture"),
      compedium: new CraftSettingsItem("science"),
      blueprint: new CraftSettingsItem("science"),
      kerosene: new CraftSettingsItem("oil"),
      megalith: new CraftSettingsItem(false),
      eludium: new CraftSettingsItem("unobtainium"),
      thorium: new CraftSettingsItem("uranium"),
    },
    resources: ResourceSettings = {
      furs: new ResourcesSettingsItem(true, undefined, 1000),
    },
    unlockUpgrades = new UpgradeSettings(),
    shipOverride = new Setting(true)
  ) {
    super(enabled, trigger);
    this.items = items;
    this.resources = resources;
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

    this.resources = {};
    for (const [name, item] of objectEntries(settings.resources)) {
      this.resources[name] = new ResourcesSettingsItem(item.enabled, item.consume, item.stock);
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

    for (const [name, item] of objectEntries(settings.resources)) {
      subject.resources[name] = {
        checkForReset: false,
        stockForReset: 0,
        consume: item.consume,
        enabled: item.enabled,
        stock: item.stock,
      };
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

    options.resources = {};
    for (const [name, item] of objectEntries(subject.resources)) {
      if (item.checkForReset) {
        continue;
      }

      options.resources[name] = new ResourcesSettingsItem(item.enabled, item.consume, item.stock);
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
