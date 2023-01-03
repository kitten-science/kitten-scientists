import { consumeEntriesPedantic, objectEntries } from "../tools/Entries";
import { isNil, Maybe } from "../tools/Maybe";
import { ChronoForgeUpgrades, TimeItemVariant, VoidSpaceUpgrades } from "../types";
import { Requirement, Setting, SettingMax, SettingTrigger } from "./Settings";
import { LegacyStorage } from "./SettingsStorage";

/**
 * The upgrades on the Time tab that we have options for.
 */
export type TimeItem = Exclude<ChronoForgeUpgrades | VoidSpaceUpgrades, "usedCryochambers">;

export class TimeSettingsItem extends SettingMax {
  readonly building: TimeItem;
  readonly require: Requirement;
  readonly variant: TimeItemVariant;

  constructor(
    building: TimeItem,
    variant: TimeItemVariant,
    require: Requirement = false,
    enabled = false
  ) {
    super(enabled);
    this.building = building;
    this.require = require;
    this.variant = variant;
  }
}

export type TimeBuildingsSettings = Record<TimeItem, TimeSettingsItem>;

export class TimeSettings extends SettingTrigger {
  buildings: TimeBuildingsSettings;

  fixCryochambers: Setting;
  turnOnChronoFurnace: Setting;

  constructor(
    enabled = false,
    trigger = 1,
    buildings: TimeBuildingsSettings = {
      blastFurnace: new TimeSettingsItem("blastFurnace", TimeItemVariant.Chronoforge),
      chronocontrol: new TimeSettingsItem(
        "chronocontrol",
        TimeItemVariant.VoidSpace,
        "temporalFlux"
      ),
      cryochambers: new TimeSettingsItem("cryochambers", TimeItemVariant.VoidSpace),
      ressourceRetrieval: new TimeSettingsItem("ressourceRetrieval", TimeItemVariant.Chronoforge),
      temporalAccelerator: new TimeSettingsItem("temporalAccelerator", TimeItemVariant.Chronoforge),
      temporalBattery: new TimeSettingsItem("temporalBattery", TimeItemVariant.Chronoforge),
      temporalImpedance: new TimeSettingsItem("temporalImpedance", TimeItemVariant.Chronoforge),
      timeBoiler: new TimeSettingsItem("timeBoiler", TimeItemVariant.Chronoforge),
      voidHoover: new TimeSettingsItem("voidHoover", TimeItemVariant.VoidSpace, "antimatter"),
      voidResonator: new TimeSettingsItem("voidResonator", TimeItemVariant.VoidSpace),
      voidRift: new TimeSettingsItem("voidRift", TimeItemVariant.VoidSpace),
    },
    fixCryochambers = new Setting(false),
    turnOnChronoFurnace = new Setting(false)
  ) {
    super(enabled, trigger);
    this.buildings = buildings;
    this.fixCryochambers = fixCryochambers;
    this.turnOnChronoFurnace = turnOnChronoFurnace;
  }

  load(settings: Maybe<Partial<TimeSettings>>) {
    if (isNil(settings)) {
      return;
    }

    super.load(settings);

    consumeEntriesPedantic(this.buildings, settings.buildings, (building, item) => {
      building.enabled = item?.enabled ?? building.enabled;
      building.max = item?.max ?? building.max;
    });
  }

  static fromLegacyOptions(subject: LegacyStorage) {
    const settings = new TimeSettings();
    settings.enabled = subject.toggles.time;
    settings.trigger = subject.triggers.time;

    for (const [name, item] of objectEntries(settings.buildings)) {
      item.enabled = subject.items[`toggle-${name}` as const] ?? item.enabled;
      item.max = subject.items[`set-${name}-max` as const] ?? item.max;
    }

    settings.fixCryochambers.enabled =
      subject.items[`toggle-fixCry`] ?? settings.fixCryochambers.enabled;

    return settings;
  }
}
