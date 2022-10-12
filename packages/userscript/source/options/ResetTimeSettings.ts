import { objectEntries } from "../tools/Entries";
import { TimeItemVariant } from "../types";
import { Setting, SettingTrigger } from "./Settings";
import { KittenStorageType } from "./SettingsStorage";
import { TimeItem } from "./TimeSettings";

export class ResetTimeBuildingSetting extends SettingTrigger {
  readonly building: TimeItem;
  readonly variant: TimeItemVariant;

  constructor(id: TimeItem, variant: TimeItemVariant, enabled = false, trigger = 1) {
    super(enabled, trigger);
    this.building = id;
    this.variant = variant;
  }
}

export class ResetTimeSettings extends Setting {
  readonly items: {
    [item in TimeItem]: ResetTimeBuildingSetting;
  };

  constructor(
    enabled = false,
    items = {
      blastFurnace: new ResetTimeBuildingSetting(
        "blastFurnace",
        TimeItemVariant.Chronoforge,
        true,
        -1
      ),
      chronocontrol: new ResetTimeBuildingSetting(
        "chronocontrol",
        TimeItemVariant.VoidSpace,
        true,
        -1
      ),
      cryochambers: new ResetTimeBuildingSetting(
        "cryochambers",
        TimeItemVariant.VoidSpace,
        true,
        -1
      ),
      ressourceRetrieval: new ResetTimeBuildingSetting(
        "ressourceRetrieval",
        TimeItemVariant.Chronoforge,
        true,
        -1
      ),
      temporalAccelerator: new ResetTimeBuildingSetting(
        "temporalAccelerator",
        TimeItemVariant.Chronoforge,
        true,
        -1
      ),
      temporalBattery: new ResetTimeBuildingSetting(
        "temporalBattery",
        TimeItemVariant.Chronoforge,
        true,
        -1
      ),
      temporalImpedance: new ResetTimeBuildingSetting(
        "temporalImpedance",
        TimeItemVariant.Chronoforge,
        true,
        -1
      ),
      timeBoiler: new ResetTimeBuildingSetting("timeBoiler", TimeItemVariant.Chronoforge, true, -1),
      voidHoover: new ResetTimeBuildingSetting("voidHoover", TimeItemVariant.VoidSpace, true, -1),
      voidResonator: new ResetTimeBuildingSetting(
        "voidResonator",
        TimeItemVariant.VoidSpace,
        true,
        -1
      ),
      voidRift: new ResetTimeBuildingSetting("voidRift", TimeItemVariant.VoidSpace, true, -1),
    }
  ) {
    super(enabled);
    this.items = items;
  }

  load(settings: ResetTimeSettings) {
    this.enabled = settings.enabled;

    for (const [name, item] of objectEntries(settings.items)) {
      this.items[name].enabled = item.enabled;
      this.items[name].trigger = item.trigger;
    }
  }

  static toLegacyOptions(settings: ResetTimeSettings, subject: KittenStorageType) {
    for (const [name, item] of objectEntries(settings.items)) {
      subject.items[`toggle-reset-time-${name}` as const] = item.enabled;
      subject.items[`set-reset-time-${name}-min` as const] = item.trigger;
    }
  }

  static fromLegacyOptions(subject: KittenStorageType) {
    const options = new ResetTimeSettings();
    options.enabled = true;

    for (const [name, item] of objectEntries(options.items)) {
      item.enabled = subject.items[`toggle-reset-time-${name}` as const] ?? item.enabled;
      item.trigger = subject.items[`set-reset-time-${name}-min` as const] ?? item.trigger;
    }

    return options;
  }
}
