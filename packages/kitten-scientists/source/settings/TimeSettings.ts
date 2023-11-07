import { Maybe, isNil } from "@oliversalzburg/js-utils/lib/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { ChronoForgeUpgrades, TimeItemVariant, VoidSpaceUpgrades } from "../types/index.js";
import { Setting, SettingMax, SettingTrigger } from "./Settings.js";

/**
 * The upgrades on the Time tab that we have options for.
 */
export type TimeItem = Exclude<ChronoForgeUpgrades | VoidSpaceUpgrades, "usedCryochambers">;

export class TimeSettingsItem extends SettingMax {
  readonly #building: TimeItem;
  readonly #variant: TimeItemVariant;

  get building() {
    return this.#building;
  }
  get variant() {
    return this.#variant;
  }

  constructor(building: TimeItem, variant: TimeItemVariant, enabled = false) {
    super(enabled);
    this.#building = building;
    this.#variant = variant;
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
      chronocontrol: new TimeSettingsItem("chronocontrol", TimeItemVariant.VoidSpace),
      cryochambers: new TimeSettingsItem("cryochambers", TimeItemVariant.VoidSpace),
      ressourceRetrieval: new TimeSettingsItem("ressourceRetrieval", TimeItemVariant.Chronoforge),
      temporalAccelerator: new TimeSettingsItem("temporalAccelerator", TimeItemVariant.Chronoforge),
      temporalBattery: new TimeSettingsItem("temporalBattery", TimeItemVariant.Chronoforge),
      temporalImpedance: new TimeSettingsItem("temporalImpedance", TimeItemVariant.Chronoforge),
      temporalPress: new TimeSettingsItem("temporalPress", TimeItemVariant.Chronoforge),
      timeBoiler: new TimeSettingsItem("timeBoiler", TimeItemVariant.Chronoforge),
      voidHoover: new TimeSettingsItem("voidHoover", TimeItemVariant.VoidSpace),
      voidResonator: new TimeSettingsItem("voidResonator", TimeItemVariant.VoidSpace),
      voidRift: new TimeSettingsItem("voidRift", TimeItemVariant.VoidSpace),
    },
    fixCryochambers = new Setting(false),
    turnOnChronoFurnace = new Setting(false),
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

    this.fixCryochambers.load(settings.fixCryochambers);
    this.turnOnChronoFurnace.load(settings.turnOnChronoFurnace);
  }
}
