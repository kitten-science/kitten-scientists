import { Resource, SpaceBuildings } from "../types";
import { MaxButton } from "../ui/components/MaxButton";
import { TriggerButton } from "../ui/components/TriggerButton";
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
  $enabled: JQuery<HTMLElement> | undefined = undefined;

  constructor(id: string, enabled = false) {
    this.enabled = enabled;
  }
}

export class SettingLimited extends Setting {
  limited: boolean;
  $limited: JQuery<HTMLElement> | undefined = undefined;

  constructor(id: string, enabled = false, limited = false) {
    super(id, enabled);
    this.limited = limited;
  }
}

export class SettingMax extends Setting {
  max: number;
  $max: MaxButton | undefined = undefined;

  constructor(id: string, enabled = false, max = -1) {
    super(id, enabled);
    this.max = max;
  }
}

export class SettingLimitedMax extends SettingLimited implements SettingMax {
  max: number;
  $max: MaxButton | undefined = undefined;

  constructor(id: string, enabled = false, limited = false, max = -1) {
    super(id, enabled, limited);
    this.max = max;
  }
}

export class SettingTrigger extends Setting {
  trigger: number;
  $trigger: TriggerButton | undefined = undefined;

  constructor(id: string, enabled = false, trigger = 1) {
    super(id, enabled);
    this.trigger = trigger;
  }
}
