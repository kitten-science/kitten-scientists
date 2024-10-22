import { Maybe, isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { ChronoForgeUpgrades, TimeItemVariant, VoidSpaceUpgrades } from "../types/index.js";
import { Setting, SettingThreshold } from "./Settings.js";
import { TimeItem } from "./TimeSettings.js";

export class ResetTimeBuildingSetting extends SettingThreshold {
  readonly #building: TimeItem;
  readonly #variant: TimeItemVariant;

  get building() {
    return this.#building;
  }
  get variant() {
    return this.#variant;
  }

  constructor(id: TimeItem, variant: TimeItemVariant, enabled = false, threshold = -1) {
    super(enabled, threshold);
    this.#building = id;
    this.#variant = variant;
  }
}

export type ResetTimeBuildingSettings = Record<TimeItem, ResetTimeBuildingSetting>;

export class ResetTimeSettings extends Setting {
  readonly buildings: ResetTimeBuildingSettings;

  constructor(enabled = false) {
    super(enabled);
    this.buildings = this.initBuildings();
  }

  private initBuildings(): ResetTimeBuildingSettings {
    const items = {} as ResetTimeBuildingSettings;
    ChronoForgeUpgrades.forEach(item => {
      items[item] = new ResetTimeBuildingSetting(item, TimeItemVariant.Chronoforge);
    });
    VoidSpaceUpgrades.forEach(item => {
      if (item === "usedCryochambers") return;
      items[item] = new ResetTimeBuildingSetting(item, TimeItemVariant.VoidSpace);
    });
    return items;
  }

  load(settings: Maybe<Partial<ResetTimeSettings>>) {
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
