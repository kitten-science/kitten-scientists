export class Setting {
  enabled: boolean;
  $enabled: JQuery<HTMLElement> | undefined = undefined;

  constructor(enabled = false) {
    this.enabled = enabled;
  }
}

export class SettingLimited extends Setting {
  limited: boolean;
  $limited: JQuery<HTMLElement> | undefined = undefined;

  constructor(enabled = false, limited = false) {
    super(enabled);
    this.limited = limited;
  }
}

export class SettingMax extends Setting {
  max: number;
  $max: JQuery<HTMLElement> | undefined = undefined;

  constructor(enabled = false, max = -1) {
    super(enabled);
    this.max = max;
  }
}

export class SettingLimitedMax extends Setting implements SettingLimited, SettingMax {
  limited: boolean;
  $limited: JQuery<HTMLElement> | undefined = undefined;

  max: number;
  $max: JQuery<HTMLElement> | undefined = undefined;

  constructor(enabled = false, limited = false, max = -1) {
    super(enabled);
    this.limited = limited;
    this.max = max;
  }
}

export class SettingTrigger extends Setting {
  trigger: number;
  $trigger: JQuery<HTMLElement> | undefined = undefined;

  constructor(enabled = false, trigger = 1) {
    super(enabled);
    this.trigger = trigger;
  }
}
