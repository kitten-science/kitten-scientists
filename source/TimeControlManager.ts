import { isNil, mustExist } from "@oliversalzburg/js-utils/data/nil.js";
import type { BonfireManager } from "./BonfireManager.js";
import type { Engine, FrameContext } from "./Engine.js";
import type { KittenScientists } from "./KittenScientists.js";
import type { ReligionManager } from "./ReligionManager.js";
import {
	type CycleIndices,
	TimeControlSettings,
} from "./settings/TimeControlSettings.js";
import { objectEntries } from "./tools/Entries.js";
import { negativeOneToInfinity } from "./tools/Format.js";
import { resolveLimit } from "./tools/TriggerValue.js";
import type { BuildingMeta, UnsafeBuilding } from "./types/buildings.js";
import {
	type ChronoForgeUpgrade,
	Cycles,
	TimeItemVariant,
	type VoidSpaceUpgrade,
} from "./types/index.js";
import type { ShatterTCBtnController } from "./types/time.js";
import type { WorkshopManager } from "./WorkshopManager.js";

export class TimeControlManager {
	private readonly _host: KittenScientists;
	readonly settings: TimeControlSettings;
	private readonly _religionManager: ReligionManager;
	private readonly _workshopManager: WorkshopManager;

	/**
	 * The temporal flux maximum that the user interface was last refreshed for.
	 *
	 * The interface is only refreshed on demand, so the acquisition settings show
	 * the maximum they detected when they were last drawn.
	 */
	private _reportedTemporalFluxMaximum = Number.NaN;

	constructor(
		host: KittenScientists,
		_bonfireManager: BonfireManager,
		religionManager: ReligionManager,
		workshopManager: WorkshopManager,
		settings = new TimeControlSettings(),
	) {
		this._host = host;
		this.settings = settings;

		this._religionManager = religionManager;
		this._workshopManager = workshopManager;
	}

	async tick(_context: FrameContext) {
		// The maximum temporal flux storage is shown by the acquisition settings,
		// but the user interface is only refreshed on demand. Refresh it whenever
		// the value changed, so the settings don't keep showing a stale maximum.
		// This is checked even while this section is disabled, because the setting
		// is usually configured before it is switched on.
		const temporalFluxMaximum =
			this._host.game.resPool.get("temporalFlux").maxValue;
		if (temporalFluxMaximum !== this._reportedTemporalFluxMaximum) {
			this._reportedTemporalFluxMaximum = temporalFluxMaximum;
			this._host.refreshEntireUserInterface();
		}

		if (!this.settings.enabled) {
			return;
		}

		if (this.settings.accelerateTime.enabled) {
			this.accelerateTime();
		}
		if (this.settings.timeSkip.enabled) {
			this.timeSkip();
		}
		// Replenishing temporal flux is an action of its own, so it runs even when
		// regular time skipping is switched off.
		if (this.settings.timeSkip.acquireTemporalFlux.enabled) {
			this.acquireTemporalFlux();
		}
		if (this.settings.reset.enabled) {
			await this.autoReset(this._host.engine);
		}
	}

	async autoReset(engine: Engine) {
		// Don't reset if there's a challenge running.
		if (this._host.game.challenges.currentChallenge) {
			return;
		}

		const checkedList: Array<{ name: string; trigger: number; val: number }> =
			[];

		// check building
		for (const [name, entry] of objectEntries(
			this.settings.reset.bonfire.buildings,
		)) {
			if (!entry.enabled) {
				continue;
			}

			// If the trigger for an item is set to infinity, it basically disables the entire feature.
			if (entry.trigger < 0) {
				return;
			}

			// TODO: Obvious error here. For upgraded buildings, it needs special handling.
			let bld: BuildingMeta<UnsafeBuilding> | null;
			try {
				// @ts-expect-error Obvious error here. For upgraded buildings, it needs special handling.
				bld = this._host.game.bld.getBuildingExt(name);
			} catch (_error) {
				bld = null;
			}
			if (isNil(bld)) {
				continue;
			}

			checkedList.push({
				name:
					bld.meta.label ??
					mustExist(bld.meta.stages)[mustExist(bld.meta.stage)].label,
				trigger: entry.trigger,
				val: bld.meta.val,
			});
			// If the required amount of buildings hasn't been built yet, bail out.
			if (bld.meta.val < entry.trigger) {
				return;
			}
		}

		// unicornPasture
		// Special handling for unicorn pasture. As it's listed under religion, but is
		// actually a bonfire item.
		const unicornPasture =
			this.settings.reset.religion.buildings.unicornPasture;
		if (unicornPasture.enabled) {
			// If the trigger for an item is set to infinity, it basically disables the entire feature.
			if (unicornPasture.trigger < 0) {
				return;
			}

			const bld = this._host.game.bld.getBuildingExt("unicornPasture");
			checkedList.push({
				name: mustExist(bld.meta.label),
				trigger: unicornPasture.trigger,
				val: bld.meta.val,
			});
			if (bld.meta.val < unicornPasture.trigger) {
				return;
			}
		}

		// check space
		// This is identical to regular buildings.
		for (const [name, entry] of objectEntries(
			this.settings.reset.space.buildings,
		)) {
			if (!entry.enabled) {
				continue;
			}

			// If the trigger for an item is set to infinity, it basically disables the entire feature.
			if (entry.trigger < 0) {
				return;
			}

			const bld = this._host.game.space.getBuilding(name);
			checkedList.push({
				name: bld.label,
				trigger: entry.trigger,
				val: bld.val,
			});
			if (bld.val < entry.trigger) {
				return;
			}
		}

		// check religion
		for (const [name, entry] of objectEntries(
			this.settings.reset.religion.buildings,
		)) {
			if (!entry.enabled) {
				continue;
			}

			// If the trigger for an item is set to infinity, it basically disables the entire feature.
			if (entry.trigger < 0) {
				return;
			}

			const bld = mustExist(
				this._religionManager.getUpgradeMeta(name, entry.variant),
			);
			checkedList.push({
				name: bld.label,
				trigger: entry.trigger,
				val: bld.val,
			});
			if (bld.val < entry.trigger) {
				return;
			}
		}

		// check time
		for (const [name, entry] of objectEntries(
			this.settings.reset.time.buildings,
		)) {
			if (!entry.enabled) {
				continue;
			}

			// If the trigger for an item is set to infinity, it basically disables the entire feature.
			if (entry.trigger < 0) {
				return;
			}

			const bld = mustExist(this.getBuild(name, entry.variant));
			checkedList.push({
				name: bld.label,
				trigger: entry.trigger,
				val: bld.val,
			});
			if (bld.val < entry.trigger) {
				return;
			}
		}

		// check resources
		for (const [name, entry] of objectEntries(
			this.settings.reset.resources.resources,
		)) {
			if (!entry.enabled) {
				continue;
			}

			// If the trigger for an item is set to infinity, it basically disables the entire feature.
			if (entry.trigger < 0) {
				return;
			}

			const res = mustExist(this._host.game.resPool.get(name));
			checkedList.push({
				name: this._host.engine.i18n(`$resources.${entry.resource}.title`),
				trigger: entry.trigger,
				val: res.value,
			});
			if (res.value < entry.trigger) {
				return;
			}
		}

		// Check Workshop upgrades
		for (const [, entry] of objectEntries(
			this.settings.reset.upgrades.upgrades,
		)) {
			if (entry.enabled) {
				const upgrade = mustExist(
					this._host.game.workshop.upgrades.find(
						(subject) => subject.name === entry.upgrade,
					),
				);
				checkedList.push({
					name: upgrade.label,
					trigger: 1,
					val: upgrade.researched ? 1 : 0,
				});
				if (!upgrade.researched) {
					return;
				}
			}
		}

		if (checkedList.length === 0) {
			return;
		}

		// We have now determined that we either have all items or could buy all items.

		// stop!
		engine.standBy();

		const sleep = async (time = 1500) => {
			return new Promise((resolve, reject) => {
				if (!this._host.engine.settings.enabled) {
					reject(new Error("canceled by player"));
					return;
				}
				setTimeout(resolve, time);
			});
		};

		try {
			for (const checked of checkedList) {
				await sleep(500);
				this._host.engine.imessage("reset.check", [
					checked.name,
					this._host.game.getDisplayValueExt(checked.trigger),
					this._host.game.getDisplayValueExt(checked.val),
				]);
			}

			await sleep(0);
			this._host.engine.imessage("reset.checked");
			await sleep();
			this._host.engine.imessage("reset.tip");
			await sleep();
			this._host.engine.imessage("reset.countdown.10");
			await sleep(2000);
			this._host.engine.imessage("reset.countdown.9");
			await sleep();
			this._host.engine.imessage("reset.countdown.8");
			await sleep();
			this._host.engine.imessage("reset.countdown.7");
			await sleep();
			this._host.engine.imessage("reset.countdown.6");
			await sleep();
			this._host.engine.imessage("reset.countdown.5");
			await sleep();
			this._host.engine.imessage("reset.countdown.4");
			await sleep();
			this._host.engine.imessage("reset.countdown.3");
			await sleep();
			this._host.engine.imessage("reset.countdown.2");
			await sleep();
			this._host.engine.imessage("reset.countdown.1");
			await sleep();
			this._host.engine.imessage("reset.countdown.0");
			await sleep();
			this._host.engine.imessage("reset.last.message");
			await sleep();
		} catch (_error) {
			this._host.engine.imessage("reset.cancel.message");
			this._host.engine.imessage("reset.cancel.activity");
			return;
		}

		//=============================================================
		for (
			let challengeIndex = 0;
			challengeIndex < this._host.game.challenges.challenges.length;
			challengeIndex++
		) {
			this._host.game.challenges.challenges[challengeIndex].pending = false;
		}
		this._host.game.resetAutomatic();
		//=============================================================
	}

	accelerateTime() {
		const temporalFluxAvailable =
			this._workshopManager.getValueAvailable("temporalFlux");

		// If there's no available flux (we went below the limit)
		if (temporalFluxAvailable <= 0) {
			if (this._host.game.time.isAccelerated) {
				// Stop the acceleration
				this._host.game.time.isAccelerated = false;
			}
			return;
		}

		if (this._host.game.time.isAccelerated) {
			return;
		}

		const temporalFlux = this._host.game.resPool.get("temporalFlux");

		if (
			temporalFlux.maxValue * this.settings.accelerateTime.trigger <=
			temporalFlux.value
		) {
			this._host.game.time.isAccelerated = true;
			this._host.engine.iactivity("time.accelerate", "act.time.accelerate", []);
			this._host.engine.storeForSummary("time.accelerate", 1);
		}
	}

	timeSkip() {
		if (!this._host.game.workshop.get("chronoforge").researched) {
			return;
		}

		// Don't time skip while we're in a temporal paradox.
		if (this._host.game.calendar.day < 0) {
			return;
		}

		// If we have less time crystals than our required trigger value, bail out.
		const shatterCostIncreaseChallenge = this._host.game.getEffect(
			"shatterCostIncreaseChallenge",
		);
		const timeCrystalsAvailable =
			this._workshopManager.getValueAvailable("timeCrystal");
		if (
			timeCrystalsAvailable < this.settings.timeSkip.trigger ||
			timeCrystalsAvailable < 1 + shatterCostIncreaseChallenge
		) {
			return;
		}

		const shatterVoidCost = this._host.game.getEffect("shatterVoidCost");
		const voidAvailable = this._workshopManager.getValueAvailable("void");
		if (voidAvailable < shatterVoidCost) {
			return;
		}

		// If skipping during this season was disabled, bail out.
		const season = this._host.game.calendar.season;
		if (
			!this.settings.timeSkip.seasons[
				this._host.game.calendar.seasons[season].name
			].enabled
		) {
			return;
		}

		// If skipping during this cycle was disabled, bail out.
		const currentCycle = this._host.game.calendar.cycle;
		if (!this.settings.timeSkip.cycles[Cycles[currentCycle]].enabled) {
			return;
		}

		// If we have too much stored heat, wait for it to cool down.
		const heatMax = this._host.game.getEffect("heatMax");
		const heatNow = this._host.game.time.heat;
		if (!this.settings.timeSkip.ignoreOverheat.enabled) {
			if (heatMax <= heatNow) {
				return;
			}
		}

		const factor = this._host.game.challenges.getChallenge("1000Years")
			.researched
			? 5
			: 10;
		let maxSkipsActiveHeatTransfer = Number.POSITIVE_INFINITY;
		// Active Heat Transfer
		if (
			!this.settings.timeSkip.ignoreOverheat.enabled &&
			this.settings.timeSkip.activeHeatTransfer.enabled
		) {
			const heatPerTick = this._host.game.getEffect("heatPerTick");
			const ticksPerSecond = this._host.game.ticksPerSecond;
			if (
				this.settings.timeSkip.activeHeatTransfer.activeHeatTransferStatus
					.enabled
			) {
				// Heat Transfer to specified value
				if (
					heatNow <=
					heatMax * this.settings.timeSkip.activeHeatTransfer.trigger
				) {
					this.settings.timeSkip.activeHeatTransfer.activeHeatTransferStatus.enabled = false;
					this._host.refreshEntireUserInterface();
					this._host.engine.iactivity(
						"time.activeHeatTransferStart",
						"act.time.activeHeatTransferEnd",
					);
				}
				// Get temporalFlux
				// TODO: More judgment(e.g. determining crystal cost)? Or should the players decide for themselves(Add options)?
				const temporalFluxProduction = this._host.game.getEffect(
					"temporalFluxProduction",
				);
				const daysPerYear =
					(this._host.game.calendar.daysPerSeason +
						10 +
						this._host.game.getEffect("temporalParadoxDay")) *
					this._host.game.calendar.seasonsPerYear;
				const ticksPerDay = this._host.game.calendar.ticksPerDay;
				const daysPerTicks =
					(1 + this._host.game.timeAccelerationRatio()) / ticksPerDay;
				const ticksPerYear = daysPerYear / daysPerTicks;
				const temporalFlux = this._host.game.resPool.get("temporalFlux");
				const fluxEnabled = temporalFlux.maxValue > ticksPerYear;
				const flux = temporalFlux.value < ticksPerYear;
				if (
					!season &&
					this._host.game.calendar.day < 10 &&
					temporalFluxProduction > factor / heatPerTick &&
					this.settings.accelerateTime.enabled &&
					fluxEnabled &&
					flux
				) {
					maxSkipsActiveHeatTransfer = Math.ceil(
						(ticksPerYear + ticksPerDay * 10 - temporalFlux.value) /
							temporalFluxProduction,
					);
					this._host.engine.iactivity(
						"time.getTemporalFlux",
						"act.time.getTemporalFlux",
						[],
					);
					this._host.engine.storeForSummary("time.getTemporalFlux", 1);
				} else if (
					this.settings.timeSkip.activeHeatTransfer.cycles[Cycles[currentCycle]]
						.enabled
				) {
					// Heat Transfer during selected cycles
					return;
				} else {
					maxSkipsActiveHeatTransfer =
						this._host.game.calendar.yearsPerCycle -
						this._host.game.calendar.cycleYear;
				}
			} else if (heatNow >= heatMax - heatPerTick * ticksPerSecond * 10) {
				this.settings.timeSkip.activeHeatTransfer.activeHeatTransferStatus.enabled = true;
				this._host.refreshEntireUserInterface();
				this._host.engine.iactivity(
					"time.activeHeatTransferStart",
					"act.time.activeHeatTransferStart",
					[],
				);
				this._host.engine.storeForSummary("time.activeHeatTransferStart", 1);
			}
		}

		// The maximum years to skip, based on the user configuration.
		const maxSkips = negativeOneToInfinity(this.settings.timeSkip.max);

		// The amount of skips we can perform.
		let canSkip = Math.floor(
			Math.min(
				this.settings.timeSkip.ignoreOverheat.enabled
					? Number.POSITIVE_INFINITY
					: (heatMax - heatNow) / factor,
				maxSkips,
				maxSkipsActiveHeatTransfer,
				timeCrystalsAvailable / (1 + shatterCostIncreaseChallenge),
				0 < shatterVoidCost
					? voidAvailable / shatterVoidCost
					: Number.POSITIVE_INFINITY,
			),
		);

		// The amount of skips to perform.
		let willSkip = 0;

		const yearsPerCycle = this._host.game.calendar.yearsPerCycle;
		const remainingYearsCurrentCycle =
			yearsPerCycle - this._host.game.calendar.cycleYear;
		const cyclesPerEra = this._host.game.calendar.cyclesPerEra;
		// If the cycle has more years remaining than we can even skip, skip all of them.
		// I guess the idea here is to not skip through years of another cycle, if that
		// cycle may not be enabled for skipping.
		if (canSkip < remainingYearsCurrentCycle) {
			willSkip = canSkip;
		} else {
			willSkip += remainingYearsCurrentCycle;
			canSkip -= remainingYearsCurrentCycle;
			let skipCycles = 1;
			while (
				yearsPerCycle < canSkip &&
				this.settings.timeSkip.cycles[
					Cycles[((currentCycle + skipCycles) % cyclesPerEra) as CycleIndices]
				].enabled
			) {
				willSkip += yearsPerCycle;
				canSkip -= yearsPerCycle;
				skipCycles += 1;
			}
			if (
				this.settings.timeSkip.cycles[
					Cycles[((currentCycle + skipCycles) % cyclesPerEra) as CycleIndices]
				].enabled &&
				0 < canSkip
			) {
				willSkip += canSkip;
			}
		}
		// If we found we can skip any years, do so now.
		if (0 < willSkip) {
			const controller = new classes.ui.time.ShatterTCBtnController(
				this._host.game,
			) as ShatterTCBtnController;
			const model = controller.fetchModel({});
			controller.doShatterAmt(model, willSkip);
			this._host.engine.iactivity("time.skip", "act.time.skip", [willSkip]);
			this._host.engine.storeForSummary("time.skip", willSkip);
		}
	}

	/**
	 * Burn time crystals in order to replenish temporal flux.
	 *
	 * This is deliberately independent of the regular time skip: it ignores the
	 * configured maximum amount of years and the season/cycle selection, because
	 * its purpose is to *obtain* temporal flux, not to skip time on the player's
	 * terms. What the shatter itself consumes (time crystals and void) limits it,
	 * and so does the heat that is still missing from the chrono heat capacity,
	 * unless the player opted into ignoring the heat, because an overheated
	 * shatter costs a premium.
	 */
	acquireTemporalFlux() {
		// Shattering requires the Chronoforge.
		if (!this._host.game.workshop.get("chronoforge").researched) {
			return;
		}

		// Don't shatter while we're in a temporal paradox.
		if (this._host.game.calendar.day < 0) {
			return;
		}

		const setting = this.settings.timeSkip.acquireTemporalFlux;

		// Combusting a time crystal generates heat, and combusting while the heat
		// capacity is exhausted costs a premium. So unless the player opted into
		// ignoring the heat, only as many crystals may be burned as the heat that
		// is still missing from the capacity covers. This limits the *amount*, not
		// the feature: burning fewer crystals than the requested flux level needs
		// is fine, the acquisition simply continues on a later frame.
		let heatSkips = Number.POSITIVE_INFINITY;
		if (!setting.ignoreOverheat.enabled) {
			const heatMax = this._host.game.getEffect("heatMax");
			const heatNow = this._host.game.time.heat;
			const heatPerSkip = this._host.game.challenges.getChallenge("1000Years")
				.researched
				? 5
				: 10;
			heatSkips = heatMax <= heatNow ? 0 : (heatMax - heatNow) / heatPerSkip;
		}

		const yearsWanted = this.getTemporalFluxSkips();
		if (yearsWanted <= 0) {
			return;
		}

		const shatterCostIncreaseChallenge = this._host.game.getEffect(
			"shatterCostIncreaseChallenge",
		);
		const crystalSkips =
			this._workshopManager.getValueAvailable("timeCrystal") /
			(1 + shatterCostIncreaseChallenge);
		const shatterVoidCost = this._host.game.getEffect("shatterVoidCost");
		const voidSkips =
			0 < shatterVoidCost
				? this._workshopManager.getValueAvailable("void") / shatterVoidCost
				: Number.POSITIVE_INFINITY;

		const yearsToSkip = Math.floor(
			Math.min(yearsWanted, crystalSkips, voidSkips, heatSkips),
		);
		if (yearsToSkip <= 0) {
			return;
		}

		const controller = new classes.ui.time.ShatterTCBtnController(
			this._host.game,
		) as ShatterTCBtnController;
		const model = controller.fetchModel({});
		controller.doShatterAmt(model, yearsToSkip);

		this._host.engine.iactivity("time.skip", "act.time.skip", [yearsToSkip]);
		this._host.engine.storeForSummary("time.skip", yearsToSkip);
		this._host.engine.iactivity(
			"time.acquireTemporalFlux",
			"act.time.acquireTemporalFlux",
			[],
		);
		this._host.engine.storeForSummary("time.acquireTemporalFlux", 1);
	}

	/**
	 * Determine how many years we would like to skip in order to replenish
	 * temporal flux.
	 *
	 * Burning a time crystal skips a year and, once the `turnSmoothly` workshop
	 * upgrade (which makes chronospheres produce temporal flux) has been
	 * researched, every year that passes yields `temporalFluxProduction`
	 * temporal flux. So skipping years is the only way to actively obtain
	 * temporal flux. Without that upgrade, burning crystals doesn't produce any
	 * flux at all, in which case we don't burn any.
	 *
	 * @returns The amount of additional years to skip, or 0 if no flux is needed.
	 */
	getTemporalFluxSkips() {
		const setting = this.settings.timeSkip.acquireTemporalFlux;
		if (!setting.enabled) {
			return 0;
		}

		// Chronospheres only produce temporal flux after the "turnSmoothly"
		// workshop upgrade has been researched.
		if (!this._host.game.workshop.get("turnSmoothly").researched) {
			return 0;
		}

		const temporalFlux = this._host.game.resPool.get("temporalFlux");
		const targetFlux = resolveLimit(
			setting.trigger,
			setting.isPercentage,
			temporalFlux.maxValue,
		);

		// Nothing to do, if we're already above the configured level.
		if (temporalFlux.maxValue <= 0 || targetFlux <= temporalFlux.value) {
			return 0;
		}

		const temporalFluxProduction = this._host.game.getEffect(
			"temporalFluxProduction",
		);
		if (temporalFluxProduction <= 0) {
			return 0;
		}

		// Every skipped year produces `temporalFluxProduction` temporal flux.
		return Math.max(
			1,
			Math.ceil((targetFlux - temporalFlux.value) / temporalFluxProduction),
		);
	}

	getBuild(
		name: ChronoForgeUpgrade | VoidSpaceUpgrade,
		variant: TimeItemVariant,
	) {
		if (variant === TimeItemVariant.Chronoforge) {
			return this._host.game.time.getCFU(name as ChronoForgeUpgrade);
		}
		return this._host.game.time.getVSU(name as VoidSpaceUpgrade);
	}
}
