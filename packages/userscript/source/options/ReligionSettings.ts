import { objectEntries } from "../tools/Entries";
import { UnicornItemVariant } from "../types";
import { Requirement } from "./Options";
import { SettingLimit, SettingsSection, SettingToggle, SettingTrigger } from "./SettingsSection";
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
export type ReligionSettingsItem = SettingToggle &
  SettingLimit & {
    require: Requirement;

    variant: UnicornItemVariant;
  };

export class ReligionSettings extends SettingsSection implements SettingTrigger {
  trigger = 0;
  $trigger?: JQuery<HTMLElement>;

  addition: {
    /**
     * Build best unicorn building first.
     */
    bestUnicornBuilding: SettingToggle;
    /**
     * Praise the sun.
     */
    autoPraise: SettingToggle & {
      subTrigger: number;
      $subTrigger?: JQuery<HTMLElement>;
    };
    /**
     * Adore the galaxy.
     */
    adore: SettingToggle & {
      subTrigger: number;
      $subTrigger?: JQuery<HTMLElement>;
    };
    /**
     * Transcend.
     */
    transcend: SettingToggle;
  } = {
    bestUnicornBuilding: {
      enabled: true,
    },
    autoPraise: {
      enabled: true,
      subTrigger: 0.98,
    },
    adore: {
      enabled: false,
      subTrigger: 0.75,
    },
    transcend: {
      enabled: false,
    },
  };

  items: {
    [item in FaithItem | UnicornItem]: ReligionSettingsItem;
  } = {
    unicornPasture: {
      enabled: true,
      variant: UnicornItemVariant.UnicornPasture,
      require: false,
      max: -1,
    },
    unicornTomb: { enabled: false, variant: UnicornItemVariant.Ziggurat, require: false, max: -1 },
    ivoryTower: { enabled: false, variant: UnicornItemVariant.Ziggurat, require: false, max: -1 },
    ivoryCitadel: { enabled: false, variant: UnicornItemVariant.Ziggurat, require: false, max: -1 },
    skyPalace: { enabled: false, variant: UnicornItemVariant.Ziggurat, require: false, max: -1 },
    unicornUtopia: {
      enabled: false,
      variant: UnicornItemVariant.Ziggurat,
      require: "gold",
      max: -1,
    },
    sunspire: { enabled: false, variant: UnicornItemVariant.Ziggurat, require: "gold", max: -1 },

    marker: {
      enabled: false,
      variant: UnicornItemVariant.Ziggurat,
      require: "unobtainium",
      max: -1,
    },
    unicornGraveyard: {
      enabled: false,
      variant: UnicornItemVariant.Ziggurat,
      require: false,
      max: -1,
    },
    unicornNecropolis: {
      enabled: false,
      variant: UnicornItemVariant.Ziggurat,
      require: false,
      max: -1,
    },
    blackPyramid: {
      enabled: false,
      variant: UnicornItemVariant.Ziggurat,
      require: "unobtainium",
      max: -1,
    },

    solarchant: {
      enabled: true,
      variant: UnicornItemVariant.OrderOfTheSun,
      require: "faith",
      max: -1,
    },
    scholasticism: {
      enabled: true,
      variant: UnicornItemVariant.OrderOfTheSun,
      require: "faith",
      max: -1,
    },
    goldenSpire: {
      enabled: true,
      variant: UnicornItemVariant.OrderOfTheSun,
      require: "faith",
      max: -1,
    },
    sunAltar: {
      enabled: true,
      variant: UnicornItemVariant.OrderOfTheSun,
      require: "faith",
      max: -1,
    },
    stainedGlass: {
      enabled: true,
      variant: UnicornItemVariant.OrderOfTheSun,
      require: "faith",
      max: -1,
    },
    solarRevolution: {
      enabled: true,
      variant: UnicornItemVariant.OrderOfTheSun,
      require: "faith",
      max: -1,
    },
    basilica: {
      enabled: true,
      variant: UnicornItemVariant.OrderOfTheSun,
      require: "faith",
      max: -1,
    },
    templars: {
      enabled: true,
      variant: UnicornItemVariant.OrderOfTheSun,
      require: "faith",
      max: -1,
    },
    apocripha: {
      enabled: false,
      variant: UnicornItemVariant.OrderOfTheSun,
      require: "faith",
      max: -1,
    },
    transcendence: {
      enabled: true,
      variant: UnicornItemVariant.OrderOfTheSun,
      require: "faith",
      max: -1,
    },

    blackObelisk: {
      enabled: false,
      variant: UnicornItemVariant.Cryptotheology,
      require: false,
      max: -1,
    },
    blackNexus: {
      enabled: false,
      variant: UnicornItemVariant.Cryptotheology,
      require: false,
      max: -1,
    },
    blackCore: {
      enabled: false,
      variant: UnicornItemVariant.Cryptotheology,
      require: false,
      max: -1,
    },
    singularity: {
      enabled: false,
      variant: UnicornItemVariant.Cryptotheology,
      require: false,
      max: -1,
    },
    blackLibrary: {
      enabled: false,
      variant: UnicornItemVariant.Cryptotheology,
      require: false,
      max: -1,
    },
    blackRadiance: {
      enabled: false,
      variant: UnicornItemVariant.Cryptotheology,
      require: false,
      max: -1,
    },
    blazar: { enabled: false, variant: UnicornItemVariant.Cryptotheology, require: false, max: -1 },
    darkNova: {
      enabled: false,
      variant: UnicornItemVariant.Cryptotheology,
      require: false,
      max: -1,
    },
    holyGenocide: {
      enabled: false,
      variant: UnicornItemVariant.Cryptotheology,
      require: false,
      max: -1,
    },
  };

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

    options.addition.adore.subTrigger =
      subject.items["set-adore-subTrigger"] ?? options.addition.adore.subTrigger;

    options.addition.autoPraise.subTrigger =
      subject.items["set-autoPraise-subTrigger"] ?? options.addition.autoPraise.subTrigger;

    return options;
  }
}
