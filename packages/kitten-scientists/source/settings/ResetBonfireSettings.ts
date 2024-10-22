import { Maybe, isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { Building, Buildings, StagedBuilding, StagedBuildings } from "../types/index.js";
import { BonfireItem } from "./BonfireSettings.js";
import { Setting, SettingThreshold } from "./Settings.js";

export class ResetBonfireBuildingSetting extends SettingThreshold {
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
    threshold = -1,
    baseStage?: Building | false,
  ) {
    super(enabled, threshold);

    this.#building = building;
    if (baseStage) {
      this.#stage = 1;
      this.#baseBuilding = baseStage;
    }
  }
}

// unicornPasture is handled in the Religion section.
export type ResetBonfireBuildingSettings = Record<
  Exclude<BonfireItem, "unicornPasture">,
  ResetBonfireBuildingSetting
>;

export class ResetBonfireSettings extends Setting {
  readonly buildings: ResetBonfireBuildingSettings;

  constructor(enabled = false) {
    super(enabled);
    this.buildings = this.initBuildings();
  }

  private initBuildings(): ResetBonfireBuildingSettings {
    const baseStage: Partial<Record<StagedBuilding, Building>> = {
      broadcasttower: "amphitheatre",
      dataCenter: "library",
      hydroplant: "aqueduct",
      solarfarm: "pasture",
      spaceport: "warehouse",
    };

    const items = {} as ResetBonfireBuildingSettings;
    Buildings.forEach(item => {
      if (item === "unicornPasture") return;
      items[item] = new ResetBonfireBuildingSetting(item);
    });
    StagedBuildings.forEach(item => {
      items[item] = new ResetBonfireBuildingSetting(item, false, -1, baseStage[item]);
    });

    return items;
  }

  load(settings: Maybe<Partial<ResetBonfireSettings>>) {
    if (isNil(settings)) {
      return;
    }

    super.load(settings);

    consumeEntriesPedantic(this.buildings, settings.buildings, (building, item) => {
      building.enabled = item?.enabled ?? building.enabled;
      building.trigger = item?.trigger ?? building.trigger;
    });
  }
}
