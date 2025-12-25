import { isNil, type Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import {
  type FaithItem,
  ReligionUpgrades,
  TranscendenceUpgrades,
  type UnicornItem,
  UnicornItemVariant,
  ZigguratUpgrades,
} from "../types/index.js";
import { Setting, SettingThreshold } from "./Settings.js";

export class ResetReligionBuildingSetting extends SettingThreshold {
  readonly #building: FaithItem | UnicornItem;
  readonly #variant: UnicornItemVariant;

  get building() {
    return this.#building;
  }
  get variant() {
    return this.#variant;
  }

  constructor(
    building: FaithItem | UnicornItem,
    variant: UnicornItemVariant,
    enabled = false,
    threshold = -1,
  ) {
    super(enabled, threshold);
    this.#building = building;
    this.#variant = variant;
  }
}

export type ResetReligionBuildingSettings = Record<
  FaithItem | UnicornItem,
  ResetReligionBuildingSetting
>;

export class ResetReligionSettings extends Setting {
  readonly buildings: ResetReligionBuildingSettings;

  constructor(enabled = true) {
    super(enabled);
    this.buildings = this.initBuildings();
  }

  private initBuildings(): ResetReligionBuildingSettings {
    const items = {} as ResetReligionBuildingSettings;
    for (const item of ReligionUpgrades) {
      items[item] = new ResetReligionBuildingSetting(item, UnicornItemVariant.OrderOfTheSun);
    }
    for (const item of TranscendenceUpgrades) {
      items[item] = new ResetReligionBuildingSetting(item, UnicornItemVariant.Cryptotheology);
    }
    for (const item of ZigguratUpgrades) {
      items[item] = new ResetReligionBuildingSetting(item, UnicornItemVariant.Ziggurat);
    }
    items.unicornPasture = new ResetReligionBuildingSetting(
      "unicornPasture",
      UnicornItemVariant.UnicornPasture,
    );
    return items;
  }

  load(settings: Maybe<Partial<ResetReligionSettings>>) {
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
