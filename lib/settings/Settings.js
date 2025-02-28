import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
export class Setting {
  enabled;
  constructor(enabled = false) {
    this.enabled = enabled;
  }
  load(setting) {
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
  limited;
  constructor(enabled = false, limited = false) {
    super(enabled);
    this.limited = limited;
  }
  load(setting) {
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
  trigger;
  constructor(enabled = false, trigger = -1) {
    super(enabled);
    this.trigger = trigger;
  }
  load(setting) {
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
  trigger;
  constructor(enabled = false, threshold = 1) {
    super(enabled);
    this.trigger = threshold;
  }
  load(setting) {
    if (isNil(setting)) {
      return;
    }
    super.load(setting);
    this.trigger = setting.trigger ?? this.trigger;
  }
}
export class SettingMax extends Setting {
  max;
  constructor(enabled = false, max = 0) {
    super(enabled);
    this.max = max;
  }
  load(setting) {
    if (isNil(setting)) {
      return;
    }
    super.load(setting);
    this.max = setting.max ?? this.max;
  }
}
export class SettingLimitedMax extends SettingLimited {
  max;
  constructor(enabled = false, limited = false, max = 0) {
    super(enabled, limited);
    this.max = max;
  }
  load(setting) {
    if (isNil(setting)) {
      return;
    }
    super.load(setting);
    this.max = setting.max ?? this.max;
  }
}
export class SettingLimitedMaxTrigger extends SettingLimitedMax {
  trigger;
  constructor(enabled = false, limited = false, max = 0, trigger = -1) {
    super(enabled, limited, max);
    this.trigger = trigger;
  }
  load(setting) {
    if (isNil(setting)) {
      return;
    }
    super.load(setting);
    this.trigger = setting.trigger ?? this.trigger;
  }
}
export class SettingLimitedTrigger extends SettingLimited {
  trigger;
  constructor(enabled = false, limited = false, trigger = -1) {
    super(enabled, limited);
    this.trigger = trigger;
  }
  load(setting) {
    if (isNil(setting)) {
      return;
    }
    super.load(setting);
    this.trigger = setting.trigger ?? this.trigger;
  }
}
export class SettingTriggerMax extends SettingTrigger {
  max;
  constructor(enabled = false, trigger = 1, max = 0) {
    super(enabled, trigger);
    this.max = max;
  }
  load(setting) {
    if (isNil(setting)) {
      return;
    }
    super.load(setting);
    this.max = setting.max ?? this.max;
  }
}
export class SettingThresholdMax extends SettingThreshold {
  max;
  constructor(enabled = false, trigger = 1, max = 0) {
    super(enabled, trigger);
    this.max = max;
  }
  load(setting) {
    if (isNil(setting)) {
      return;
    }
    super.load(setting);
    this.max = setting.max ?? this.max;
  }
}
export class SettingOptions {
  #options;
  selected;
  get options() {
    return this.#options;
  }
  constructor(selected, options = new Array()) {
    // Make sure the provided selected value exists in options.
    if (isNil(options.find(option => option.value === selected))) {
      throw new Error("Provided selected value is not in provided options.");
    }
    this.selected = selected;
    this.#options = options;
  }
  load(setting) {
    if (isNil(setting)) {
      return;
    }
    this.selected = setting.selected ?? this.selected;
  }
}
export class SettingBuy extends Setting {
  buy;
  constructor(enabled = false, buy = -1) {
    super(enabled);
    this.buy = buy;
  }
  load(setting) {
    if (isNil(setting)) {
      return;
    }
    super.load(setting);
    this.buy = setting.buy ?? this.buy;
  }
}
export class SettingSell extends Setting {
  sell;
  constructor(enabled = false, sell = -1) {
    super(enabled);
    this.sell = sell;
  }
  load(setting) {
    if (isNil(setting)) {
      return;
    }
    super.load(setting);
    this.sell = setting.sell ?? this.sell;
  }
}
export class SettingBuySellThreshold extends SettingThreshold {
  buy;
  sell;
  constructor(enabled = false, buy = 950.0, sell = 1000.0, trigger = 1) {
    super(enabled, trigger);
    this.buy = buy;
    this.sell = sell;
  }
  load(setting) {
    if (isNil(setting)) {
      return;
    }
    super.load(setting);
    this.buy = setting.buy ?? this.buy;
    this.sell = setting.sell ?? this.sell;
  }
}
//# sourceMappingURL=Settings.js.map
