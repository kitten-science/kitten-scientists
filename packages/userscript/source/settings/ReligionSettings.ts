import { consumeEntriesPedantic, objectEntries } from "../tools/Entries";
import { isNil, Maybe } from "../tools/Maybe";
import { UnicornItemVariant } from "../types";
import { Requirement, Setting, SettingMax, SettingTrigger } from "./Settings";
import { LegacyStorage } from "./SettingsStorage";

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
  readonly building: FaithItem | UnicornItem;
  readonly require: Requirement;
  readonly variant: UnicornItemVariant;

  constructor(
    building: FaithItem | UnicornItem,
    variant: UnicornItemVariant,
    enabled = false,
    max = -1,
    require: Requirement = false
  ) {
    super(enabled, max);
    this.building = building;
    this.require = require;
    this.variant = variant;
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
      apocripha: new ReligionSettingsItem(
        "apocripha",
        UnicornItemVariant.OrderOfTheSun,
        false,
        -1,
        "faith"
      ),
      basilica: new ReligionSettingsItem(
        "basilica",
        UnicornItemVariant.OrderOfTheSun,
        true,
        -1,
        "faith"
      ),
      blackCore: new ReligionSettingsItem(
        "blackCore",
        UnicornItemVariant.Cryptotheology,
        false,
        -1,
        false
      ),
      blackLibrary: new ReligionSettingsItem(
        "blackLibrary",
        UnicornItemVariant.Cryptotheology,
        false,
        -1,
        false
      ),
      blackNexus: new ReligionSettingsItem(
        "blackNexus",
        UnicornItemVariant.Cryptotheology,
        false,
        -1,
        false
      ),
      blackObelisk: new ReligionSettingsItem(
        "blackObelisk",
        UnicornItemVariant.Cryptotheology,
        false,
        -1,
        false
      ),
      blackPyramid: new ReligionSettingsItem(
        "blackPyramid",
        UnicornItemVariant.Ziggurat,
        false,
        -1,
        "unobtainium"
      ),
      blackRadiance: new ReligionSettingsItem(
        "blackRadiance",
        UnicornItemVariant.Cryptotheology,
        false,
        -1,
        false
      ),
      blazar: new ReligionSettingsItem(
        "blazar",
        UnicornItemVariant.Cryptotheology,
        false,
        -1,
        false
      ),
      darkNova: new ReligionSettingsItem(
        "darkNova",
        UnicornItemVariant.Cryptotheology,
        false,
        -1,
        false
      ),
      goldenSpire: new ReligionSettingsItem(
        "goldenSpire",
        UnicornItemVariant.OrderOfTheSun,
        true,
        -1,
        "faith"
      ),
      holyGenocide: new ReligionSettingsItem(
        "holyGenocide",
        UnicornItemVariant.Cryptotheology,
        false,
        -1,
        false
      ),
      ivoryCitadel: new ReligionSettingsItem(
        "ivoryCitadel",
        UnicornItemVariant.Ziggurat,
        false,
        -1,
        false
      ),
      ivoryTower: new ReligionSettingsItem(
        "ivoryTower",
        UnicornItemVariant.Ziggurat,
        false,
        -1,
        false
      ),
      marker: new ReligionSettingsItem(
        "marker",
        UnicornItemVariant.Ziggurat,
        false,
        -1,
        "unobtainium"
      ),
      scholasticism: new ReligionSettingsItem(
        "scholasticism",
        UnicornItemVariant.OrderOfTheSun,
        true,
        -1,
        "faith"
      ),
      singularity: new ReligionSettingsItem(
        "singularity",
        UnicornItemVariant.Cryptotheology,
        false,
        -1,
        false
      ),
      skyPalace: new ReligionSettingsItem(
        "skyPalace",
        UnicornItemVariant.Ziggurat,
        false,
        -1,
        false
      ),
      solarchant: new ReligionSettingsItem(
        "solarchant",
        UnicornItemVariant.OrderOfTheSun,
        true,
        -1,
        "faith"
      ),
      solarRevolution: new ReligionSettingsItem(
        "solarRevolution",
        UnicornItemVariant.OrderOfTheSun,
        true,
        -1,
        "faith"
      ),
      stainedGlass: new ReligionSettingsItem(
        "stainedGlass",
        UnicornItemVariant.OrderOfTheSun,
        true,
        -1,
        "faith"
      ),
      sunAltar: new ReligionSettingsItem(
        "sunAltar",
        UnicornItemVariant.OrderOfTheSun,
        true,
        -1,
        "faith"
      ),
      sunspire: new ReligionSettingsItem(
        "sunspire",
        UnicornItemVariant.Ziggurat,
        false,
        -1,
        "gold"
      ),
      templars: new ReligionSettingsItem(
        "templars",
        UnicornItemVariant.OrderOfTheSun,
        true,
        -1,
        "faith"
      ),
      transcendence: new ReligionSettingsItem(
        "transcendence",
        UnicornItemVariant.OrderOfTheSun,
        true,
        -1,
        "faith"
      ),
      unicornGraveyard: new ReligionSettingsItem(
        "unicornGraveyard",
        UnicornItemVariant.Ziggurat,
        false,
        -1,
        false
      ),
      unicornNecropolis: new ReligionSettingsItem(
        "unicornNecropolis",
        UnicornItemVariant.Ziggurat,
        false,
        -1,
        false
      ),
      unicornPasture: new ReligionSettingsItem(
        "unicornPasture",
        UnicornItemVariant.UnicornPasture,
        true,
        -1,
        false
      ),
      unicornTomb: new ReligionSettingsItem(
        "unicornTomb",
        UnicornItemVariant.Ziggurat,
        false,
        -1,
        false
      ),
      unicornUtopia: new ReligionSettingsItem(
        "unicornUtopia",
        UnicornItemVariant.Ziggurat,
        false,
        -1,
        "gold"
      ),
    },
    bestUnicornBuilding = new Setting(false),
    autoPraise = new SettingTrigger(true, 0.98),
    adore = new SettingTrigger(false, 0.75),
    transcend = new Setting(false)
  ) {
    super(enabled, trigger);
    this.buildings = buildings;
    this.adore = adore;
    this.autoPraise = autoPraise;
    this.bestUnicornBuilding = bestUnicornBuilding;
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

    this.adore.enabled = settings.adore?.enabled ?? this.adore.enabled;
    this.autoPraise.enabled = settings.autoPraise?.enabled ?? this.autoPraise.enabled;
    this.bestUnicornBuilding.enabled =
      settings.bestUnicornBuilding?.enabled ?? this.bestUnicornBuilding.enabled;
    this.transcend.enabled = settings.transcend?.enabled ?? this.transcend.enabled;
    this.adore.trigger = settings.adore?.trigger ?? this.adore.trigger;
    this.autoPraise.trigger = settings.autoPraise?.trigger ?? this.autoPraise.trigger;
  }

  static toLegacyOptions(settings: ReligionSettings, subject: LegacyStorage) {
    subject.toggles.faith = settings.enabled;
    subject.triggers.faith = settings.trigger;

    for (const [name, item] of objectEntries(settings.buildings)) {
      subject.items[`toggle-${name}` as const] = item.enabled;
      subject.items[`set-${name}-max` as const] = item.max;
    }

    subject.items["toggle-adore"] = settings.adore.enabled;
    subject.items["toggle-autoPraise"] = settings.autoPraise.enabled;
    subject.items["toggle-bestUnicornBuilding"] = settings.bestUnicornBuilding.enabled;
    subject.items["toggle-transcend"] = settings.transcend.enabled;

    subject.items["set-adore-trigger"] = settings.adore.trigger;
    subject.items["set-autoPraise-trigger"] = settings.autoPraise.trigger;
  }

  static fromLegacyOptions(subject: LegacyStorage) {
    const options = new ReligionSettings();
    options.enabled = subject.toggles.faith;
    options.trigger = subject.triggers.faith;

    for (const [name, item] of objectEntries(options.buildings)) {
      item.enabled = subject.items[`toggle-${name}` as const] ?? item.enabled;
      item.max = subject.items[`set-${name}-max` as const] ?? item.max;
    }

    // Load remaining religion settings.
    options.adore.enabled = subject.items["toggle-adore"] ?? options.adore.enabled;
    options.autoPraise.enabled = subject.items["toggle-autoPraise"] ?? options.autoPraise.enabled;
    options.bestUnicornBuilding.enabled =
      subject.items["toggle-bestUnicornBuilding"] ?? options.bestUnicornBuilding.enabled;
    options.transcend.enabled = subject.items["toggle-transcend"] ?? options.transcend.enabled;

    options.adore.trigger = subject.items["set-adore-trigger"] ?? options.adore.trigger;
    options.autoPraise.trigger =
      subject.items["set-autoPraise-trigger"] ?? options.autoPraise.trigger;

    return options;
  }
}
