import { UnicornItemVariant } from "../types";
import { Requirement } from "./Options";
import { SettingsSection } from "./SettingsSection";

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

export type ReligionAdditionItem = "adore" | "autoPraise" | "bestUnicornBuilding" | "transcend";
export type ReligionSettingsItem = {
  enabled: boolean;
  $enabled?: JQuery<HTMLElement>;

  require: Requirement;

  variant: UnicornItemVariant;
};
export class ReligionSettings extends SettingsSection {
  trigger = 0;
  $trigger?: JQuery<HTMLElement>;

  addition: {
    bestUnicornBuilding: {
      enabled: boolean;
      $enabled?: JQuery<HTMLElement>;
    };
    autoPraise: {
      enabled: boolean;
      $enabled?: JQuery<HTMLElement>;

      subTrigger: number;
      $subTrigger?: JQuery<HTMLElement>;
    };
    adore: {
      enabled: boolean;
      $enabled?: JQuery<HTMLElement>;

      subTrigger: number;
      $subTrigger?: JQuery<HTMLElement>;
    };
    transcend: {
      enabled: boolean;
      $enabled?: JQuery<HTMLElement>;
    };
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
    unicornPasture: { enabled: true, variant: UnicornItemVariant.Unknown_zp, require: false },
    unicornTomb: { enabled: false, variant: UnicornItemVariant.Ziggurat, require: false },
    ivoryTower: { enabled: false, variant: UnicornItemVariant.Ziggurat, require: false },
    ivoryCitadel: { enabled: false, variant: UnicornItemVariant.Ziggurat, require: false },
    skyPalace: { enabled: false, variant: UnicornItemVariant.Ziggurat, require: false },
    unicornUtopia: { enabled: false, variant: UnicornItemVariant.Ziggurat, require: "gold" },
    sunspire: { enabled: false, variant: UnicornItemVariant.Ziggurat, require: "gold" },

    marker: { enabled: false, variant: UnicornItemVariant.Ziggurat, require: "unobtainium" },
    unicornGraveyard: { enabled: false, variant: UnicornItemVariant.Ziggurat, require: false },
    unicornNecropolis: { enabled: false, variant: UnicornItemVariant.Ziggurat, require: false },
    blackPyramid: { enabled: false, variant: UnicornItemVariant.Ziggurat, require: "unobtainium" },

    solarchant: { enabled: true, variant: UnicornItemVariant.OrderOfTheSun, require: "faith" },
    scholasticism: { enabled: true, variant: UnicornItemVariant.OrderOfTheSun, require: "faith" },
    goldenSpire: { enabled: true, variant: UnicornItemVariant.OrderOfTheSun, require: "faith" },
    sunAltar: { enabled: true, variant: UnicornItemVariant.OrderOfTheSun, require: "faith" },
    stainedGlass: { enabled: true, variant: UnicornItemVariant.OrderOfTheSun, require: "faith" },
    solarRevolution: { enabled: true, variant: UnicornItemVariant.OrderOfTheSun, require: "faith" },
    basilica: { enabled: true, variant: UnicornItemVariant.OrderOfTheSun, require: "faith" },
    templars: { enabled: true, variant: UnicornItemVariant.OrderOfTheSun, require: "faith" },
    apocripha: { enabled: false, variant: UnicornItemVariant.OrderOfTheSun, require: "faith" },
    transcendence: { enabled: true, variant: UnicornItemVariant.OrderOfTheSun, require: "faith" },

    blackObelisk: { enabled: false, variant: UnicornItemVariant.Cryptotheology, require: false },
    blackNexus: { enabled: false, variant: UnicornItemVariant.Cryptotheology, require: false },
    blackCore: { enabled: false, variant: UnicornItemVariant.Cryptotheology, require: false },
    singularity: { enabled: false, variant: UnicornItemVariant.Cryptotheology, require: false },
    blackLibrary: { enabled: false, variant: UnicornItemVariant.Cryptotheology, require: false },
    blackRadiance: { enabled: false, variant: UnicornItemVariant.Cryptotheology, require: false },
    blazar: { enabled: false, variant: UnicornItemVariant.Cryptotheology, require: false },
    darkNova: { enabled: false, variant: UnicornItemVariant.Cryptotheology, require: false },
    holyGenocide: { enabled: false, variant: UnicornItemVariant.Cryptotheology, require: false },
  };
}
