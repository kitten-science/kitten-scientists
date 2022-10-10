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

  constructor(
    id: string,
    enabled = false,
    require: Requirement = false,
    max = -1,
    baseStage?: Building
  ) {
    super(id, enabled, max);

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
      academy: new BonfireSettingsItem("academy", true, "wood"),
      accelerator: new BonfireSettingsItem("accelerator", false, "titanium"),
      aiCore: new BonfireSettingsItem("aiCore"),
      amphitheatre: new BonfireSettingsItem("amphitheatre", true, "minerals"),
      aqueduct: new BonfireSettingsItem("aqueduct", true, "minerals"),
      barn: new BonfireSettingsItem("barn", true, "wood"),
      biolab: new BonfireSettingsItem("biolab", false, "science"),
      brewery: new BonfireSettingsItem("brewery"),
      broadcastTower: new BonfireSettingsItem(
        "broadcastTower",
        true,
        "titanium",
        -1,
        "amphitheatre"
      ),
      calciner: new BonfireSettingsItem("calciner", false, "titanium"),
      chapel: new BonfireSettingsItem("chapel", true, "minerals"),
      chronosphere: new BonfireSettingsItem("chronosphere", true, "unobtainium"),
      dataCenter: new BonfireSettingsItem("dataCenter", true, false, -1, "library"),
      factory: new BonfireSettingsItem("factory", true, "titanium"),
      field: new BonfireSettingsItem("field", true, "catnip"),
      harbor: new BonfireSettingsItem("harbor"),
      hut: new BonfireSettingsItem("hut", false, "wood"),
      hydroPlant: new BonfireSettingsItem("hydroPlant", true, "titanium", -1, "aqueduct"),
      library: new BonfireSettingsItem("library", true, "wood"),
      logHouse: new BonfireSettingsItem("logHouse", false, "minerals"),
      lumberMill: new BonfireSettingsItem("lumberMill", true, "minerals"),
      magneto: new BonfireSettingsItem("magneto"),
      mansion: new BonfireSettingsItem("mansion", false, "titanium"),
      mine: new BonfireSettingsItem("mine", true, "wood"),
      mint: new BonfireSettingsItem("mint"),
      observatory: new BonfireSettingsItem("observatory", true, "iron"),
      oilWell: new BonfireSettingsItem("oilWell", true, "coal"),
      pasture: new BonfireSettingsItem("pasture", true, "catnip"),
      quarry: new BonfireSettingsItem("quarry", true, "coal"),
      reactor: new BonfireSettingsItem("reactor", false, "titanium"),
      smelter: new BonfireSettingsItem("smelter", true, "minerals"),
      solarFarm: new BonfireSettingsItem("solarFarm", true, "titanium", -1, "pasture"),
      steamworks: new BonfireSettingsItem("steamworks"),
      temple: new BonfireSettingsItem("temple", true, "gold"),
      tradepost: new BonfireSettingsItem("tradepost", true, "gold"),
      warehouse: new BonfireSettingsItem("warehouse"),
      workshop: new BonfireSettingsItem("workshop", true, "minerals"),
      zebraForge: new BonfireSettingsItem("zebraForge", false, "bloodstone"),
      zebraOutpost: new BonfireSettingsItem("zebraOutpost", true, "bloodstone"),
      zebraWorkshop: new BonfireSettingsItem("zebraWorkshop", false, "bloodstone"),
      ziggurat: new BonfireSettingsItem("ziggurat", true),
    },
    turnOnSteamworks = new Setting("turnOnSteamworks", true),
    upgradeBuildings = new BuildingUpgradeSettings("upgradeBuildings")
  ) {
    super("bonfire", enabled, trigger);
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

    this.upgradeBuildings.load(settings.upgradeBuildings);
  }

  static toLegacyOptions(settings: BonfireSettings, subject: KittenStorageType) {
    subject.toggles.build = settings.enabled;
    subject.triggers.build = settings.trigger;

    for (const [name, item] of objectEntries(settings.items)) {
      subject.items[`toggle-${name}` as const] = item.enabled;
      subject.items[`set-${name}-max` as const] = item.max;
    }

    subject.items["toggle-_steamworks"] = settings.turnOnSteamworks.enabled;

    BuildingUpgradeSettings.toLegacyOptions(settings.upgradeBuildings, subject);
  }

  static fromLegacyOptions(subject: KittenStorageType) {
    const options = new BonfireSettings();
    options.enabled = subject.toggles.build;
    options.trigger = subject.triggers.build;

    for (const [name, item] of objectEntries(options.items)) {
      item.enabled = subject.items[`toggle-${name}` as const] ?? item.enabled;
      item.max = subject.items[`set-${name}-max` as const] ?? item.max;
    }

    options.turnOnSteamworks.enabled =
      subject.items["toggle-_steamworks"] ?? options.turnOnSteamworks.enabled;

    options.upgradeBuildings = BuildingUpgradeSettings.fromLegacyOptions(subject);

    return options;
  }
}
