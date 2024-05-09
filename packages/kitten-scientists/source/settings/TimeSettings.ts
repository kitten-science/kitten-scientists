import { Maybe, isNil } from "@oliversalzburg/js-utils/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import {
  ChronoForgeUpgrades,
  ChronoForgeUpgradesArray,
  TimeItemVariant,
  VoidSpaceUpgrades,
  VoidSpaceUpgradesArray,
} from "../types/index.js";
import { Setting, SettingMax, SettingTrigger } from "./Settings.js";

/**
 * The upgrades on the Time tab that we have options for.
 */
export type TimeItem = Exclude<ChronoForgeUpgrades | VoidSpaceUpgrades, "usedCryochambers">;

export class TimeSettingsItem extends SettingMax {
  readonly #building: TimeItem;
  readonly #variant: TimeItemVariant;

  get building() {
    return this.#building;
  }
  get variant() {
    return this.#variant;
  }

  constructor(building: TimeItem, variant: TimeItemVariant, enabled = false) {
    super(enabled);
    this.#building = building;
    this.#variant = variant;
  }
}

export type TimeBuildingsSettings = Record<TimeItem, TimeSettingsItem>;

export class TimeSettings extends SettingTrigger {
  buildings: TimeBuildingsSettings;

  fixCryochambers: Setting;
  turnOnChronoFurnace: Setting;

  constructor(
    enabled = false,
    trigger = 1,
    fixCryochambers = new Setting(false),
    turnOnChronoFurnace = new Setting(false),
  ) {
    super(enabled, trigger);
    this.buildings = this.initBuildings();
    this.fixCryochambers = fixCryochambers;
    this.turnOnChronoFurnace = turnOnChronoFurnace;
  }

  private initBuildings(): TimeBuildingsSettings {
    const items = {} as TimeBuildingsSettings;
    ChronoForgeUpgradesArray.forEach(item => {
      items[item] = new TimeSettingsItem(item, TimeItemVariant.Chronoforge);
    });
    VoidSpaceUpgradesArray.forEach(item => {
      if (item === "usedCryochambers") return;
      items[item] = new TimeSettingsItem(item, TimeItemVariant.VoidSpace);
    });
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
    });

    this.fixCryochambers.load(settings.fixCryochambers);
    this.turnOnChronoFurnace.load(settings.turnOnChronoFurnace);
  }
}
