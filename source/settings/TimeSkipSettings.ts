import { isNil, type Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import { TimeSkipHeatSettings } from "../settings/TimeSkipHeatSettings.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { type Cycle, Cycles, type Season, Seasons } from "../types/index.js";
import { Setting, SettingThresholdMax, SettingTrigger } from "./Settings.js";

export type CyclesSettings = Record<Cycle, Setting>;
export type SeasonsSettings = Record<Season, Setting>;

export class TimeSkipSettings extends SettingThresholdMax {
	readonly cycles: CyclesSettings;
	readonly seasons: SeasonsSettings;
	readonly activeHeatTransfer: TimeSkipHeatSettings;
	readonly ignoreOverheat: Setting;

	/**
	 * Automatically burn time crystals, in order to replenish temporal flux.
	 *
	 * The trigger is the share of the maximum temporal flux storage. When the
	 * available temporal flux drops below that share, additional years are
	 * skipped to refill it.
	 *
	 * Skipping years only produces temporal flux if the `turnSmoothly` workshop
	 * upgrade (which makes chronospheres produce temporal flux) is researched.
	 */
	readonly acquireTemporalFlux: SettingTrigger;

	constructor(
		ignoreOverheat = new Setting(),
		activeHeatTransfer = new TimeSkipHeatSettings(),
		acquireTemporalFlux = new SettingTrigger(false, 0.5),
	) {
		super(false, 5);
		this.cycles = this.initCycles();
		this.seasons = this.initSeason();
		this.activeHeatTransfer = activeHeatTransfer;
		this.ignoreOverheat = ignoreOverheat;
		this.acquireTemporalFlux = acquireTemporalFlux;
	}

	private initCycles(): CyclesSettings {
		const items = {} as CyclesSettings;
		for (const item of Cycles) {
			items[item] = new Setting();
		}
		return items;
	}

	private initSeason(): SeasonsSettings {
		const items = {} as SeasonsSettings;
		for (const item of Seasons) {
			items[item] = new Setting();
		}
		return items;
	}

	load(settings: Maybe<Partial<TimeSkipSettings>>) {
		if (isNil(settings)) {
			return;
		}

		super.load(settings);

		consumeEntriesPedantic(this.cycles, settings.cycles, (cycle, item) => {
			cycle.enabled = item?.enabled ?? cycle.enabled;
		});
		consumeEntriesPedantic(this.seasons, settings.seasons, (season, item) => {
			season.enabled = item?.enabled ?? season.enabled;
		});
		this.ignoreOverheat.load(settings.ignoreOverheat);
		this.activeHeatTransfer.load(settings.activeHeatTransfer);
		this.acquireTemporalFlux.load(settings.acquireTemporalFlux);
	}
}
