import { type Maybe, isNil } from "@oliversalzburg/js-utils/data/nil.js";
import type { ReligionItem, Resource, SpaceBuilding } from "../types/index.js";
import type { BonfireItem } from "./BonfireSettings.js";
import type { TimeItem } from "./TimeSettings.js";

export type Requirement = Resource | false;

/**
 * The type names of all supported buildings.
 */
export type AllItems = BonfireItem | ReligionItem | SpaceBuilding | TimeItem;

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

/**
 * A setting that also includes a trigger value.
 * Trigger values range from 0 to 1. They reflect a percentage.
 */
export class SettingTrigger extends Setting {
  trigger: number;

  constructor(enabled = false, trigger = -1) {
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

/**
 * A setting that also includes an absolute value trigger.
 * Trigger values range from 0 to Infinity, while -1 designates Infinity explicitly.
 */
export class SettingThreshold extends Setting {
  trigger: number;

  constructor(enabled = false, threshold = 1) {
    super(enabled);
    this.trigger = threshold;
  }

  load(setting: Maybe<Partial<SettingThreshold>>) {
    if (isNil(setting)) {
      return;
    }

    super.load(setting);
    this.trigger = setting.trigger ?? this.trigger;
  }
}

export class SettingMax extends Setting {
  max: number;

  constructor(enabled = false, max = 0) {
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

  constructor(enabled = false, limited = false, max = 0) {
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

export class SettingLimitedMaxTrigger extends SettingLimitedMax implements SettingTrigger {
  trigger: number;

  constructor(enabled = false, limited = false, max = 0, trigger = -1) {
    super(enabled, limited, max);
    this.trigger = trigger;
  }

  load(setting: Maybe<Partial<SettingLimitedMaxTrigger>>) {
    if (isNil(setting)) {
      return;
    }

    super.load(setting);
    this.trigger = setting.trigger ?? this.trigger;
  }
}

export class SettingLimitedTrigger extends SettingLimited implements SettingTrigger {
  trigger: number;

  constructor(enabled = false, limited = false, trigger = -1) {
    super(enabled, limited);
    this.trigger = trigger;
  }

  load(setting: Maybe<Partial<SettingLimitedTrigger>>) {
    if (isNil(setting)) {
      return;
    }

    super.load(setting);
    this.trigger = setting.trigger ?? this.trigger;
  }
}

export class SettingTriggerMax extends SettingTrigger implements SettingMax {
  max: number;

  constructor(enabled = false, trigger = -1, max = 0) {
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

export class SettingThresholdMax extends SettingThreshold implements SettingMax {
  max: number;

  constructor(enabled = false, trigger = 1, max = 0) {
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

export class SettingOptions<T = string> {
  readonly #options: Array<{ label: string; value: T }>;
  selected: T;

  get options() {
    return this.#options;
  }

  constructor(selected: T, options = new Array<{ label: string; value: T }>()) {
    // Make sure the provided selected value exists in options.
    if (isNil(options.find(option => option.value === selected))) {
      throw new Error("Provided selected value is not in provided options.");
    }

    this.selected = selected;
    this.#options = options;
  }

  load(setting: Maybe<Partial<SettingOptions<T>>>) {
    if (isNil(setting)) {
      return;
    }

    this.selected = setting.selected ?? this.selected;
  }
}

export class SettingBuy extends Setting {
  buy: number;

  constructor(enabled = false, buy = -1) {
    super(enabled);
    this.buy = buy;
  }

  load(setting: Maybe<Partial<SettingBuy>>) {
    if (isNil(setting)) {
      return;
    }

    super.load(setting);
    this.buy = setting.buy ?? this.buy;
  }
}

export class SettingSell extends Setting {
  sell: number;

  constructor(enabled = false, sell = -1) {
    super(enabled);
    this.sell = sell;
  }

  load(setting: Maybe<Partial<SettingSell>>) {
    if (isNil(setting)) {
      return;
    }

    super.load(setting);
    this.sell = setting.sell ?? this.sell;
  }
}

export class SettingBuySellThreshold extends SettingThreshold implements SettingBuy, SettingSell {
  buy: number;
  sell: number;

  constructor(enabled = false, buy = 950.0, sell = 1000.0, trigger = 1) {
    super(enabled, trigger);
    this.buy = buy;
    this.sell = sell;
  }

  load(setting: Maybe<Partial<SettingBuySellThreshold>>) {
    if (isNil(setting)) {
      return;
    }

    super.load(setting);
    this.buy = setting.buy ?? this.buy;
    this.sell = setting.sell ?? this.sell;
  }
}
