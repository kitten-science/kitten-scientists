import { UnicornItemVariant } from "../types";
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
    unicornPasture: { enabled: true, variant: UnicornItemVariant.Unknown_zp },
    unicornTomb: { enabled: false, variant: UnicornItemVariant.Ziggurat },
    ivoryTower: { enabled: false, variant: UnicornItemVariant.Ziggurat },
    ivoryCitadel: { enabled: false, variant: UnicornItemVariant.Ziggurat },
    skyPalace: { enabled: false, variant: UnicornItemVariant.Ziggurat },
    unicornUtopia: { enabled: false, variant: UnicornItemVariant.Ziggurat },
    sunspire: { enabled: false, variant: UnicornItemVariant.Ziggurat },

    marker: { enabled: false, variant: UnicornItemVariant.Ziggurat },
    unicornGraveyard: { enabled: false, variant: UnicornItemVariant.Ziggurat },
    unicornNecropolis: { enabled: false, variant: UnicornItemVariant.Ziggurat },
    blackPyramid: { enabled: false, variant: UnicornItemVariant.Ziggurat },

    solarchant: { enabled: true, variant: UnicornItemVariant.OrderOfTheSun },
    scholasticism: { enabled: true, variant: UnicornItemVariant.OrderOfTheSun },
    goldenSpire: { enabled: true, variant: UnicornItemVariant.OrderOfTheSun },
    sunAltar: { enabled: true, variant: UnicornItemVariant.OrderOfTheSun },
    stainedGlass: { enabled: true, variant: UnicornItemVariant.OrderOfTheSun },
    solarRevolution: { enabled: true, variant: UnicornItemVariant.OrderOfTheSun },
    basilica: { enabled: true, variant: UnicornItemVariant.OrderOfTheSun },
    templars: { enabled: true, variant: UnicornItemVariant.OrderOfTheSun },
    apocripha: { enabled: false, variant: UnicornItemVariant.OrderOfTheSun },
    transcendence: { enabled: true, variant: UnicornItemVariant.OrderOfTheSun },

    blackObelisk: { enabled: false, variant: UnicornItemVariant.Cryptotheology },
    blackNexus: { enabled: false, variant: UnicornItemVariant.Cryptotheology },
    blackCore: { enabled: false, variant: UnicornItemVariant.Cryptotheology },
    singularity: { enabled: false, variant: UnicornItemVariant.Cryptotheology },
    blackLibrary: { enabled: false, variant: UnicornItemVariant.Cryptotheology },
    blackRadiance: { enabled: false, variant: UnicornItemVariant.Cryptotheology },
    blazar: { enabled: false, variant: UnicornItemVariant.Cryptotheology },
    darkNova: { enabled: false, variant: UnicornItemVariant.Cryptotheology },
    holyGenocide: { enabled: false, variant: UnicornItemVariant.Cryptotheology },
  };
}
