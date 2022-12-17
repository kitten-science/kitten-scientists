import { isNil, Maybe } from "../tools/Maybe";
import { Job, Trait } from "../types";
import { Setting, SettingOptions } from "./Settings";

export class ElectLeaderSettings extends Setting {
  readonly job: SettingOptions<Job>;
  readonly trait: SettingOptions<Trait>;

  constructor(
    enabled = false,
    job = new SettingOptions<Job>("priest", [
      { label: "Engineer", value: "engineer" },
      { label: "Farmer", value: "farmer" },
      { label: "Geologist", value: "geologist" },
      { label: "Hunter", value: "hunter" },
      { label: "Miner", value: "miner" },
      { label: "Priest", value: "priest" },
      { label: "Scholar", value: "scholar" },
      { label: "Woodcutter", value: "woodcutter" },
    ]),
    trait = new SettingOptions<Trait>("wise", [
      { label: "Artisan", value: "engineer" },
      { label: "Chemist", value: "chemist" },
      { label: "Manager", value: "manager" },
      { label: "Merchant", value: "merchant" },
      { label: "Metallurgist", value: "matallurgist" },
      { label: "Philosopher", value: "wise" },
      { label: "Scientist", value: "scientist" },
      { label: "None", value: "none" },
    ])
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
