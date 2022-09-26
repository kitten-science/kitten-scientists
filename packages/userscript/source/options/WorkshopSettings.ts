import { objectEntries } from "../tools/Entries";
import { GamePage, ResourceCraftable } from "../types";
import { Requirement } from "./Options";
import { ResourceSettings, ResourcesSettingsItem } from "./ResourcesSettings";
import { SettingLimitedMax } from "./Settings";
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

export type CraftAdditionSettings = {
  unlockUpgrades: UpgradeSettings;
};

export type WorkshopSettingsItems = {
  [item in ResourceCraftable]: CraftSettingsItem;
};

export class WorkshopSettings extends SettingsSectionTrigger {
  addition: CraftAdditionSettings = {
    unlockUpgrades: new UpgradeSettings(),
  };

  items: WorkshopSettingsItems;

  resources: ResourceSettings;

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
    unlockUpgrades = new UpgradeSettings()
  ) {
    super(enabled, trigger);
    this.items = items;
    this.resources = resources;
    this.addition.unlockUpgrades = unlockUpgrades;
  }

  static validateGame(game: GamePage, settings: WorkshopSettings) {
    UpgradeSettings.validateGame(game, settings.addition.unlockUpgrades);
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

    subject.items["toggle-upgrades"] = settings.addition.unlockUpgrades.enabled;
    for (const [name, item] of objectEntries(settings.addition.unlockUpgrades.items)) {
      subject.items[`toggle-upgrade-${name}` as const] = item.enabled;
    }
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

    options.addition.unlockUpgrades.enabled =
      subject.items["toggle-upgrades"] ?? options.addition.unlockUpgrades.enabled;
    for (const [name, item] of objectEntries(options.addition.unlockUpgrades.items)) {
      item.enabled = subject.items[`toggle-upgrade-${name}` as const] ?? item.enabled;
    }

    return options;
  }
}
