import { objectEntries } from "../tools/Entries";
import { Building } from "../types";
import { BuildingUpgradeSettings } from "./BuildingUpgradeSettings";
import { Requirement, Setting, SettingMax } from "./Settings";
import { SettingsSectionTrigger } from "./SettingsSection";
import { KittenStorageType } from "./SettingsStorage";

/**
 * One of the building options in the KS menu.
 * These are not identical to `Building`!
 * `Building` is IDs of buildings as defined by KG. KS defines upgrade stages as well.
 */
export type BonfireItem = Building | "broadcastTower" | "dataCenter" | "hydroPlant" | "solarFarm";

export class BonfireSettingsItem extends SettingMax {
  /**
   * In case this is an upgrade of another building, this is the name of the
   * base building.
   */
  name: Building | undefined = undefined;

  /**
   * A resource that you must have unlocked to build this.
   */
  require: Requirement = false;

  /**
   * In case this is an upgradable building, this indicates the level of
   * the stage.
   */
  stage = 0;

  constructor(enabled = false, require: Requirement = false, max = -1, baseStage?: Building) {
    super(enabled, max);

    this.require = require;
    if (baseStage) {
      this.stage = 1;
      this.name = baseStage;
    }
  }
}

export type BonfirSettingsItems = {
  // unicornPasture is handled in the Religion section.
  [item in Exclude<BonfireItem, "unicornPasture">]: BonfireSettingsItem;
};

export class BonfireSettings extends SettingsSectionTrigger {
  items: BonfirSettingsItems;

  turnOnSteamworks: Setting;
  upgradeBuildings: BuildingUpgradeSettings;

  constructor(
    enabled = false,
    trigger = 0,
    items: BonfirSettingsItems = {
      hut: new BonfireSettingsItem(false, "wood"),
      logHouse: new BonfireSettingsItem(false, "minerals"),
      mansion: new BonfireSettingsItem(false, "titanium"),

      workshop: new BonfireSettingsItem(true, "minerals"),
      factory: new BonfireSettingsItem(true, "titanium"),

      field: new BonfireSettingsItem(true, "catnip"),
      pasture: new BonfireSettingsItem(true, "catnip"),
      solarFarm: new BonfireSettingsItem(true, "titanium", -1, "pasture"),
      mine: new BonfireSettingsItem(true, "wood"),
      lumberMill: new BonfireSettingsItem(true, "minerals"),
      aqueduct: new BonfireSettingsItem(true, "minerals"),
      hydroPlant: new BonfireSettingsItem(true, "titanium", -1, "aqueduct"),
      oilWell: new BonfireSettingsItem(true, "coal"),
      quarry: new BonfireSettingsItem(true, "coal"),

      smelter: new BonfireSettingsItem(true, "minerals"),
      biolab: new BonfireSettingsItem(false, "science"),
      calciner: new BonfireSettingsItem(false, "titanium"),
      reactor: new BonfireSettingsItem(false, "titanium"),
      accelerator: new BonfireSettingsItem(false, "titanium"),
      steamworks: new BonfireSettingsItem(),
      magneto: new BonfireSettingsItem(),

      library: new BonfireSettingsItem(true, "wood"),
      dataCenter: new BonfireSettingsItem(true, false, -1, "library"),
      academy: new BonfireSettingsItem(true, "wood"),
      observatory: new BonfireSettingsItem(true, "iron"),

      amphitheatre: new BonfireSettingsItem(true, "minerals"),
      broadcastTower: new BonfireSettingsItem(true, "titanium", -1, "amphitheatre"),
      tradepost: new BonfireSettingsItem(true, "gold"),
      chapel: new BonfireSettingsItem(true, "minerals"),
      temple: new BonfireSettingsItem(true, "gold"),
      mint: new BonfireSettingsItem(),
      ziggurat: new BonfireSettingsItem(true),
      chronosphere: new BonfireSettingsItem(true, "unobtainium"),
      aiCore: new BonfireSettingsItem(),
      brewery: new BonfireSettingsItem(),

      barn: new BonfireSettingsItem(true, "wood"),
      harbor: new BonfireSettingsItem(),
      warehouse: new BonfireSettingsItem(),

      zebraOutpost: new BonfireSettingsItem(true, "bloodstone"),
      zebraWorkshop: new BonfireSettingsItem(false, "bloodstone"),
      zebraForge: new BonfireSettingsItem(false, "bloodstone"),
    },
    turnOnSteamworks = new Setting(true),
    upgradeBuildings = new BuildingUpgradeSettings()
  ) {
    super(enabled, trigger);
    this.items = items;
    this.turnOnSteamworks = turnOnSteamworks;
    this.upgradeBuildings = upgradeBuildings;
  }

  load(settings: BonfireSettings) {
    this.enabled = settings.enabled;
    this.trigger = settings.trigger;

    for (const [name, item] of objectEntries(settings.items)) {
      this.items[name].enabled = item.enabled;
      this.items[name].max = item.max;
    }

    this.turnOnSteamworks.enabled = settings.turnOnSteamworks.enabled;
    this.upgradeBuildings.enabled = settings.upgradeBuildings.enabled;

    for (const [name, item] of objectEntries(settings.upgradeBuildings.items)) {
      this.upgradeBuildings.items[name].enabled = item.enabled;
    }
  }

  static toLegacyOptions(settings: BonfireSettings, subject: KittenStorageType) {
    subject.toggles.build = settings.enabled;
    subject.triggers.build = settings.trigger;

    for (const [name, item] of objectEntries(settings.items)) {
      subject.items[`toggle-${name}` as const] = item.enabled;
      subject.items[`set-${name}-max` as const] = item.max;
    }

    subject.items["toggle-buildings"] = settings.upgradeBuildings.enabled;
    subject.items["toggle-_steamworks"] = settings.turnOnSteamworks.enabled;

    for (const [name, item] of objectEntries(settings.upgradeBuildings.items)) {
      subject.items[`toggle-upgrade-${name}` as const] = item.enabled;
    }
  }

  static fromLegacyOptions(subject: KittenStorageType) {
    const options = new BonfireSettings();
    options.enabled = subject.toggles.build;
    options.trigger = subject.triggers.build;

    for (const [name, item] of objectEntries(options.items)) {
      item.enabled = subject.items[`toggle-${name}` as const] ?? item.enabled;
      item.max = subject.items[`set-${name}-max` as const] ?? item.max;
    }

    options.upgradeBuildings.enabled =
      subject.items["toggle-buildings"] ?? options.upgradeBuildings.enabled;
    options.turnOnSteamworks.enabled =
      subject.items["toggle-_steamworks"] ?? options.turnOnSteamworks.enabled;

    for (const [name, item] of objectEntries(options.upgradeBuildings.items)) {
      item.enabled = subject.items[`toggle-upgrade-${name}` as const] ?? item.enabled;
    }
    return options;
  }
}
