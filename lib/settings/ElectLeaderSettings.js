import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { Jobs, Traits } from "../types/index.js";
import { Setting, SettingOptions } from "./Settings.js";
export class ElectLeaderSettings extends Setting {
  job;
  trait;
  constructor(
    enabled = false,
    job = new SettingOptions(
      "any",
      Jobs.map(item => {
        return { label: "", value: item };
      }),
    ),
    trait = new SettingOptions(
      "none",
      Traits.map(item => {
        return { label: "", value: item };
      }),
    ),
  ) {
    super(enabled);
    this.job = job;
    this.trait = trait;
  }
  load(settings) {
    if (isNil(settings)) {
      return;
    }
    super.load(settings);
    this.job.load(settings.job);
    this.trait.load(settings.trait);
  }
}
//# sourceMappingURL=ElectLeaderSettings.js.map
