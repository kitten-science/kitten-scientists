import { type Maybe, isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { type SpaceBuilding, SpaceBuildings } from "../types/index.js";
import { Setting, SettingThreshold } from "./Settings.js";

export class ResetSpaceBuildingSetting extends SettingThreshold {
  readonly #building: SpaceBuilding;

  get building() {
    return this.#building;
  }

  constructor(building: SpaceBuilding, enabled = false, threshold = -1) {
    super(enabled, threshold);
    this.#building = building;
  }
}

export type ResetSpaceBuildingSettings = Record<SpaceBuilding, SettingThreshold>;

export class ResetSpaceSettings extends Setting {
  readonly buildings: ResetSpaceBuildingSettings;

  constructor(enabled = false) {
    super(enabled);
    this.buildings = this.initBuildings();
  }

  private initBuildings(): ResetSpaceBuildingSettings {
    const items = {} as ResetSpaceBuildingSettings;
    for (const item of SpaceBuildings) {
      items[item] = new ResetSpaceBuildingSetting(item);
    }
    return items;
  }

  load(settings: Maybe<Partial<ResetSpaceSettings>>) {
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
