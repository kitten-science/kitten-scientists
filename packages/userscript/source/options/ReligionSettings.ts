import { FaithItem } from "./Options";

export type ReligionSettingsItem = { enabled: boolean };
export class ReligionSettings {
  enabled = false;
  trigger = 0;

  items: {
    [item in FaithItem]: ReligionSettingsItem;
  } = {
    marker: { enabled: false },
    unicornGraveyard: { enabled: false },
    unicornNecropolis: { enabled: false },
    blackPyramid: { enabled: false },

    solarchant: { enabled: true },
    scholasticism: { enabled: true },
    goldenSpire: { enabled: true },
    sunAltar: { enabled: true },
    stainedGlass: { enabled: true },
    solarRevolution: { enabled: true },
    basilica: { enabled: true },
    templars: { enabled: true },
    apocripha: { enabled: false },
    transcendence: { enabled: true },

    blackObelisk: { enabled: false },
    blackNexus: { enabled: false },
    blackCore: { enabled: false },
    singularity: { enabled: false },
    blackLibrary: { enabled: false },
    blackRadiance: { enabled: false },
    blazar: { enabled: false },
    darkNova: { enabled: false },
    holyGenocide: { enabled: false },
  };
}
