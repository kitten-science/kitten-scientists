import { TimeItemVariant } from "../types";
import { SettingTrigger } from "./Settings";
import { TimeItem } from "./TimeSettings";

export class ResetTimeBuildingSetting extends SettingTrigger {
  variant: TimeItemVariant;

  constructor(id: string, variant: TimeItemVariant, enabled = false, trigger = 1) {
    super(id, enabled, trigger);
    this.variant = variant;
  }
}

export type ResetTimeSettings = {
  [item in TimeItem]: ResetTimeBuildingSetting;
};
