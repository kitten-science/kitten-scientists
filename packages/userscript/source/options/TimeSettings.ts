import { TimeItem } from "./Options";

export type TimeSettingsItem = { enabled: boolean };
export class TimeSettings {
  enabled = false;
  trigger = 0;

  items: {
    [item in TimeItem]: TimeSettingsItem;
  } = {
    temporalBattery: { enabled: false },
    blastFurnace: { enabled: false },
    timeBoiler: { enabled: false },
    temporalAccelerator: { enabled: false },
    temporalImpedance: { enabled: false },
    ressourceRetrieval: { enabled: false },

    cryochambers: { enabled: false },
    voidHoover: { enabled: false },
    voidRift: { enabled: false },
    chronocontrol: { enabled: false },
    voidResonator: { enabled: false },
  };
}
