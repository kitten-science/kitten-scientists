import { ChronoForgeUpgrades, TimeItemVariant, VoidSpaceUpgrades } from "../types";
import { Requirement } from "./Options";
import { SettingsSection } from "./SettingsSection";

/**
 * The upgrades on the Time tab that we have options for.
 */
export type TimeItem = Exclude<ChronoForgeUpgrades | VoidSpaceUpgrades, "usedCryochambers">;
export type TimeSettingsItem = {
  enabled: boolean;
  $enabled?: JQuery<HTMLElement>;

  require: Requirement;

  variant: TimeItemVariant;
};
export class TimeSettings extends SettingsSection {
  trigger = 0;
  $trigger?: JQuery<HTMLElement>;

  items: {
    [item in TimeItem]: TimeSettingsItem;
  } = {
    temporalBattery: { enabled: false, variant: TimeItemVariant.Chronoforge, require: false },
    blastFurnace: { enabled: false, variant: TimeItemVariant.Chronoforge, require: false },
    timeBoiler: { enabled: false, variant: TimeItemVariant.Chronoforge, require: false },
    temporalAccelerator: {
      enabled: false,
      variant: TimeItemVariant.Chronoforge,
      require: false,
    },
    temporalImpedance: { enabled: false, variant: TimeItemVariant.Chronoforge, require: false },
    ressourceRetrieval: { enabled: false, variant: TimeItemVariant.Chronoforge, require: false },

    cryochambers: { enabled: false, variant: TimeItemVariant.VoidSpace, require: false },
    voidHoover: { enabled: false, variant: TimeItemVariant.VoidSpace, require: "antimatter" },
    voidRift: { enabled: false, variant: TimeItemVariant.VoidSpace, require: false },
    chronocontrol: { enabled: false, variant: TimeItemVariant.VoidSpace, require: "temporalFlux" },
    voidResonator: { enabled: false, variant: TimeItemVariant.VoidSpace, require: false },
  };
}
