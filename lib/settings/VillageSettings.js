import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { Jobs } from "../types/index.js";
import { ElectLeaderSettings } from "./ElectLeaderSettings.js";
import { Setting, SettingMax, SettingTrigger } from "./Settings.js";
export class VillageSettings extends Setting {
  jobs;
  holdFestivals;
  hunt;
  promoteKittens;
  promoteLeader;
  electLeader;
  constructor(
    enabled = false,
    holdFestivals = new Setting(),
    hunt = new SettingTrigger(false, 0.98),
    promoteKittens = new SettingTrigger(false, 1),
    promoteLeader = new Setting(),
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
  initJobs() {
    const items = {};
    for (const item of Jobs) {
      items[item] = new SettingMax(false, -1);
    }
    return items;
  }
  load(settings) {
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
//# sourceMappingURL=VillageSettings.js.map
