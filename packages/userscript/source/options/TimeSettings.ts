import { TimeItem } from "./Options";
import { SettingsSection } from "./SettingsSection";

export type TimeSettingsItem = { enabled: boolean; $enabled?: JQuery<HTMLElement> };
export class TimeSettings extends SettingsSection {
  trigger = 0;
  $trigger?: JQuery<HTMLElement>;

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
