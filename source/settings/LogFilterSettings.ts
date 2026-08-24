import { isNil, type Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import { Activities, type Activity } from "../helper/ActivitySummary.js";
import { consumeEntriesPedantic } from "../tools/Entries.js";
import { Setting } from "./Settings.js";

export const FilterItemsGame = [
	"alicornCorruption",
	"alicornRift",
	"alicornSacrifice",
	"astronomicalEvent",
	"blackcoin",
	"combat",
	"craft",
	"elders",
	"explore",
	"faith",
	"festival",
	"hunt",
	"ivoryMeteor",
	"meteor",
	"tcRefine",
	"tcShatter",
	"trade",
	"undo",
	"unicornRift",
	"unicornSacrifice",
	"workshopAutomation",
] as const;
export type FilterItemGame = (typeof FilterItemsGame)[number];

export class LogFilterSettingsItem extends Setting {
	readonly #activity: Activity | null;

	get activity() {
		return this.#activity;
	}

	constructor(variant: Activity | null) {
		super(true);
		this.#activity = variant;
	}
}

export type LogFilterSettingsItems = Record<Activity, LogFilterSettingsItem>;
export type LogFilterSettingsItemsGame = Record<
	FilterItemGame,
	LogFilterSettingsItem
>;

export class LogFilterSettings extends Setting {
	filters: LogFilterSettingsItems;
	filtersGame: LogFilterSettingsItemsGame;

	constructor(enabled = false) {
		super(enabled);

		this.filters = {} as LogFilterSettingsItems;
		for (const item of Activities) {
			this.filters[item] = new LogFilterSettingsItem(item);
		}
		this.filtersGame = {} as LogFilterSettingsItemsGame;
		for (const item of FilterItemsGame) {
			this.filtersGame[item] = new LogFilterSettingsItem(null);
		}
	}

	load(settings: Maybe<Partial<LogFilterSettings>>) {
		if (isNil(settings)) {
			return;
		}

		super.load(settings);

		consumeEntriesPedantic(this.filters, settings.filters, (filter, item) => {
			filter.enabled = item?.enabled ?? filter.enabled;
		});
		consumeEntriesPedantic(
			this.filtersGame,
			settings.filtersGame,
			(filter, item) => {
				filter.enabled = item?.enabled ?? filter.enabled;
			},
		);
	}
}
