import { mustExist } from "@oliversalzburg/js-utils/data/nil.js";
import type { FrameContext } from "./Engine.js";
import {
	BulkPurchaseHelper,
	type ConcreteBuild,
} from "./helper/BulkPurchaseHelper.js";
import type { KittenScientists } from "./KittenScientists.js";
import {
	type TimeItem,
	TimeSettings,
	type TimeSettingsItem,
} from "./settings/TimeSettings.js";
import { cl } from "./tools/Log.js";
import {
	type ChronoForgeUpgrade,
	TimeItemVariant,
	type VoidSpaceUpgrade,
} from "./types/index.js";
import type {
	ChronoforgeBtnController,
	UnsafeChronoForgeUpgrade,
	UnsafeVoidSpaceUpgrade,
	VoidSpaceBtnController,
} from "./types/time.js";
import type { WorkshopManager } from "./WorkshopManager.js";

/**
 * Is temporal flux currently being produced?
 *
 * Chronospheres only produce temporal flux after the `turnSmoothly` workshop
 * upgrade has been researched. Without that upgrade, or without at least one
 * chronosphere, the production rate is 0.
 *
 * This mirrors the condition `TimeControlManager.getTemporalFluxSkips()` uses
 * to decide whether burning time crystals actually yields temporal flux.
 */
export function isTemporalFluxProduced(host: KittenScientists) {
	if (!host.game.workshop.get("turnSmoothly").researched) {
		return false;
	}

	return 0 < host.game.getEffect("temporalFluxProduction");
}

export class TimeManager {
	private readonly _host: KittenScientists;
	readonly settings: TimeSettings;
	private readonly _bulkManager: BulkPurchaseHelper;
	private readonly _workshopManager: WorkshopManager;

	constructor(
		host: KittenScientists,
		workshopManager: WorkshopManager,
		settings = new TimeSettings(),
	) {
		this._host = host;
		this.settings = settings;
		this._bulkManager = new BulkPurchaseHelper(this._host, workshopManager);
		this._workshopManager = workshopManager;
	}

	tick(context: FrameContext) {
		if (!this.settings.enabled) {
			return;
		}

		this._bulkManager.resetPriceCache();
		this.autoBuild(context);

		if (this.settings.fixCryochambers.enabled) {
			this.fixCryochambers();
		}
	}

	/**
	 * Try to build as many of the passed buildings as possible.
	 * Usually, this is called at each iteration of the automation engine to
	 * handle the building of items on the Time tab.
	 *
	 * @param builds The buildings to build.
	 */
	autoBuild(
		context: FrameContext,
		builds: Partial<Record<TimeItem, TimeSettingsItem>> = this.settings
			.buildings,
	) {
		const sectionTrigger = this.settings.trigger;

		// Get the current metadata for all the referenced buildings.
		const metaData: Partial<
			Record<
				TimeItem,
				Required<UnsafeChronoForgeUpgrade | UnsafeVoidSpaceUpgrade>
			>
		> = {};
		for (const build of Object.values(builds)) {
			if (build.enabled === false) {
				continue;
			}

			const buildMeta =
				build.variant === TimeItemVariant.Chronoforge
					? this._host.game.time.getCFU(build.building as ChronoForgeUpgrade)
					: this._host.game.time.getVSU(build.building as VoidSpaceUpgrade);
			metaData[build.building] = mustExist(buildMeta);

			const buildButton =
				build.variant === TimeItemVariant.Chronoforge
					? this._host.game.time.queue.getQueueElementControllerAndModel({
							name: build.building,
							type: "chronoforge",
						})
					: this._host.game.time.queue.getQueueElementControllerAndModel({
							name: build.building,
							type: "voidSpace",
						});

			const panelVisible =
				build.variant === TimeItemVariant.Chronoforge
					? this._host.game.workshop.get("chronoforge").researched
					: this._host.game.science.get("voidSpace").researched ||
						this._host.game.time.getVSU("usedCryochambers").val > 0;

			const model = buildButton.model;
			const buildingMetaData = mustExist(metaData[build.building]);
			buildingMetaData.tHidden = !model.metadata.unlocked || !panelVisible;
		}

		const builder = (build: ConcreteBuild) => {
			this.build(
				build.id as ChronoForgeUpgrade | VoidSpaceUpgrade,
				build.variant as TimeItemVariant,
				build.count,
			);
		};
		context.purchaseOrders.push({ builder, builds, metaData, sectionTrigger });
	}

	build(
		name: ChronoForgeUpgrade | VoidSpaceUpgrade,
		variant: TimeItemVariant,
		amount: number,
	): void {
		let amountConstructed = 0;
		let label: string;
		if (variant === TimeItemVariant.Chronoforge) {
			const itemMetaRaw = game.getUnlockByName(name, "chronoforge");
			const controller = new classes.ui.time.ChronoforgeBtnController(
				this._host.game,
			) as ChronoforgeBtnController;
			const model = controller.fetchModel({ controller, id: itemMetaRaw.name });
			amountConstructed = this._bulkManager.construct(
				model,
				controller,
				amount,
			);
			label = itemMetaRaw.label;
		} else {
			const itemMetaRaw = game.getUnlockByName(name, "voidSpace");
			const controller = new classes.ui.time.VoidSpaceBtnController(
				this._host.game,
			) as VoidSpaceBtnController;
			const model = controller.fetchModel({ controller, id: itemMetaRaw.name });
			amountConstructed = this._bulkManager.construct(
				model,
				controller,
				amount,
			);
			label = itemMetaRaw.label;
		}

		if (amount !== amountConstructed) {
			console.warn(
				...cl(
					`${label} Amount ordered: ${amount} Amount Constructed: ${amountConstructed}`,
				),
			);
			// Bail out to not flood the log with garbage.
			if (amountConstructed === 0) {
				return;
			}
		}
		this._host.engine.storeForSummary("build.time", amountConstructed, label);

		if (amountConstructed === 1) {
			this._host.engine.iactivity("build.time", "act.build", [label]);
		} else {
			this._host.engine.iactivity("build.time", "act.builds", [
				label,
				this._host.renderAbsolute(amountConstructed),
			]);
		}
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

	fixCryochambers() {
		// Optionally require an active source of temporal flux before repairing:
		// without one, every repair would drain flux that never comes back.
		if (
			this.settings.fixCryochambers.onlyWithFluxProduction.enabled &&
			!isTemporalFluxProduced(this._host)
		) {
			return;
		}

		if (this._host.game.time.getVSU("usedCryochambers").val < 1) {
			return;
		}

		const prices = mustExist(
			this._host.game.time.getVSU("usedCryochambers").fixPrices,
		);

		// Repairing a cryochamber costs temporal flux. The configured lower limit is
		// the amount of temporal flux that has to *remain* after a repair, so that
		// repairs never drain the flux that other features (like time acceleration)
		// rely on. A value of 0 (or less) means "don't limit repairs at all".
		//
		// This has to be re-evaluated for every single repair: checking it only once
		// before the loop would allow a run of repairs to spend far below the limit.
		const minimumTemporalFlux = this.settings.fixCryochambers.trigger;
		const temporalFluxPrice = prices
			.filter((price) => "temporalFlux" === price.name)
			.reduce((total, price) => total + price.val, 0);

		const staysAboveLimit = () =>
			minimumTemporalFlux <= 0 ||
			minimumTemporalFlux <=
				this._workshopManager.getValueAvailable("temporalFlux") -
					temporalFluxPrice;

		const canAfford = () =>
			prices.every(
				(price) =>
					price.val <= this._workshopManager.getValueAvailable(price.name),
			);

		const controller = new classes.ui.time.FixCryochamberBtnController(
			this._host.game,
		);
		const model = controller.fetchModel({});

		let fixed = 0;
		while (staysAboveLimit() && canAfford()) {
			const buyResult = controller.buyItem(model);
			if (!buyResult.itemBought) {
				break;
			}

			fixed += 1;
		}

		if (0 < fixed) {
			this._host.engine.iactivity(
				"time.fixCryochamber",
				"act.time.fixCryochamber",
				[this._host.renderAbsolute(fixed)],
			);
			this._host.engine.storeForSummary("time.fixCryochamber", fixed);
		}
	}
}
