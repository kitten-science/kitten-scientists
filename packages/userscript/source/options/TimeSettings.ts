import { TimeItem, TimeItemVariant } from "./OptionsLegacy";
import { SettingsSection } from "./SettingsSection";

export type TimeSettingsItem = {
  enabled: boolean;
  $enabled?: JQuery<HTMLElement>;
  variant: TimeItemVariant;
};
export class TimeSettings extends SettingsSection {
  trigger = 0;
  $trigger?: JQuery<HTMLElement>;

  items: {
    [item in TimeItem]: TimeSettingsItem;
  } = {
    temporalBattery: { enabled: false, variant: TimeItemVariant.Unknown_chrono },
    blastFurnace: { enabled: false, variant: TimeItemVariant.Unknown_chrono },
    timeBoiler: { enabled: false, variant: TimeItemVariant.Unknown_chrono },
    temporalAccelerator: { enabled: false, variant: TimeItemVariant.Unknown_chrono },
    temporalImpedance: { enabled: false, variant: TimeItemVariant.Unknown_chrono },
    ressourceRetrieval: { enabled: false, variant: TimeItemVariant.Unknown_chrono },

    cryochambers: { enabled: false, variant: TimeItemVariant.VoidSpace },
    voidHoover: { enabled: false, variant: TimeItemVariant.VoidSpace },
    voidRift: { enabled: false, variant: TimeItemVariant.VoidSpace },
    chronocontrol: { enabled: false, variant: TimeItemVariant.VoidSpace },
    voidResonator: { enabled: false, variant: TimeItemVariant.VoidSpace },
  };
}
