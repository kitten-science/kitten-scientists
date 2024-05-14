import { Maybe, isNil } from "@oliversalzburg/js-utils/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { Job, JobArray } from "../types/index.js";
import { ElectLeaderSettings } from "./ElectLeaderSettings.js";
import { Setting, SettingMax, SettingTrigger } from "./Settings.js";

export type VillageJobSettings = Record<Job, SettingMax>;

export class VillageSettings extends Setting {
  jobs: VillageJobSettings;

  holdFestivals: Setting;
  hunt: SettingTrigger;
  promoteKittens: SettingTrigger;
  promoteLeader: Setting;
  electLeader: ElectLeaderSettings;

  constructor(
    enabled = false,
    holdFestivals = new Setting(true),
    hunt = new SettingTrigger(true, 0.98),
    promoteKittens = new SettingTrigger(true, 1),
    promoteLeader = new Setting(true),
    electLeader = new ElectLeaderSettings(),
  ) {
    super(enabled);
    this.jobs = this.initJobs();
    this.holdFestivals = holdFestivals;
    this.hunt = hunt;
    this.promoteKittens = promoteKittens;
    this.promoteLeader = promoteLeader;
    this.electLeader = electLeader;
  }

  private initJobs(): VillageJobSettings {
    const items = {} as VillageJobSettings;
    JobArray.forEach(item => {
      items[item] = new SettingMax(true, 1);
    });
    return items;
  }

  load(settings: Maybe<Partial<VillageSettings>>) {
    if (isNil(settings)) {
      return;
    }

    super.load(settings);

    consumeEntriesPedantic(this.jobs, settings.jobs, (job, item) => {
      job.enabled = item?.enabled ?? job.enabled;
      job.max = item?.max ?? job.max;
    });

    this.holdFestivals.enabled = settings.holdFestivals?.enabled ?? this.holdFestivals.enabled;
    this.hunt.load(settings.hunt);
    this.promoteKittens.enabled = settings.promoteKittens?.enabled ?? this.promoteKittens.enabled;
    this.promoteLeader.enabled = settings.promoteLeader?.enabled ?? this.promoteLeader.enabled;
    this.electLeader.load(settings.electLeader);
  }
}
