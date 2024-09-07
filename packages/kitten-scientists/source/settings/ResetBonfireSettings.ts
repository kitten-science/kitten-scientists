import { Maybe, isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { Buildings, StagedBuildings } from "../types/index.js";
import { BonfireItem } from "./BonfireSettings.js";
import { Setting, SettingThreshold } from "./Settings.js";

export class ResetBonfireBuildingSetting extends SettingThreshold {
  readonly #building: BonfireItem;

  get building() {
    return this.#building;
  }

  constructor(building: BonfireItem, enabled = false, trigger = -1) {
    super(enabled, trigger);
    this.#building = building;
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
    const items = {} as ResetBonfireBuildingSettings;
    [...Buildings, ...StagedBuildings].forEach(item => {
      if (item === "unicornPasture") return;
      items[item] = new ResetBonfireBuildingSetting(item);
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
