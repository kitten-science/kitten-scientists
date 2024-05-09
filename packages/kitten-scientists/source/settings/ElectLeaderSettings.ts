import { Maybe, isNil } from "@oliversalzburg/js-utils/nil.js";
import { Job, JobArray, Trait, TraitArray } from "../types/index.js";
import { Setting, SettingOptions } from "./Settings.js";

export class ElectLeaderSettings extends Setting {
  readonly job: SettingOptions<Job>;
  readonly trait: SettingOptions<Trait>;

  constructor(
    enabled = false,
    job = new SettingOptions<Job>(
      "priest",
      JobArray.map(item => {
        return { label: "", value: item };
      }),
    ),
    trait = new SettingOptions<Trait>(
      "wise",
      TraitArray.map(item => {
        return { label: "", value: item };
      }),
    ),
  ) {
    super(enabled);
    this.job = job;
    this.trait = trait;
  }

  load(settings: Maybe<Partial<ElectLeaderSettings>>) {
    if (isNil(settings)) {
      return;
    }

    super.load(settings);

    this.job.load(settings.job);
    this.trait.load(settings.trait);
  }
}
