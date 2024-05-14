import { Maybe, isNil } from "@oliversalzburg/js-utils/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import {
  ReligionUpgradesArray,
  TranscendenceUpgradesArray,
  UnicornItemVariant,
  ZiggurathUpgradesArray,
} from "../types/index.js";
import { FaithItem, UnicornItem } from "./ReligionSettings.js";
import { Setting, SettingTrigger } from "./Settings.js";

export class ResetReligionBuildingSetting extends SettingTrigger {
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
    trigger = -1,
  ) {
    super(enabled, trigger);
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

  constructor(enabled = false) {
    super(enabled);
    this.buildings = this.initBuildings();
  }

  private initBuildings(): ResetReligionBuildingSettings {
    const items = {} as ResetReligionBuildingSettings;
    ReligionUpgradesArray.forEach(item => {
      items[item] = new ResetReligionBuildingSetting(item, UnicornItemVariant.OrderOfTheSun);
    });
    TranscendenceUpgradesArray.forEach(item => {
      items[item] = new ResetReligionBuildingSetting(item, UnicornItemVariant.Cryptotheology);
    });
    ZiggurathUpgradesArray.forEach(item => {
      items[item] = new ResetReligionBuildingSetting(item, UnicornItemVariant.Ziggurat);
    });
    items["unicornPasture"] = new ResetReligionBuildingSetting(
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
