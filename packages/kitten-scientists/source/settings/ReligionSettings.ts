import { Maybe, isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import {
  ReligionUpgrade,
  ReligionUpgrades,
  TranscendenceUpgrade,
  TranscendenceUpgrades,
  UnicornItemVariant,
  ZiggurathUpgrade,
  ZiggurathUpgrades,
} from "../types/index.js";
import { Setting, SettingThreshold, SettingTrigger, SettingTriggerMax } from "./Settings.js";

export type FaithItem = Exclude<ReligionItem, UnicornItem>;

export const UnicornItems = [
  "ivoryCitadel",
  "ivoryTower",
  "skyPalace",
  "sunspire",
  "unicornPasture",
  "unicornTomb",
  "unicornUtopia",
] as const;
export type UnicornItem = (typeof UnicornItems)[number];

export type ReligionItem = ReligionUpgrade | TranscendenceUpgrade | ZiggurathUpgrade;
export type ReligionAdditionItem = "adore" | "autoPraise" | "bestUnicornBuilding" | "transcend";

export const ReligionOptions = [
  "sacrificeUnicorns",
  "sacrificeAlicorns",
  "refineTears",
  "refineTimeCrystals",
  "transcend",
  "adore",
  "autoPraise",
] as const;
export type ReligionOption = (typeof ReligionOptions)[number];

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
    bestUnicornBuilding = new Setting(false),
    sacrificeAlicorns = new SettingThreshold(false, 25),
    sacrificeUnicorns = new SettingThreshold(false, 1000000),
    refineTears = new SettingThreshold(false, 10000),
    refineTimeCrystals = new SettingThreshold(false, 15000),
    autoPraise = new SettingTrigger(true, 0.98),
    adore = new SettingTrigger(false, 0.75),
    transcend = new Setting(false),
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
  }

  private initBuildings(): ReligionSettingsItems {
    const defaultOffBuilding: Array<ReligionUpgrade> = ["apocripha"];
    const items = {} as ReligionSettingsItems;
    ReligionUpgrades.forEach(item => {
      items[item] = new ReligionSettingsItem(
        item,
        UnicornItemVariant.OrderOfTheSun,
        !defaultOffBuilding.includes(item),
      );
    });
    TranscendenceUpgrades.forEach(item => {
      items[item] = new ReligionSettingsItem(item, UnicornItemVariant.Cryptotheology, false);
    });
    ZiggurathUpgrades.forEach(item => {
      items[item] = new ReligionSettingsItem(item, UnicornItemVariant.Ziggurat, false);
    });
    items["unicornPasture"] = new ReligionSettingsItem(
      "unicornPasture",
      UnicornItemVariant.UnicornPasture,
      true,
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
  }
}
