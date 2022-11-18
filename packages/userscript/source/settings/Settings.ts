import { isNil, Maybe } from "../tools/Maybe";
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

  load(setting: Maybe<Partial<Setting>>) {
    if (isNil(setting)) {
      return;
    }

    this.enabled = setting.enabled ?? this.enabled;
  }

  serialize() {
    return this;
  }
}

export class SettingLimited extends Setting {
  limited: boolean;

  constructor(enabled = false, limited = false) {
    super(enabled);
    this.limited = limited;
  }

  load(setting: Maybe<Partial<SettingLimited>>) {
    if (isNil(setting)) {
      return;
    }

    super.load(setting);
    this.limited = setting.limited ?? this.limited;
  }
}

export class SettingTrigger extends Setting {
  trigger: number;

  constructor(enabled = false, trigger = 1) {
    super(enabled);
    this.trigger = trigger;
  }

  load(setting: Maybe<Partial<SettingTrigger>>) {
    if (isNil(setting)) {
      return;
    }

    super.load(setting);
    this.trigger = setting.trigger ?? this.trigger;
  }
}

export class SettingMax extends Setting {
  max: number;

  constructor(enabled = false, max = -1) {
    super(enabled);
    this.max = max;
  }

  load(setting: Maybe<Partial<SettingMax>>) {
    if (isNil(setting)) {
      return;
    }

    super.load(setting);
    this.max = setting.max ?? this.max;
  }
}

export class SettingLimitedMax extends SettingLimited implements SettingMax {
  max: number;

  constructor(enabled = false, limited = false, max = -1) {
    super(enabled, limited);
    this.max = max;
  }

  load(setting: Maybe<Partial<SettingLimitedMax>>) {
    if (isNil(setting)) {
      return;
    }

    super.load(setting);
    this.max = setting.max ?? this.max;
  }
}

export class SettingTriggerMax extends SettingTrigger implements SettingMax {
  max: number;

  constructor(enabled = false, trigger = 1, max = -1) {
    super(enabled, trigger);
    this.max = max;
  }

  load(setting: Maybe<Partial<SettingTriggerMax>>) {
    if (isNil(setting)) {
      return;
    }

    super.load(setting);
    this.max = setting.max ?? this.max;
  }
}
