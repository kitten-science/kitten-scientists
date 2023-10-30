import { Maybe, isNil } from "@oliversalzburg/js-utils/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { Building } from "../types/index.js";
import { BuildingUpgradeSettings } from "./BuildingUpgradeSettings.js";
import { Setting, SettingMax, SettingTrigger } from "./Settings.js";

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
  readonly #baseBuilding: Building | undefined = undefined;
  get baseBuilding() {
    return this.#baseBuilding;
  }

  readonly #building: BonfireItem;
  get building() {
    return this.#building;
  }

  /**
   * In case this is an upgradable building, this indicates the level of
   * the stage.
   */
  readonly #stage: number = 0;
  get stage() {
    return this.#stage;
  }

  constructor(building: BonfireItem, enabled = false, max = -1, baseStage?: Building) {
    super(enabled, max);

    this.#building = building;
    if (baseStage) {
      this.#stage = 1;
      this.#baseBuilding = baseStage;
    }
  }
}

export type BonfireBuildingSettings = Record<string, BonfireBuildingSetting>;

export class BonfireSettings extends SettingTrigger {
  buildings: BonfireBuildingSettings;

  turnOnSteamworks: Setting;
  turnOnMagnetos: Setting;
  upgradeBuildings: BuildingUpgradeSettings;

  constructor(
    enabled = false,
    trigger = 0,
    buildings: BonfireBuildingSettings = {
      academy: new BonfireBuildingSetting("academy", true),
      accelerator: new BonfireBuildingSetting("accelerator", false),
      aiCore: new BonfireBuildingSetting("aiCore"),
      amphitheatre: new BonfireBuildingSetting("amphitheatre", true),
      aqueduct: new BonfireBuildingSetting("aqueduct", true),
      barn: new BonfireBuildingSetting("barn", true),
      biolab: new BonfireBuildingSetting("biolab", false),
      brewery: new BonfireBuildingSetting("brewery"),
      broadcastTower: new BonfireBuildingSetting("broadcastTower", true, -1, "amphitheatre"),
      calciner: new BonfireBuildingSetting("calciner", false),
      chapel: new BonfireBuildingSetting("chapel", true),
      chronosphere: new BonfireBuildingSetting("chronosphere", true),
      dataCenter: new BonfireBuildingSetting("dataCenter", true, -1, "library"),
      factory: new BonfireBuildingSetting("factory", true),
      field: new BonfireBuildingSetting("field", true),
      harbor: new BonfireBuildingSetting("harbor"),
      hut: new BonfireBuildingSetting("hut", false),
      hydroPlant: new BonfireBuildingSetting("hydroPlant", true, -1, "aqueduct"),
      library: new BonfireBuildingSetting("library", true),
      logHouse: new BonfireBuildingSetting("logHouse", false),
      lumberMill: new BonfireBuildingSetting("lumberMill", true),
      magneto: new BonfireBuildingSetting("magneto"),
      mansion: new BonfireBuildingSetting("mansion", false),
      mine: new BonfireBuildingSetting("mine", true),
      mint: new BonfireBuildingSetting("mint"),
      observatory: new BonfireBuildingSetting("observatory", true),
      oilWell: new BonfireBuildingSetting("oilWell", true),
      pasture: new BonfireBuildingSetting("pasture", true),
      quarry: new BonfireBuildingSetting("quarry", true),
      reactor: new BonfireBuildingSetting("reactor", false),
      smelter: new BonfireBuildingSetting("smelter", true),
      solarFarm: new BonfireBuildingSetting("solarFarm", true, -1, "pasture"),
      steamworks: new BonfireBuildingSetting("steamworks"),
      temple: new BonfireBuildingSetting("temple", true),
      tradepost: new BonfireBuildingSetting("tradepost", true),
      warehouse: new BonfireBuildingSetting("warehouse"),
      workshop: new BonfireBuildingSetting("workshop", true),
      zebraForge: new BonfireBuildingSetting("zebraForge", false),
      zebraOutpost: new BonfireBuildingSetting("zebraOutpost", true),
      zebraWorkshop: new BonfireBuildingSetting("zebraWorkshop", false),
      ziggurat: new BonfireBuildingSetting("ziggurat", true),
    },
    turnOnSteamworks = new Setting(true),
    turnOnMagnetos = new Setting(false),
    upgradeBuildings = new BuildingUpgradeSettings(),
  ) {
    super(enabled, trigger);
    this.buildings = buildings;
    this.turnOnSteamworks = turnOnSteamworks;
    this.turnOnMagnetos = turnOnMagnetos;
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

    this.turnOnMagnetos.enabled = settings.turnOnMagnetos?.enabled ?? this.turnOnMagnetos.enabled;

    this.upgradeBuildings.load(settings.upgradeBuildings);
  }
}
