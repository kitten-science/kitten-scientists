import { objectEntries } from "../tools/Entries";
import { UnicornItemVariant } from "../types";
import { Requirement } from "./Options";
import { Setting, SettingMax, SettingTrigger } from "./Settings";
import { SettingsSectionTrigger } from "./SettingsSection";
import { KittenStorageType } from "./SettingsStorage";

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
  require: Requirement;

  variant: UnicornItemVariant;

  constructor(
    variant: UnicornItemVariant,
    enabled = false,
    max = -1,
    require: Requirement = false
  ) {
    super(enabled, max);
    this.require = require;
    this.variant = variant;
  }
}

export type ReligionSettingsItems = {
  [item in FaithItem | UnicornItem]: ReligionSettingsItem;
};

export class ReligionSettings extends SettingsSectionTrigger {
  addition: {
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
  } = {
    bestUnicornBuilding: new Setting(true),
    autoPraise: new SettingTrigger(true, 0.98),
    adore: new SettingTrigger(false, 0.75),
    transcend: new Setting(false),
  };

  items: ReligionSettingsItems;

  constructor(
    enabled = false,
    trigger = 1,
    items: ReligionSettingsItems = {
      unicornPasture: new ReligionSettingsItem(UnicornItemVariant.UnicornPasture, true, -1, false),
      unicornTomb: new ReligionSettingsItem(UnicornItemVariant.Ziggurat, false, -1, false),
      ivoryTower: new ReligionSettingsItem(UnicornItemVariant.Ziggurat, false, -1, false),
      ivoryCitadel: new ReligionSettingsItem(UnicornItemVariant.Ziggurat, false, -1, false),
      skyPalace: new ReligionSettingsItem(UnicornItemVariant.Ziggurat, false, -1, false),
      unicornUtopia: new ReligionSettingsItem(UnicornItemVariant.Ziggurat, false, -1, "gold"),
      sunspire: new ReligionSettingsItem(UnicornItemVariant.Ziggurat, false, -1, "gold"),

      marker: new ReligionSettingsItem(UnicornItemVariant.Ziggurat, false, -1, "unobtainium"),
      unicornGraveyard: new ReligionSettingsItem(UnicornItemVariant.Ziggurat, false, -1, false),
      unicornNecropolis: new ReligionSettingsItem(UnicornItemVariant.Ziggurat, false, -1, false),
      blackPyramid: new ReligionSettingsItem(UnicornItemVariant.Ziggurat, false, -1, "unobtainium"),

      solarchant: new ReligionSettingsItem(UnicornItemVariant.OrderOfTheSun, true, -1, "faith"),
      scholasticism: new ReligionSettingsItem(UnicornItemVariant.OrderOfTheSun, true, -1, "faith"),
      goldenSpire: new ReligionSettingsItem(UnicornItemVariant.OrderOfTheSun, true, -1, "faith"),
      sunAltar: new ReligionSettingsItem(UnicornItemVariant.OrderOfTheSun, true, -1, "faith"),
      stainedGlass: new ReligionSettingsItem(UnicornItemVariant.OrderOfTheSun, true, -1, "faith"),
      solarRevolution: new ReligionSettingsItem(
        UnicornItemVariant.OrderOfTheSun,
        true,
        -1,
        "faith"
      ),
      basilica: new ReligionSettingsItem(UnicornItemVariant.OrderOfTheSun, true, -1, "faith"),
      templars: new ReligionSettingsItem(UnicornItemVariant.OrderOfTheSun, true, -1, "faith"),
      apocripha: new ReligionSettingsItem(UnicornItemVariant.OrderOfTheSun, false, -1, "faith"),
      transcendence: new ReligionSettingsItem(UnicornItemVariant.OrderOfTheSun, true, -1, "faith"),

      blackObelisk: new ReligionSettingsItem(UnicornItemVariant.Cryptotheology, false, -1, false),
      blackNexus: new ReligionSettingsItem(UnicornItemVariant.Cryptotheology, false, -1, false),
      blackCore: new ReligionSettingsItem(UnicornItemVariant.Cryptotheology, false, -1, false),
      singularity: new ReligionSettingsItem(UnicornItemVariant.Cryptotheology, false, -1, false),
      blackLibrary: new ReligionSettingsItem(UnicornItemVariant.Cryptotheology, false, -1, false),
      blackRadiance: new ReligionSettingsItem(UnicornItemVariant.Cryptotheology, false, -1, false),
      blazar: new ReligionSettingsItem(UnicornItemVariant.Cryptotheology, false, -1, false),
      darkNova: new ReligionSettingsItem(UnicornItemVariant.Cryptotheology, false, -1, false),
      holyGenocide: new ReligionSettingsItem(UnicornItemVariant.Cryptotheology, false, -1, false),
    },
    bestUnicornBuilding = new Setting(true),
    autoPraise = new SettingTrigger(true, 0.98),
    adore = new SettingTrigger(false, 0.75),
    transcend = new Setting(false)
  ) {
    super(enabled, trigger);
    this.items = items;
    this.addition.adore = adore;
    this.addition.autoPraise = autoPraise;
    this.addition.bestUnicornBuilding = bestUnicornBuilding;
    this.addition.transcend = transcend;
  }

  static toLegacyOptions(settings: ReligionSettings, subject: KittenStorageType) {
    subject.toggles.faith = settings.enabled;
    subject.triggers.faith = settings.trigger;

    for (const [name, item] of objectEntries(settings.items)) {
      subject.items[`toggle-${name}` as const] = item.enabled;
      subject.items[`set-${name}-max` as const] = item.max;
    }

    subject.items["toggle-adore"] = settings.addition.adore.enabled;
    subject.items["toggle-autoPraise"] = settings.addition.autoPraise.enabled;
    subject.items["toggle-bestUnicornBuilding"] = settings.addition.bestUnicornBuilding.enabled;
    subject.items["toggle-transcend"] = settings.addition.transcend.enabled;

    subject.items["set-adore-trigger"] = settings.addition.adore.trigger;
    subject.items["set-autoPraise-trigger"] = settings.addition.autoPraise.trigger;
  }

  static fromLegacyOptions(subject: KittenStorageType) {
    const options = new ReligionSettings();
    options.enabled = subject.toggles.faith;
    options.trigger = subject.triggers.faith;

    for (const [name, item] of objectEntries(options.items)) {
      item.enabled = subject.items[`toggle-${name}` as const] ?? item.enabled;
      item.max = subject.items[`set-${name}-max` as const] ?? item.max;
    }

    // Load remaining religion settings.
    options.addition.adore.enabled =
      subject.items["toggle-adore"] ?? options.addition.adore.enabled;

    options.addition.autoPraise.enabled =
      subject.items["toggle-autoPraise"] ?? options.addition.autoPraise.enabled;

    options.addition.bestUnicornBuilding.enabled =
      subject.items["toggle-bestUnicornBuilding"] ?? options.addition.bestUnicornBuilding.enabled;

    options.addition.transcend.enabled =
      subject.items["toggle-transcend"] ?? options.addition.transcend.enabled;

    options.addition.adore.trigger =
      subject.items["set-adore-trigger"] ?? options.addition.adore.trigger;

    options.addition.autoPraise.trigger =
      subject.items["set-autoPraise-trigger"] ?? options.addition.autoPraise.trigger;

    return options;
  }
}
