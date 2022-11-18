import { consumeEntriesPedantic, objectEntries } from "../tools/Entries";
import { isNil, Maybe } from "../tools/Maybe";
import { Building } from "../types";
import { BuildingUpgradeSettings } from "./BuildingUpgradeSettings";
import { Requirement, Setting, SettingMax, SettingTrigger } from "./Settings";
import { LegacyStorage } from "./SettingsStorage";

/**
 * One of the building options in the KS menu.
 * These are not identical to `Building`!
 * `Building` is IDs of buildings as defined by KG. KS defines upgrade stages as well.
 */
export type BonfireItem = Building | "broadcastTower" | "dataCenter" | "hydroPlant" | "solarFarm";

export class BonfireBuildingSetting extends SettingMax {
  /**
   * In case this is an upgrade of another building, this is the name of the
   * base building.
   */
  readonly baseBuilding: Building | undefined = undefined;

  readonly building: BonfireItem;

  /**
   * A resource that you must have unlocked to build this.
   */
  readonly require: Requirement = false;

  /**
   * In case this is an upgradable building, this indicates the level of
   * the stage.
   */
  readonly stage: number = 0;

  constructor(
    building: BonfireItem,
    enabled = false,
    require: Requirement = false,
    max = -1,
    baseStage?: Building
  ) {
    super(enabled, max);

    this.building = building;
    this.require = require;
    if (baseStage) {
      this.stage = 1;
      this.baseBuilding = baseStage;
    }
  }
}

export type BonfireBuildingSettings = Record<string, BonfireBuildingSetting>;

export class BonfireSettings extends SettingTrigger {
  buildings: BonfireBuildingSettings;

  turnOnSteamworks: Setting;
  upgradeBuildings: BuildingUpgradeSettings;

  constructor(
    enabled = false,
    trigger = 0,
    buildings: BonfireBuildingSettings = {
      academy: new BonfireBuildingSetting("academy", true, "wood"),
      accelerator: new BonfireBuildingSetting("accelerator", false, "titanium"),
      aiCore: new BonfireBuildingSetting("aiCore"),
      amphitheatre: new BonfireBuildingSetting("amphitheatre", true, "minerals"),
      aqueduct: new BonfireBuildingSetting("aqueduct", true, "minerals"),
      barn: new BonfireBuildingSetting("barn", true, "wood"),
      biolab: new BonfireBuildingSetting("biolab", false, "science"),
      brewery: new BonfireBuildingSetting("brewery"),
      broadcastTower: new BonfireBuildingSetting(
        "broadcastTower",
        true,
        "titanium",
        -1,
        "amphitheatre"
      ),
      calciner: new BonfireBuildingSetting("calciner", false, "titanium"),
      chapel: new BonfireBuildingSetting("chapel", true, "minerals"),
      chronosphere: new BonfireBuildingSetting("chronosphere", true, "unobtainium"),
      dataCenter: new BonfireBuildingSetting("dataCenter", true, false, -1, "library"),
      factory: new BonfireBuildingSetting("factory", true, "titanium"),
      field: new BonfireBuildingSetting("field", true, "catnip"),
      harbor: new BonfireBuildingSetting("harbor"),
      hut: new BonfireBuildingSetting("hut", false, "wood"),
      hydroPlant: new BonfireBuildingSetting("hydroPlant", true, "titanium", -1, "aqueduct"),
      library: new BonfireBuildingSetting("library", true, "wood"),
      logHouse: new BonfireBuildingSetting("logHouse", false, "minerals"),
      lumberMill: new BonfireBuildingSetting("lumberMill", true, "minerals"),
      magneto: new BonfireBuildingSetting("magneto"),
      mansion: new BonfireBuildingSetting("mansion", false, "titanium"),
      mine: new BonfireBuildingSetting("mine", true, "wood"),
      mint: new BonfireBuildingSetting("mint"),
      observatory: new BonfireBuildingSetting("observatory", true, "iron"),
      oilWell: new BonfireBuildingSetting("oilWell", true, "coal"),
      pasture: new BonfireBuildingSetting("pasture", true, "catnip"),
      quarry: new BonfireBuildingSetting("quarry", true, "coal"),
      reactor: new BonfireBuildingSetting("reactor", false, "titanium"),
      smelter: new BonfireBuildingSetting("smelter", true, "minerals"),
      solarFarm: new BonfireBuildingSetting("solarFarm", true, "titanium", -1, "pasture"),
      steamworks: new BonfireBuildingSetting("steamworks"),
      temple: new BonfireBuildingSetting("temple", true, "gold"),
      tradepost: new BonfireBuildingSetting("tradepost", true, "gold"),
      warehouse: new BonfireBuildingSetting("warehouse"),
      workshop: new BonfireBuildingSetting("workshop", true, "minerals"),
      zebraForge: new BonfireBuildingSetting("zebraForge", false, "bloodstone"),
      zebraOutpost: new BonfireBuildingSetting("zebraOutpost", true, "bloodstone"),
      zebraWorkshop: new BonfireBuildingSetting("zebraWorkshop", false, "bloodstone"),
      ziggurat: new BonfireBuildingSetting("ziggurat", true),
    },
    turnOnSteamworks = new Setting(true),
    upgradeBuildings = new BuildingUpgradeSettings()
  ) {
    super(enabled, trigger);
    this.buildings = buildings;
    this.turnOnSteamworks = turnOnSteamworks;
    this.upgradeBuildings = upgradeBuildings;
  }

  load(settings: Maybe<Partial<BonfireSettings>>) {
    if (isNil(settings)) {
      return;
    }

    super.load(settings);

    consumeEntriesPedantic(this.buildings, settings.buildings, (building, item) => {
      building.enabled = item?.enabled ?? building.enabled;
      building.max = item?.max ?? building.max;
    });

    this.turnOnSteamworks.enabled =
      settings.turnOnSteamworks?.enabled ?? this.turnOnSteamworks.enabled;

    this.upgradeBuildings.load(settings.upgradeBuildings);
  }

  static toLegacyOptions(settings: BonfireSettings, subject: LegacyStorage) {
    subject.toggles.build = settings.enabled;
    subject.triggers.build = settings.trigger;

    for (const [, item] of objectEntries(settings.buildings)) {
      subject.items[`toggle-${item.building}` as const] = item.enabled;
      subject.items[`set-${item.building}-max` as const] = item.max;
    }

    subject.items["toggle-_steamworks"] = settings.turnOnSteamworks.enabled;

    BuildingUpgradeSettings.toLegacyOptions(settings.upgradeBuildings, subject);
  }

  static fromLegacyOptions(subject: LegacyStorage) {
    const options = new BonfireSettings();
    options.enabled = subject.toggles.build;
    options.trigger = subject.triggers.build;

    for (const [, item] of objectEntries(options.buildings)) {
      item.enabled = subject.items[`toggle-${item.building}` as const] ?? item.enabled;
      item.max = subject.items[`set-${item.building}-max` as const] ?? item.max;
    }

    options.turnOnSteamworks.enabled =
      subject.items["toggle-_steamworks"] ?? options.turnOnSteamworks.enabled;

    options.upgradeBuildings = BuildingUpgradeSettings.fromLegacyOptions(subject);

    return options;
  }
}
