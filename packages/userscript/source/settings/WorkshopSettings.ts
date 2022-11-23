import { consumeEntriesPedantic, objectEntries } from "../tools/Entries";
import { isNil, Maybe } from "../tools/Maybe";
import { GamePage, ResourceCraftable } from "../types";
import { Requirement, Setting, SettingLimitedMax, SettingTrigger } from "./Settings";
import { LegacyStorage } from "./SettingsStorage";
import { UpgradeSettings } from "./UpgradeSettings";

export class CraftSettingsItem extends SettingLimitedMax {
  readonly resource: ResourceCraftable;
  require: Requirement;

  constructor(
    resource: ResourceCraftable,
    require: Requirement = false,
    enabled = true,
    limited = true
  ) {
    super(enabled, limited);
    this.resource = resource;
    this.require = require;
  }
}

export type WorkshopResourceSettings = Record<ResourceCraftable, CraftSettingsItem>;

export class WorkshopSettings extends SettingTrigger {
  resources: WorkshopResourceSettings;

  shipOverride: Setting;
  unlockUpgrades: UpgradeSettings;

  constructor(
    enabled = false,
    trigger = 0.95,
    resources: WorkshopResourceSettings = {
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
    unlockUpgrades = new UpgradeSettings(),
    shipOverride = new Setting(true)
  ) {
    super(enabled, trigger);
    this.resources = resources;
    this.shipOverride = shipOverride;
    this.unlockUpgrades = unlockUpgrades;
  }

  static validateGame(game: GamePage, settings: WorkshopSettings) {
    UpgradeSettings.validateGame(game, settings.unlockUpgrades);
  }

  load(settings: Maybe<Partial<WorkshopSettings>>) {
    if (isNil(settings)) {
      return;
    }

    super.load(settings);

    consumeEntriesPedantic(this.resources, settings.resources, (resource, item) => {
      resource.enabled = item?.enabled ?? resource.enabled;
      resource.limited = item?.limited ?? resource.limited;
      resource.max = item?.max ?? resource.max;
    });

    this.unlockUpgrades.load(settings.unlockUpgrades);

    this.shipOverride.enabled = settings.shipOverride?.enabled ?? this.shipOverride.enabled;
  }

  static fromLegacyOptions(subject: LegacyStorage) {
    const options = new WorkshopSettings();
    options.enabled = subject.toggles.craft;
    options.trigger = subject.triggers.craft;

    for (const [name, item] of objectEntries(options.resources)) {
      item.enabled = subject.items[`toggle-${name}` as const] ?? item.enabled;
      item.limited = subject.items[`toggle-limited-${name}` as const] ?? item.limited;
      item.max = subject.items[`set-${name}-craft-max` as const] ?? item.max;
    }

    options.unlockUpgrades = UpgradeSettings.fromLegacyOptions(subject);

    options.shipOverride.enabled =
      subject.items["toggle-shipOverride"] ?? options.shipOverride.enabled;

    return options;
  }
}
