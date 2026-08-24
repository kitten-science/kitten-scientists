import { mustExist } from "@oliversalzburg/js-utils/data/nil.js";
import type { KittenScientists } from "../KittenScientists.js";
import { roundToTwo } from "../tools/Format.js";
import type { TabId } from "../types/index.js";

export const Activities = [
	"adoreTheGalaxy",
	"blackcoin.buy",
	"blackcoin.sell",
	"build.bonfire",
	"build.embassy",
	"build.religion",
	"build.space",
	"build.time",
	"build.upgrade",
	"craft",
	"feedElders",
	"festival",
	"hunt",
	"kittens.distribute",
	"kittens.promote",
	"leader.elect",
	"leader.promote",
	"observeStar",
	"praiseTheSun",
	"refine.tears",
	"refine.timeCrystals",
	"research.orderOfTheSun",
	"research.policy",
	"research.tech",
	"research.upgrade",
	"sacrifice",
	"spaceMission",
	"time.accelerate",
	"time.activeHeatTransferStart",
	"time.fixCryochamber",
	"time.getTemporalFlux",
	"time.skip",
	"trade",
	"trade.explore",
	"transcend",
] as const;
export type Activity = (typeof Activities)[number];

export const ActivitySections: Record<Activity, TabId> = {
	adoreTheGalaxy: "Religion",
	"blackcoin.buy": "Trade",
	"blackcoin.sell": "Trade",
	"build.bonfire": "Bonfire",
	"build.embassy": "Trade",
	"build.religion": "Religion",
	"build.space": "Space",
	"build.time": "Time",
	"build.upgrade": "Bonfire",
	craft: "Workshop",
	feedElders: "Trade",
	festival: "Village",
	hunt: "Village",
	"kittens.distribute": "Village",
	"kittens.promote": "Village",
	"leader.elect": "Village",
	"leader.promote": "Village",
	observeStar: "Science",
	praiseTheSun: "Religion",
	"refine.tears": "Religion",
	"refine.timeCrystals": "Religion",
	"research.orderOfTheSun": "Religion",
	"research.policy": "Science",
	"research.tech": "Science",
	"research.upgrade": "Workshop",
	sacrifice: "Religion",
	spaceMission: "Space",
	"time.accelerate": "Time",
	"time.activeHeatTransferStart": "Time",
	"time.fixCryochamber": "Time",
	"time.getTemporalFlux": "Time",
	"time.skip": "Time",
	trade: "Trade",
	"trade.explore": "Trade",
	transcend: "Religion",
};

export type ActivityClass = `ks-${Activity}`;
export type ActivityTypeClass = `type_${ActivityClass}`;

export class ActivitySummary {
	private readonly _host: KittenScientists;

	/**
	 * The day at which the activity summary was last reset.
	 */
	private _lastday: number | undefined;

	/**
	 * The year at which the activity summary was last reset.
	 */
	private _lastyear: number | undefined;

	private _activities = new Map<Activity, Map<string, number>>();

	/**
	 * The stored activities.
	 */
	get activities() {
		return this._activities;
	}

	constructor(host: KittenScientists) {
		this._host = host;
		this.resetActivity();
	}

	resetActivity(): void {
		this._activities = new Map<Activity, Map<string, number>>();
		this._lastday = this._host.game.calendar.day;
		this._lastyear = this._host.game.calendar.year;
	}

	storeActivity(type: Activity, amount = 1, name: string = type): void {
		if (!this._activities.has(type)) {
			this._activities.set(type, new Map<string, number>());
		}
		const summarySection = mustExist(this._activities.get(type));

		if (!summarySection.has(name)) {
			summarySection.set(name, 0);
		}
		summarySection.set(name, mustExist(summarySection.get(name)) + amount);
	}

	getDuration() {
		if (this._lastyear === undefined || this._lastday === undefined) {
			return "";
		}

		let years = this._host.game.calendar.year - this._lastyear;
		let days = this._host.game.calendar.day - this._lastday;

		if (days < 0) {
			years -= 1;
			days += 400;
		}

		let duration = "";
		if (years > 0) {
			duration += `${years} `;
			duration +=
				years === 1
					? this._host.engine.i18n("summary.year")
					: this._host.engine.i18n("summary.years");
		}

		if (days >= 0) {
			if (years > 0) duration += this._host.engine.i18n("summary.separator");
			duration += `${roundToTwo(days)} `;
			duration +=
				days === 1
					? this._host.engine.i18n("summary.day")
					: this._host.engine.i18n("summary.days");
		}
		return duration;
	}
}
