import { type Maybe, isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import {
  type ChronoForgeUpgrade,
  ChronoForgeUpgrades,
  TimeItemVariant,
  type VoidSpaceUpgrade,
  VoidSpaceUpgrades,
} from "../types/index.js";
import { Setting, SettingTrigger, SettingTriggerMax } from "./Settings.js";

/**
 * The upgrades on the Time tab that we have options for.
 */
export type TimeItem = Exclude<ChronoForgeUpgrade | VoidSpaceUpgrade, "usedCryochambers">;

export class TimeSettingsItem extends SettingTriggerMax {
  readonly #building: TimeItem;
  readonly #variant: TimeItemVariant;

  get building() {
    return this.#building;
  }
  get variant() {
    return this.#variant;
  }

  constructor(building: TimeItem, variant: TimeItemVariant, enabled = false) {
    super(enabled, -1, 0);
    this.#building = building;
    this.#variant = variant;
  }
}

export type TimeBuildingsSettings = Record<TimeItem, TimeSettingsItem>;

export class TimeSettings extends SettingTrigger {
  buildings: TimeBuildingsSettings;

  fixCryochambers: Setting;

  constructor(enabled = false, trigger = -1, fixCryochambers = new Setting()) {
    super(enabled, trigger);
    this.buildings = this.initBuildings();
    this.fixCryochambers = fixCryochambers;
  }

  private initBuildings(): TimeBuildingsSettings {
    const items = {} as TimeBuildingsSettings;
    for (const item of ChronoForgeUpgrades) {
      items[item] = new TimeSettingsItem(item, TimeItemVariant.Chronoforge);
    }
    for (const item of VoidSpaceUpgrades) {
      if (item === "usedCryochambers") {
        continue;
      }
      items[item] = new TimeSettingsItem(item, TimeItemVariant.VoidSpace);
    }
    return items;
  }

  load(settings: Maybe<Partial<TimeSettings>>) {
    if (isNil(settings)) {
      return;
    }

    super.load(settings);

    consumeEntriesPedantic(this.buildings, settings.buildings, (building, item) => {
      building.enabled = item?.enabled ?? building.enabled;
      building.max = item?.max ?? building.max;
      building.trigger = item?.trigger ?? building.trigger;
    });

    this.fixCryochambers.load(settings.fixCryochambers);
  }
}
