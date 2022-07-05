import { objectEntries } from "../tools/Entries";
import { ChronoForgeUpgrades, TimeItemVariant, VoidSpaceUpgrades } from "../types";
import { Requirement } from "./Options";
import { SettingsSection, SettingToggle, SettingTrigger } from "./SettingsSection";
import { KittenStorageType } from "./SettingsStorage";

/**
 * The upgrades on the Time tab that we have options for.
 */
export type TimeItem = Exclude<ChronoForgeUpgrades | VoidSpaceUpgrades, "usedCryochambers">;
export type TimeSettingsItem = SettingToggle & {
  require: Requirement;

  variant: TimeItemVariant;
};
export class TimeSettings extends SettingsSection implements SettingTrigger {
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

  static toLegacyOptions(settings: TimeSettings, subject: KittenStorageType) {
    subject.toggles.time = settings.enabled;
    subject.triggers.time = settings.trigger;

    for (const [name, item] of objectEntries(settings.items)) {
      subject.items[`toggle-${name}` as const] = item.enabled;
    }
  }

  static fromLegacyOptions(subject: KittenStorageType) {
    const options = new TimeSettings();
    options.enabled = subject.toggles.time;
    options.trigger = subject.triggers.time;

    for (const [name, item] of objectEntries(options.items)) {
      item.enabled = subject.items[`toggle-${name}` as const] ?? item.enabled;
    }
    return options;
  }
}
