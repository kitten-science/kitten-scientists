import { Maybe, isNil } from "@oliversalzburg/js-utils/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { UnicornItemVariant } from "../types/index.js";
import { Setting, SettingMax, SettingTrigger } from "./Settings.js";

export type FaithItem =
  | "apocripha"
  | "basilica"
  | "blackCore"
  | "blackLibrary"
  | "blackNexus"
  | "blackObelisk"
  | "blackPyramid"
  | "blackRadiance"
  | "blazar"
  | "darkNova"
  | "goldenSpire"
  | "holyGenocide"
  | "marker"
  | "scholasticism"
  | "singularity"
  | "solarchant"
  | "solarRevolution"
  | "stainedGlass"
  | "sunAltar"
  | "templars"
  | "transcendence"
  | "unicornGraveyard"
  | "unicornNecropolis";

export type UnicornItem =
  | "ivoryCitadel"
  | "ivoryTower"
  | "skyPalace"
  | "sunspire"
  | "unicornPasture"
  | "unicornTomb"
  | "unicornUtopia";

export type ReligionItem = FaithItem | UnicornItem;
export type ReligionAdditionItem = "adore" | "autoPraise" | "bestUnicornBuilding" | "transcend";

export class ReligionSettingsItem extends SettingMax {
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
    max = -1,
  ) {
    super(enabled, max);
    this.#building = building;
    this.#variant = variant;
  }
}

export type ReligionSettingsItems = {
  [item in FaithItem | UnicornItem]: ReligionSettingsItem;
};

export class ReligionSettings extends SettingTrigger {
  buildings: ReligionSettingsItems;

  /**
   * Build best unicorn building first.
   */
  bestUnicornBuilding: Setting;

  /**
   * Sacrifice alicorns for time crystals.
   */
  sacrificeAlicorns: SettingTrigger;

  /**
   * Sacrifice unicorns for tears.
   */
  sacrificeUnicorns: SettingTrigger;

  /**
   * Refine tears into BLS.
   */
  refineTears: SettingTrigger;

  /**
   * Refine time crystals into relics.
   */
  refineTimeCrystals: SettingTrigger;

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
    trigger = 1,
    buildings: ReligionSettingsItems = {
      apocripha: new ReligionSettingsItem("apocripha", UnicornItemVariant.OrderOfTheSun, false, -1),
      basilica: new ReligionSettingsItem("basilica", UnicornItemVariant.OrderOfTheSun, true, -1),
      blackCore: new ReligionSettingsItem(
        "blackCore",
        UnicornItemVariant.Cryptotheology,
        false,
        -1,
      ),
      blackLibrary: new ReligionSettingsItem(
        "blackLibrary",
        UnicornItemVariant.Cryptotheology,
        false,
        -1,
      ),
      blackNexus: new ReligionSettingsItem(
        "blackNexus",
        UnicornItemVariant.Cryptotheology,
        false,
        -1,
      ),
      blackObelisk: new ReligionSettingsItem(
        "blackObelisk",
        UnicornItemVariant.Cryptotheology,
        false,
        -1,
      ),
      blackPyramid: new ReligionSettingsItem(
        "blackPyramid",
        UnicornItemVariant.Ziggurat,
        false,
        -1,
      ),
      blackRadiance: new ReligionSettingsItem(
        "blackRadiance",
        UnicornItemVariant.Cryptotheology,
        false,
        -1,
      ),
      blazar: new ReligionSettingsItem("blazar", UnicornItemVariant.Cryptotheology, false, -1),
      darkNova: new ReligionSettingsItem("darkNova", UnicornItemVariant.Cryptotheology, false, -1),
      goldenSpire: new ReligionSettingsItem(
        "goldenSpire",
        UnicornItemVariant.OrderOfTheSun,
        true,
        -1,
      ),
      holyGenocide: new ReligionSettingsItem(
        "holyGenocide",
        UnicornItemVariant.Cryptotheology,
        false,
        -1,
      ),
      ivoryCitadel: new ReligionSettingsItem(
        "ivoryCitadel",
        UnicornItemVariant.Ziggurat,
        false,
        -1,
      ),
      ivoryTower: new ReligionSettingsItem("ivoryTower", UnicornItemVariant.Ziggurat, false, -1),
      marker: new ReligionSettingsItem("marker", UnicornItemVariant.Ziggurat, false, -1),
      scholasticism: new ReligionSettingsItem(
        "scholasticism",
        UnicornItemVariant.OrderOfTheSun,
        true,
        -1,
      ),
      singularity: new ReligionSettingsItem(
        "singularity",
        UnicornItemVariant.Cryptotheology,
        false,
        -1,
      ),
      skyPalace: new ReligionSettingsItem("skyPalace", UnicornItemVariant.Ziggurat, false, -1),
      solarchant: new ReligionSettingsItem(
        "solarchant",
        UnicornItemVariant.OrderOfTheSun,
        true,
        -1,
      ),
      solarRevolution: new ReligionSettingsItem(
        "solarRevolution",
        UnicornItemVariant.OrderOfTheSun,
        true,
        -1,
      ),
      stainedGlass: new ReligionSettingsItem(
        "stainedGlass",
        UnicornItemVariant.OrderOfTheSun,
        true,
        -1,
      ),
      sunAltar: new ReligionSettingsItem("sunAltar", UnicornItemVariant.OrderOfTheSun, true, -1),
      sunspire: new ReligionSettingsItem("sunspire", UnicornItemVariant.Ziggurat, false, -1),
      templars: new ReligionSettingsItem("templars", UnicornItemVariant.OrderOfTheSun, true, -1),
      transcendence: new ReligionSettingsItem(
        "transcendence",
        UnicornItemVariant.OrderOfTheSun,
        true,
        -1,
      ),
      unicornGraveyard: new ReligionSettingsItem(
        "unicornGraveyard",
        UnicornItemVariant.Ziggurat,
        false,
        -1,
      ),
      unicornNecropolis: new ReligionSettingsItem(
        "unicornNecropolis",
        UnicornItemVariant.Ziggurat,
        false,
        -1,
      ),
      unicornPasture: new ReligionSettingsItem(
        "unicornPasture",
        UnicornItemVariant.UnicornPasture,
        true,
        -1,
      ),
      unicornTomb: new ReligionSettingsItem("unicornTomb", UnicornItemVariant.Ziggurat, false, -1),
      unicornUtopia: new ReligionSettingsItem(
        "unicornUtopia",
        UnicornItemVariant.Ziggurat,
        false,
        -1,
      ),
    },
    bestUnicornBuilding = new Setting(false),
    sacrificeAlicorns = new SettingTrigger(false, 25),
    sacrificeUnicorns = new SettingTrigger(false, 1000000),
    refineTears = new SettingTrigger(false, 10000),
    refineTimeCrystals = new SettingTrigger(false, 15000),
    autoPraise = new SettingTrigger(true, 0.98),
    adore = new SettingTrigger(false, 0.75),
    transcend = new Setting(false),
  ) {
    super(enabled, trigger);
    this.buildings = buildings;
    this.bestUnicornBuilding = bestUnicornBuilding;
    this.sacrificeAlicorns = sacrificeAlicorns;
    this.sacrificeUnicorns = sacrificeUnicorns;
    this.refineTears = refineTears;
    this.refineTimeCrystals = refineTimeCrystals;
    this.autoPraise = autoPraise;
    this.adore = adore;
    this.transcend = transcend;
  }

  load(settings: Maybe<Partial<ReligionSettings>>) {
    if (isNil(settings)) {
      return;
    }

    super.load(settings);

    consumeEntriesPedantic(this.buildings, settings.buildings, (building, item) => {
      building.enabled = item?.enabled ?? building.enabled;
      building.max = item?.max ?? building.max;
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
