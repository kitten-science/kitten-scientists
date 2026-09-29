import { isNil, type Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { type Job, Jobs } from "../types/index.js";
import { ElectLeaderSettings } from "./ElectLeaderSettings.js";
import { Setting, SettingMax, SettingTrigger } from "./Settings.js";

export type VillageJobSettings = Record<Job, SettingMax>;

export class VillageSettings extends Setting {
	jobs: VillageJobSettings;

	holdFestivals: Setting;
	hunt: SettingTrigger;
	promoteAmbassadors: SettingTrigger;
	promoteEngineers: SettingTrigger;
	promoteLeader: Setting;
	electLeader: ElectLeaderSettings;

	constructor(
		enabled = false,
		holdFestivals = new Setting(),
		hunt = new SettingTrigger(false, 0.98),
		promoteAmbassadors = new SettingTrigger(false, 1),
		promoteEngineers = new SettingTrigger(false, 1),
		promoteLeader = new Setting(),
		electLeader = new ElectLeaderSettings(),
	) {
		super(enabled);
		this.jobs = this.initJobs();
		this.holdFestivals = holdFestivals;
		this.hunt = hunt;
		this.promoteAmbassadors = promoteAmbassadors;
		this.promoteEngineers = promoteEngineers;
		this.promoteLeader = promoteLeader;
		this.electLeader = electLeader;
	}

	private initJobs(): VillageJobSettings {
		const items = {} as VillageJobSettings;
		for (const item of Jobs) {
			items[item] = new SettingMax(false, 0);
		}
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

		this.holdFestivals.enabled =
			settings.holdFestivals?.enabled ?? this.holdFestivals.enabled;
		this.hunt.load(settings.hunt);
		this.promoteAmbassadors.enabled =
			settings.promoteAmbassadors?.enabled ?? this.promoteAmbassadors.enabled;
		this.promoteEngineers.enabled =
			settings.promoteEngineers?.enabled ?? this.promoteEngineers.enabled;
		this.promoteLeader.enabled =
			settings.promoteLeader?.enabled ?? this.promoteLeader.enabled;
		this.electLeader.load(settings.electLeader);
	}
}
