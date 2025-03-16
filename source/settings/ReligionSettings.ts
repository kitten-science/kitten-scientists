import { type Maybe, isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import {
  type FaithItem,
  ReligionUpgrades,
  TranscendenceUpgrades,
  type UnicornItem,
  UnicornItemVariant,
  type ZiggurathUpgrade,
  ZiggurathUpgrades,
} from "../types/index.js";
import { Setting, SettingThreshold, SettingTrigger, SettingTriggerMax } from "./Settings.js";

export class ReligionSettingsItem extends SettingTriggerMax {
  readonly #building: FaithItem | UnicornItem;
  readonly #variant: UnicornItemVariant;

  get building() {
    return this.#building;
  }
  get variant() {
    return this.#variant;
  }

  constructor(building: FaithItem | UnicornItem, variant: UnicornItemVariant, enabled = false) {
    super(enabled);
    this.#building = building;
    this.#variant = variant;
  }
}

export type ReligionSettingsItems = Record<FaithItem | UnicornItem, ReligionSettingsItem>;

export class ReligionSettings extends SettingTrigger {
  buildings: ReligionSettingsItems;

  /**
   * Build best unicorn building first.
   */
  bestUnicornBuilding: Setting;

  bestUnicornBuildingCurrent: ZiggurathUpgrade | "unicornPasture" | null;

  /**
   * Sacrifice alicorns for time crystals.
   */
  sacrificeAlicorns: SettingThreshold;

  /**
   * Sacrifice unicorns for tears.
   */
  sacrificeUnicorns: SettingThreshold;

  /**
   * Refine tears into BLS.
   */
  refineTears: SettingThreshold;

  /**
   * Refine time crystals into relics.
   */
  refineTimeCrystals: SettingThreshold;

  /**
   * Praise the sun.
   */
  autoPraise: SettingTrigger;

  /**
   * Adore the galaxy.
   */
  adore: SettingTrigger;

  /**
   * Transcend.
   */
  transcend: Setting;

  constructor(
    enabled = false,
    trigger = -1,
    bestUnicornBuilding = new Setting(),
    sacrificeAlicorns = new SettingThreshold(false, -1),
    sacrificeUnicorns = new SettingThreshold(false, -1),
    refineTears = new SettingThreshold(false, -1),
    refineTimeCrystals = new SettingThreshold(false, -1),
    autoPraise = new SettingTrigger(false, 1),
    adore = new SettingTrigger(false, 1),
    transcend = new Setting(),
  ) {
    super(enabled, trigger);
    this.buildings = this.initBuildings();
    this.bestUnicornBuilding = bestUnicornBuilding;
    this.sacrificeAlicorns = sacrificeAlicorns;
    this.sacrificeUnicorns = sacrificeUnicorns;
    this.refineTears = refineTears;
    this.refineTimeCrystals = refineTimeCrystals;
    this.autoPraise = autoPraise;
    this.adore = adore;
    this.transcend = transcend;
    this.bestUnicornBuildingCurrent = null;
  }

  private initBuildings(): ReligionSettingsItems {
    const items = {} as ReligionSettingsItems;
    for (const item of ReligionUpgrades) {
      items[item] = new ReligionSettingsItem(item, UnicornItemVariant.OrderOfTheSun);
    }
    for (const item of TranscendenceUpgrades) {
      items[item] = new ReligionSettingsItem(item, UnicornItemVariant.Cryptotheology);
    }
    for (const item of ZiggurathUpgrades) {
      items[item] = new ReligionSettingsItem(item, UnicornItemVariant.Ziggurat);
    }
    items.unicornPasture = new ReligionSettingsItem(
      "unicornPasture",
      UnicornItemVariant.UnicornPasture,
    );
    return items;
  }

  load(settings: Maybe<Partial<ReligionSettings>>) {
    if (isNil(settings)) {
      return;
    }

    super.load(settings);

    consumeEntriesPedantic(this.buildings, settings.buildings, (building, item) => {
      building.enabled = item?.enabled ?? building.enabled;
      building.max = item?.max ?? building.max;
      building.trigger = item?.trigger ?? building.trigger;
    });

    this.bestUnicornBuilding.load(settings.bestUnicornBuilding);
    this.sacrificeAlicorns.load(settings.sacrificeAlicorns);
    this.sacrificeUnicorns.load(settings.sacrificeUnicorns);
    this.refineTears.load(settings.refineTears);
    this.refineTimeCrystals.load(settings.refineTimeCrystals);
    this.autoPraise.load(settings.autoPraise);
    this.adore.load(settings.adore);
    this.transcend.load(settings.transcend);
    this.bestUnicornBuildingCurrent =
      settings.bestUnicornBuildingCurrent ?? this.bestUnicornBuildingCurrent;
  }
}
