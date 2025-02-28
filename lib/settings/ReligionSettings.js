import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import {
  ReligionUpgrades,
  TranscendenceUpgrades,
  UnicornItemVariant,
  ZiggurathUpgrades,
} from "../types/index.js";
import { Setting, SettingThreshold, SettingTrigger, SettingTriggerMax } from "./Settings.js";
export const UnicornItems = [
  "ivoryCitadel",
  "ivoryTower",
  "skyPalace",
  "sunspire",
  "unicornPasture",
  "unicornTomb",
  "unicornUtopia",
];
export const ReligionOptions = [
  "sacrificeUnicorns",
  "sacrificeAlicorns",
  "refineTears",
  "refineTimeCrystals",
  "transcend",
  "adore",
  "autoPraise",
];
export class ReligionSettingsItem extends SettingTriggerMax {
  #building;
  #variant;
  get building() {
    return this.#building;
  }
  get variant() {
    return this.#variant;
  }
  constructor(building, variant, enabled = false) {
    super(enabled);
    this.#building = building;
    this.#variant = variant;
  }
}
export class ReligionSettings extends SettingTrigger {
  buildings;
  /**
   * Build best unicorn building first.
   */
  bestUnicornBuilding;
  bestUnicornBuildingCurrent;
  /**
   * Sacrifice alicorns for time crystals.
   */
  sacrificeAlicorns;
  /**
   * Sacrifice unicorns for tears.
   */
  sacrificeUnicorns;
  /**
   * Refine tears into BLS.
   */
  refineTears;
  /**
   * Refine time crystals into relics.
   */
  refineTimeCrystals;
  /**
   * Praise the sun.
   */
  autoPraise;
  /**
   * Adore the galaxy.
   */
  adore;
  /**
   * Transcend.
   */
  transcend;
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
  initBuildings() {
    const items = {};
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
  load(settings) {
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
//# sourceMappingURL=ReligionSettings.js.map
