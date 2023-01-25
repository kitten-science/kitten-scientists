import { consumeEntriesPedantic } from "../tools/Entries";
import { isNil, Maybe } from "../tools/Maybe";
import { GamePage, ResourceCraftable } from "../types";
import { Setting, SettingLimitedMax, SettingTrigger } from "./Settings";
import { UpgradeSettings } from "./UpgradeSettings";

export class CraftSettingsItem extends SettingLimitedMax {
  readonly resource: ResourceCraftable;

  constructor(resource: ResourceCraftable, enabled = true, limited = true) {
    super(enabled, limited);
    this.resource = resource;
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
      alloy: new CraftSettingsItem("alloy"),
      beam: new CraftSettingsItem("beam"),
      blueprint: new CraftSettingsItem("blueprint"),
      compedium: new CraftSettingsItem("compedium"),
      concrate: new CraftSettingsItem("concrate"),
      eludium: new CraftSettingsItem("eludium"),
      gear: new CraftSettingsItem("gear"),
      kerosene: new CraftSettingsItem("kerosene"),
      manuscript: new CraftSettingsItem("manuscript"),
      megalith: new CraftSettingsItem("megalith"),
      parchment: new CraftSettingsItem("parchment", true, false),
      plate: new CraftSettingsItem("plate"),
      scaffold: new CraftSettingsItem("scaffold"),
      ship: new CraftSettingsItem("ship"),
      slab: new CraftSettingsItem("slab"),
      steel: new CraftSettingsItem("steel"),
      tanker: new CraftSettingsItem("tanker"),
      thorium: new CraftSettingsItem("thorium"),
      wood: new CraftSettingsItem("wood"),
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
}
