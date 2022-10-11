import { UnicornItemVariant } from "../types";
import { FaithItem, UnicornItem } from "./ReligionSettings";
import { SettingTrigger } from "./Settings";

export class ResetReligionBuildingSetting extends SettingTrigger {
  variant: UnicornItemVariant;

  constructor(id: string, variant: UnicornItemVariant, enabled = false, trigger = 1) {
    super(id, enabled, trigger);
    this.variant = variant;
  }
}

export type ResetReligionSettings = {
  [item in FaithItem | UnicornItem]: ResetReligionBuildingSetting;
};
