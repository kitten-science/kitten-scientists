import { UnicornItemVariant } from "../types";
import { FaithItem, UnicornItem } from "./Options";

export type ReligionSettingsItem = { enabled: boolean; variant: UnicornItemVariant };
export class ReligionSettings {
  enabled = false;
  trigger = 0;

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
