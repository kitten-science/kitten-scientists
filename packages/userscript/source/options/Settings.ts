import { Resource, SpaceBuildings } from "../types";
import { BonfireItem } from "./BonfireSettings";
import { FaithItem, ReligionItem } from "./ReligionSettings";
import { TimeItem } from "./TimeSettings";

export type Requirement = Resource | false;

/**
 * The type names of all supported buildings.
 */
export type AllItems = BonfireItem | FaithItem | ReligionItem | SpaceBuildings | TimeItem;

export class Setting {
  enabled: boolean;

  constructor(enabled = false) {
    this.enabled = enabled;
  }

  load(setting: Setting) {
    this.enabled = setting.enabled;
  }
}

export class SettingLimited extends Setting {
  limited: boolean;

  constructor(enabled = false, limited = false) {
    super(enabled);
    this.limited = limited;
  }

  load(setting: SettingLimited) {
    super.load(setting);
    this.limited = setting.limited;
  }
}

export class SettingMax extends Setting {
  max: number;

  constructor(enabled = false, max = -1) {
    super(enabled);
    this.max = max;
  }

  load(setting: SettingMax) {
    super.load(setting);
    this.max = setting.max;
  }
}

export class SettingLimitedMax extends SettingLimited implements SettingMax {
  max: number;

  constructor(enabled = false, limited = false, max = -1) {
    super(enabled, limited);
    this.max = max;
  }

  load(setting: SettingLimitedMax) {
    super.load(setting);
    this.max = setting.max;
  }
}

export class SettingTrigger extends Setting {
  trigger: number;

  constructor(enabled = false, trigger = 1) {
    super(enabled);
    this.trigger = trigger;
  }

  load(setting: SettingTrigger) {
    super.load(setting);
    this.trigger = setting.trigger;
  }
}
