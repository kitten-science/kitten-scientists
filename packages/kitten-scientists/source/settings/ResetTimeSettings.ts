import { consumeEntriesPedantic } from "../tools/Entries.js";
import { isNil, Maybe } from "../tools/Maybe.js";
import { TimeItemVariant } from "../types/index.js";
import { Setting, SettingTrigger } from "./Settings.js";
import { TimeItem } from "./TimeSettings.js";

export class ResetTimeBuildingSetting extends SettingTrigger {
  readonly #building: TimeItem;
  readonly #variant: TimeItemVariant;

  get building() {
    return this.#building;
  }
  get variant() {
    return this.#variant;
  }

  constructor(id: TimeItem, variant: TimeItemVariant, enabled = false, trigger = 1) {
    super(enabled, trigger);
    this.#building = id;
    this.#variant = variant;
  }
}

export type ResetTimeBuildingSettings = Record<TimeItem, ResetTimeBuildingSetting>;

export class ResetTimeSettings extends Setting {
  readonly buildings: ResetTimeBuildingSettings;

  constructor(
    enabled = false,
    buildings: ResetTimeBuildingSettings = {
      blastFurnace: new ResetTimeBuildingSetting(
        "blastFurnace",
        TimeItemVariant.Chronoforge,
        false,
        -1,
      ),
      chronocontrol: new ResetTimeBuildingSetting(
        "chronocontrol",
        TimeItemVariant.VoidSpace,
        false,
        -1,
      ),
      cryochambers: new ResetTimeBuildingSetting(
        "cryochambers",
        TimeItemVariant.VoidSpace,
        false,
        -1,
      ),
      ressourceRetrieval: new ResetTimeBuildingSetting(
        "ressourceRetrieval",
        TimeItemVariant.Chronoforge,
        false,
        -1,
      ),
      temporalAccelerator: new ResetTimeBuildingSetting(
        "temporalAccelerator",
        TimeItemVariant.Chronoforge,
        false,
        -1,
      ),
      temporalBattery: new ResetTimeBuildingSetting(
        "temporalBattery",
        TimeItemVariant.Chronoforge,
        false,
        -1,
      ),
      temporalImpedance: new ResetTimeBuildingSetting(
        "temporalImpedance",
        TimeItemVariant.Chronoforge,
        false,
        -1,
      ),
      temporalPress: new ResetTimeBuildingSetting(
        "temporalPress",
        TimeItemVariant.Chronoforge,
        false,
        -1,
      ),
      timeBoiler: new ResetTimeBuildingSetting(
        "timeBoiler",
        TimeItemVariant.Chronoforge,
        false,
        -1,
      ),
      voidHoover: new ResetTimeBuildingSetting("voidHoover", TimeItemVariant.VoidSpace, false, -1),
      voidResonator: new ResetTimeBuildingSetting(
        "voidResonator",
        TimeItemVariant.VoidSpace,
        false,
        -1,
      ),
      voidRift: new ResetTimeBuildingSetting("voidRift", TimeItemVariant.VoidSpace, false, -1),
    },
  ) {
    super(enabled);
    this.buildings = buildings;
  }

  load(settings: Maybe<Partial<ResetTimeSettings>>) {
    if (isNil(settings)) {
      return;
    }

    super.load(settings);

    consumeEntriesPedantic(this.buildings, settings.buildings, (building, item) => {
      building.enabled = item?.enabled ?? building.enabled;
      building.trigger = item?.trigger ?? building.trigger;
    });
  }
}
