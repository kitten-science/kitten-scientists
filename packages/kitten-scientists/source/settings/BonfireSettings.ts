import { Maybe, isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { Building, Buildings, StagedBuilding, StagedBuildings } from "../types/index.js";
import { BuildingUpgradeSettings } from "./BuildingUpgradeSettings.js";
import { Setting, SettingMax, SettingTrigger } from "./Settings.js";

/**
 * One of the building options in the KS menu.
 * These are not identical to `Building`!
 * `Building` is IDs of buildings as defined by KG. KS defines upgrade stages as well.
 */
export type BonfireItem = Building | StagedBuilding;

export class BonfireBuildingSetting extends SettingMax {
  /**
   * In case this is an upgrade of another building, this is the name of the
   * base building.
   * Otherwise, it should be identical to the `building`.
   */
  readonly #baseBuilding: Building;
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

  constructor(building: BonfireItem, enabled = false, max = -1, baseStage?: Building | false) {
    super(enabled, max);

    this.#building = building;
    if (baseStage) {
      this.#stage = 1;
      this.#baseBuilding = baseStage;
    } else {
      this.#baseBuilding = building as Building;
    }
  }
}

export type BonfireBuildingSettings = Record<
  Exclude<BonfireItem, "unicornPasture">,
  BonfireBuildingSetting
>;

export const baseStage: Partial<Record<StagedBuilding, Building>> = {
  broadcasttower: "amphitheatre",
  dataCenter: "library",
  hydroplant: "aqueduct",
  solarfarm: "pasture",
  spaceport: "warehouse",
};

export class BonfireSettings extends SettingTrigger {
  buildings: BonfireBuildingSettings;

  gatherCatnip: Setting;
  turnOnMagnetos: Setting;
  turnOnSteamworks: Setting;
  turnOnReactors: Setting;
  upgradeBuildings: BuildingUpgradeSettings;

  constructor(
    enabled = false,
    trigger = 0,
    gatherCatnip = new Setting(true),
    turnOnSteamworks = new Setting(true),
    turnOnMagnetos = new Setting(false),
    turnOnReactors = new Setting(false),
    upgradeBuildings = new BuildingUpgradeSettings(),
  ) {
    super(enabled, trigger);
    this.buildings = this.initBuildings();
    this.gatherCatnip = gatherCatnip;
    this.turnOnSteamworks = turnOnSteamworks;
    this.turnOnMagnetos = turnOnMagnetos;
    this.turnOnReactors = turnOnReactors;
    this.upgradeBuildings = upgradeBuildings;
  }

  private initBuildings(): BonfireBuildingSettings {
    const defaultOffBuilding: Array<BonfireItem> = [
      "accelerator",
      "biolab",
      "calciner",
      "hut",
      "logHouse",
      "mansion",
      "reactor",
      "zebraForge",
      "zebraWorkshop",
    ];
    const items = {} as BonfireBuildingSettings;

    Buildings.forEach(item => {
      if (item === "unicornPasture") return;
      items[item] = new BonfireBuildingSetting(item, !defaultOffBuilding.includes(item));
    });
    StagedBuildings.forEach(item => {
      items[item] = new BonfireBuildingSetting(
        item,
        !defaultOffBuilding.includes(item),
        -1,
        baseStage[item],
      );
    });

    return items;
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

    this.gatherCatnip.enabled = settings.gatherCatnip?.enabled ?? this.gatherCatnip.enabled;
    this.turnOnSteamworks.enabled =
      settings.turnOnSteamworks?.enabled ?? this.turnOnSteamworks.enabled;
    this.turnOnMagnetos.enabled = settings.turnOnMagnetos?.enabled ?? this.turnOnMagnetos.enabled;
    this.turnOnReactors.enabled = settings.turnOnReactors?.enabled ?? this.turnOnReactors.enabled;
    this.upgradeBuildings.load(settings.upgradeBuildings);
  }
}
