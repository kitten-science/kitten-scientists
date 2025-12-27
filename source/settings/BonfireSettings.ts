import { difference } from "@oliversalzburg/js-utils/data/array.js";
import { isNil, type Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { cl } from "../tools/Log.js";
import {
  type Building,
  Buildings,
  type GamePage,
  type StagedBuilding,
  StagedBuildings,
} from "../types/index.js";
import { BuildingUpgradeSettings } from "./BuildingUpgradeSettings.js";
import { Setting, SettingTrigger, SettingTriggerMax } from "./Settings.js";

/**
 * One of the building options in the KS menu.
 * These are not identical to `Building`!
 * `Building` is IDs of buildings as defined by KG. KS defines upgrade stages as well.
 */
export type BonfireItem = Building | StagedBuilding;

export class BonfireBuildingSetting extends SettingTriggerMax {
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

  constructor(
    building: BonfireItem,
    enabled = false,
    trigger = -1,
    max = 0,
    baseStage?: Building | false,
  ) {
    super(enabled, trigger, max);

    this.#building = building;
    if (baseStage) {
      this.#stage = 1;
      this.#baseBuilding = baseStage;
    }
  }
}

export type BonfireBuildingSettings = Record<
  Exclude<BonfireItem, "unicornPasture">,
  BonfireBuildingSetting
>;

export class BonfireSettings extends SettingTrigger {
  buildings: BonfireBuildingSettings;

  gatherCatnip: Setting;
  turnOnMagnetos: Setting;
  turnOnSteamworks: Setting;
  turnOnReactors: Setting;
  upgradeBuildings: BuildingUpgradeSettings;

  constructor(
    enabled = false,
    trigger = -1,
    gatherCatnip = new Setting(),
    turnOnSteamworks = new Setting(),
    turnOnMagnetos = new Setting(),
    turnOnReactors = new Setting(),
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
    const baseStage: Partial<Record<StagedBuilding, Building>> = {
      broadcasttower: "amphitheatre",
      dataCenter: "library",
      hydroplant: "aqueduct",
      solarfarm: "pasture",
      spaceport: "warehouse",
    };

    const items = {} as BonfireBuildingSettings;
    for (const item of Buildings) {
      if (item === "unicornPasture") {
        continue;
      }
      items[item] = new BonfireBuildingSetting(item);
    }
    for (const item of StagedBuildings) {
      items[item] = new BonfireBuildingSetting(item, false, -1, 0, baseStage[item]);
    }

    return items;
  }

  static validateGame(game: GamePage, settings: BonfireSettings) {
    const inSettings = Object.keys(settings.buildings);
    const inGame = game.bld.buildingsData.map(_ => _.name);

    const missingInSettings = difference(inGame, inSettings);
    const redundantInSettings = difference(inSettings, inGame);

    for (const _ of missingInSettings) {
      console.warn(...cl(`The building '${_}' is not tracked in Kitten Scientists!`));
    }
    for (const _ of redundantInSettings) {
      console.warn(...cl(`The building '${_}' is not a building in Kittens Game!`));
    }
  }

  load(settings: Maybe<Partial<BonfireSettings>>) {
    if (isNil(settings)) {
      return;
    }

    super.load(settings);

    consumeEntriesPedantic(this.buildings, settings.buildings, (building, item) => {
      building.enabled = item?.enabled ?? building.enabled;
      building.max = item?.max ?? building.max;
      building.trigger = item?.trigger ?? building.trigger;
    });

    this.gatherCatnip.enabled = settings.gatherCatnip?.enabled ?? this.gatherCatnip.enabled;
    this.turnOnSteamworks.enabled =
      settings.turnOnSteamworks?.enabled ?? this.turnOnSteamworks.enabled;
    this.turnOnMagnetos.enabled = settings.turnOnMagnetos?.enabled ?? this.turnOnMagnetos.enabled;
    this.turnOnReactors.enabled = settings.turnOnReactors?.enabled ?? this.turnOnReactors.enabled;
    this.upgradeBuildings.load(settings.upgradeBuildings);
  }
}
