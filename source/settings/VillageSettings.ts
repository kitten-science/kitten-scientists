import { isNil, type Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { type Job, Jobs } from "../types/index.js";
import { ElectLeaderSettings } from "./ElectLeaderSettings.js";
import { Setting, SettingMax, SettingTrigger } from "./Settings.js";

export type VillageJobSettings = Record<Job, SettingMax>;

/**
 * Settings for holding festivals.
 *
 * The automation only holds a festival while the production of the resources
 * the festival costs makes it look profitable. That check ignores every other
 * resource a festival boosts, so it can keep festivals from being held while
 * they would actually be worth it. This can be turned off.
 */
export class HoldFestivalsSettings extends Setting {
	/** Hold festivals even while they don't look profitable. */
	readonly ignoreProfitability: Setting;

	constructor(enabled = false, ignoreProfitability = new Setting()) {
		super(enabled);
		this.ignoreProfitability = ignoreProfitability;
	}

	load(settings: Maybe<Partial<HoldFestivalsSettings>>) {
		if (isNil(settings)) {
			return;
		}

		super.load(settings);
		this.ignoreProfitability.load(settings.ignoreProfitability);
	}
}

export class VillageSettings extends Setting {
	jobs: VillageJobSettings;

	holdFestivals: HoldFestivalsSettings;
	hunt: SettingTrigger;
	promoteKittens: SettingTrigger;
	promoteLeader: Setting;
	electLeader: ElectLeaderSettings;

	constructor(
		enabled = false,
		holdFestivals = new HoldFestivalsSettings(),
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

		this.holdFestivals.load(settings.holdFestivals);
		this.hunt.load(settings.hunt);
		this.promoteKittens.enabled =
			settings.promoteKittens?.enabled ?? this.promoteKittens.enabled;
		this.promoteLeader.enabled =
			settings.promoteLeader?.enabled ?? this.promoteLeader.enabled;
		this.electLeader.load(settings.electLeader);
	}
}
