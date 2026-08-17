import { shuffleArray } from "@oliversalzburg/js-utils/data/array.js";
import {
	isNil,
	type Maybe,
	mustExist,
} from "@oliversalzburg/js-utils/data/nil.js";
import { type Automation, Engine, type FrameContext } from "./Engine.js";
import type { KittenScientists } from "./KittenScientists.js";
import {
	TradeSettings,
	type TradeSettingsItem,
} from "./settings/TradeSettings.js";
import { objectEntries } from "./tools/Entries.js";
import { negativeOneToInfinity, ucfirst } from "./tools/Format.js";
import { cl } from "./tools/Log.js";
import type { UnsafeRace } from "./types/diplomacy.js";
import type { Race, Resource } from "./types/index.js";
import type { UnsafeResource } from "./types/resources.js";
import type { WorkshopManager } from "./WorkshopManager.js";

export class TradeManager implements Automation {
	private readonly _host: KittenScientists;
	readonly settings: TradeSettings;
	private readonly _workshopManager: WorkshopManager;

	constructor(
		host: KittenScientists,
		workshopManager: WorkshopManager,
		settings = new TradeSettings(),
	) {
		this._host = host;
		this.settings = settings;
		this._workshopManager = workshopManager;
	}

	tick(context: FrameContext) {
		if (!this.settings.enabled) {
			return;
		}

		this.autoTrade();

		if (this.settings.unlockRaces.enabled) {
			this.autoUnlock(context);
		}
		if (this.settings.buildEmbassies.enabled) {
			this.autoBuildEmbassies(context);
		}
		if (this.settings.feedLeviathans.enabled) {
			this.autoFeedElders();
		}
		if (this.settings.tradeBlackcoin.enabled) {
			this.autoTradeBlackcoin();
		}
	}

	autoTrade() {
		const catpower = this._workshopManager.getResource("manpower");
		const gold = this._workshopManager.getResource("gold");
		const sectionTrigger = this.settings.trigger;

		// The races we might want to trade with during this frame.
		const trades: Array<Race> = [];

		const season = this._host.game.calendar.getCurSeason().name;

		// Determine how many races we will trade with this cycle.
		for (const trade of Object.values(this.settings.races)) {
			if (!trade.enabled || !trade.seasons[season].enabled) {
				continue;
			}

			const race = this.getRace(trade.race);
			const trigger = Engine.evaluateSubSectionTrigger(
				sectionTrigger,
				trade.trigger,
			);

			// Check if the race is enabled, in season, unlocked, and we can actually afford it.
			if (
				trigger < 0 ||
				!race.unlocked ||
				!this.singleTradePossible(sectionTrigger, catpower, gold, trade)
			) {
				continue;
			}

			// Determine which resource the race requires for trading, if any.
			const require = trade.require
				? this._workshopManager.getResource(trade.require)
				: false;

			// Check if this trade would be profitable.
			const profitable = this.getProfitability(trade.race);
			// If the trade is set to be limited and profitable, make this trade.
			if (trade.limited && profitable) {
				trades.push(trade.race);
			} else if (
				// If this trade is not limited, it must either not require anything, or
				// the required resource must be over the trigger value.
				// Additionally, gold must also be over the trigger value.
				!require ||
				trigger <= require.value / require.maxValue
			) {
				trades.push(trade.race);
			}
		}

		// If no trade options were triggered, bail out.
		if (trades.length === 0) {
			return;
		}

		// How many times we could trade total.
		const maxTrades = this.getLowestTradeAmount(null);
		// How many times we could trade with each race.
		const tradeCountsPossible = new Map<Race, number>(
			trades.map((_) => [_, this.getLowestTradeAmount(_)]),
		);

		// Now let's do some trades.
		// The current implementation aims for correctness. It is SLOW.
		// If we can do thousands of trades, we will iterate through this code
		// thousands of times.
		// TODO: Optimize this for performance.

		const racesLeft = shuffleArray(
			tradeCountsPossible
				.entries()
				.map(([race, count]) => (0 < count ? (race as Race) : null))
				.filter((_) => _ !== null)
				.toArray(),
		);
		let tradesOrderedTotal = 0;
		const tradeCountsOrdered = new Map<Race, number>(
			racesLeft.map((_) => [_, 0]),
		);
		let raceIndex = 0;
		while (0 < racesLeft.length && tradesOrderedTotal < maxTrades) {
			const race = racesLeft[raceIndex];
			tradeCountsOrdered.set(race, mustExist(tradeCountsOrdered.get(race)) + 1);
			++tradesOrderedTotal;
			tradeCountsPossible.set(
				race,
				mustExist(tradeCountsPossible.get(race)) - 1,
			);
			if (tradeCountsPossible.get(race) === 0) {
				racesLeft.splice(raceIndex, 1);
			}
			raceIndex = racesLeft.length <= raceIndex + 1 ? 0 : raceIndex + 1;
		}

		// If we found no trades to do, bail out.
		if (tradesOrderedTotal === 0) {
			return;
		}

		// Now actually perform the calculated trades.
		for (const [name, count] of tradeCountsOrdered.entries()) {
			this.trade(name, count);
		}
	}

	autoBuildEmbassies(context: FrameContext) {
		if (!this._host.game.diplomacy.races[0].embassyPrices) {
			return;
		}

		// Tries to calculate how many embassies for which races it can buy,
		// then it buys them. Code should be straight-forward.

		const culture = this._workshopManager.getResource("culture");
		let cultureVal = 0;
		const trigger = this.settings.buildEmbassies.trigger;
		if (culture.value / culture.maxValue < negativeOneToInfinity(trigger)) {
			return;
		}

		cultureVal = this._workshopManager.getValueAvailable("culture");

		const embassyBulk: Partial<
			Record<
				Race,
				{
					val: number;
					max: number;
					basePrice: number;
					currentEm: number;
					priceSum: number;
					race: UnsafeRace;
				}
			>
		> = {};
		const bulkTracker: Array<Race> = [];

		for (const race of this._host.game.diplomacy.races) {
			const name = race.name;
			if (name in this.settings.buildEmbassies.races === false) {
				continue;
			}

			const max = negativeOneToInfinity(
				this.settings.buildEmbassies.races[name].max,
			);
			if (
				!this.settings.buildEmbassies.races[name].enabled ||
				max <= race.embassyLevel ||
				!race.unlocked
			) {
				continue;
			}

			embassyBulk[name] = {
				basePrice: mustExist(race.embassyPrices?.[0]).val,
				currentEm: race.embassyLevel,
				max,
				priceSum: 0,
				race: race,
				val: 0,
			};
			bulkTracker.push(name);
		}

		if (bulkTracker.length === 0) {
			return;
		}

		const priceCoefficient =
			1 - this._host.game.getEffect("embassyCostReduction");
		const embassyFakeBought = this._host.game.getEffect("embassyFakeBought");

		while (bulkTracker.length > 0) {
			for (let raceIndex = 0; raceIndex < bulkTracker.length; raceIndex++) {
				const name = bulkTracker[raceIndex];
				const emBulk = mustExist(embassyBulk[name]);

				if (emBulk.max <= emBulk.currentEm + emBulk.val) {
					bulkTracker.splice(raceIndex, 1);
					--raceIndex;
					continue;
				}

				const nextPrice =
					emBulk.basePrice *
					priceCoefficient *
					1.15 ** (emBulk.currentEm + embassyFakeBought + emBulk.val);

				if (nextPrice <= cultureVal) {
					cultureVal -= nextPrice;
					emBulk.priceSum += nextPrice;
					emBulk.val += 1;
					context.requestGameUiRefresh = true;
				} else {
					bulkTracker.splice(raceIndex, 1);
					--raceIndex;
				}
			}
		}

		for (const [, emBulk] of objectEntries(embassyBulk)) {
			if (emBulk.val === 0) {
				continue;
			}
			cultureVal = this._workshopManager.getValueAvailable("culture");
			if (cultureVal < emBulk.priceSum) {
				console.warn(
					...cl(
						"Something has gone horribly wrong.",
						emBulk.priceSum,
						cultureVal,
					),
				);
			}
			// We don't want to invoke the embassy build action multiple times, as
			// that would cause lots of log messages.
			// Instead, we replicate the behavior of the game here and purchase in bulk.
			this._workshopManager.getResource("culture").value -= emBulk.priceSum;
			emBulk.race.embassyLevel += emBulk.val;

			this._host.engine.storeForSummary("embassy", emBulk.val);
			if (emBulk.val !== 1) {
				this._host.engine.iactivity(
					"act.build.embassies",
					[emBulk.race.title, emBulk.val],
					"ks-build",
				);
			} else {
				this._host.engine.iactivity(
					"act.build.embassy",
					[emBulk.race.title],
					"ks-build",
				);
			}
		}
	}

	autoFeedElders() {
		const leviathanInfo = this._host.game.diplomacy.get("leviathans");
		const necrocorns = this._host.game.resPool.get("necrocorn");

		if (!leviathanInfo.unlocked || necrocorns.value === 0) {
			return;
		}

		if (1 <= necrocorns.value) {
			// If feeding the elders would increase their energy level towards the
			// cap, do it.
			if (leviathanInfo.energy < this._host.game.diplomacy.getMarkerCap()) {
				this._host.game.diplomacy.feedElders();
				this._host.engine.iactivity("act.feed");
				this._host.engine.storeForSummary("feed", 1);
			}
		} else {
			// We can reach this branch if we have partial necrocorns from resets.
			// The partial necrocorns will then be feed to the elders to bring us back
			// to even zero.
			if (0.25 * (1 + this._host.game.getEffect("corruptionBoostRatio")) < 1) {
				this._host.engine.storeForSummary("feed", necrocorns.value);
				this._host.game.diplomacy.feedElders();
				this._host.engine.iactivity("dispose.necrocorn");
			}
		}
	}

	autoUnlock(context: FrameContext) {
		if (!this._host.game.tabs[4].visible) {
			return;
		}

		// Check how many races we could reasonably unlock at this point.
		const maxRaces = this._host.game.diplomacy.get("leviathans").unlocked
			? 8
			: 7;
		// If we haven't unlocked that many races yet...
		if (this._host.game.diplomacyTab.racePanels.length < maxRaces) {
			// Get the currently available catpower.
			let manpower = this._workshopManager.getValueAvailable("manpower");
			// TODO: These should be checked in reverse order. Otherwise the check for lizards
			//       can cause the zebras to be discovered at later stages in the game. Then it
			//       gets to the check for the zebras and doesn't explore again, as they're
			//       already unlocked. Then it takes another iteration to unlock the other race.
			// Send explorers if we haven't discovered the lizards yet.
			if (!this._host.game.diplomacy.get("lizards").unlocked) {
				if (manpower >= 1000) {
					this._host.game.resPool.get("manpower").value -= 1000;
					const unlockedRace = mustExist(
						this._host.game.diplomacy.unlockRandomRace(),
					);
					this._host.engine.iactivity(
						"upgrade.race",
						[unlockedRace.title],
						"ks-upgrade",
					);
					manpower -= 1000;
					context.requestGameUiRefresh = true;
				}
			}

			// Do exactly the same for the sharks.
			if (!this._host.game.diplomacy.get("sharks").unlocked) {
				if (manpower >= 1000) {
					this._host.game.resPool.get("manpower").value -= 1000;
					const unlockedRace = mustExist(
						this._host.game.diplomacy.unlockRandomRace(),
					);
					this._host.engine.iactivity(
						"upgrade.race",
						[unlockedRace.title],
						"ks-upgrade",
					);
					manpower -= 1000;
					context.requestGameUiRefresh = true;
				}
			}

			// Do exactly the same for the griffins.
			if (!this._host.game.diplomacy.get("griffins").unlocked) {
				if (manpower >= 1000) {
					this._host.game.resPool.get("manpower").value -= 1000;
					const unlockedRace = mustExist(
						this._host.game.diplomacy.unlockRandomRace(),
					);
					this._host.engine.iactivity(
						"upgrade.race",
						[unlockedRace.title],
						"ks-upgrade",
					);
					manpower -= 1000;
					context.requestGameUiRefresh = true;
				}
			}

			// For nagas, we additionally need enough culture.
			if (
				!this._host.game.diplomacy.get("nagas").unlocked &&
				this._host.game.resPool.get("culture").value >= 1500
			) {
				if (manpower >= 1000) {
					this._host.game.resPool.get("manpower").value -= 1000;
					const unlockedRace = mustExist(
						this._host.game.diplomacy.unlockRandomRace(),
					);
					this._host.engine.iactivity(
						"upgrade.race",
						[unlockedRace.title],
						"ks-upgrade",
					);
					manpower -= 1000;
					context.requestGameUiRefresh = true;
				}
			}

			// Zebras require us to have a ship.
			if (
				!this._host.game.diplomacy.get("zebras").unlocked &&
				this._host.game.resPool.get("ship").value >= 1
			) {
				if (manpower >= 1000) {
					this._host.game.resPool.get("manpower").value -= 1000;
					const unlockedRace = mustExist(
						this._host.game.diplomacy.unlockRandomRace(),
					);
					this._host.engine.iactivity(
						"upgrade.race",
						[unlockedRace.title],
						"ks-upgrade",
					);
					manpower -= 1000;
					context.requestGameUiRefresh = true;
				}
			}

			// For spiders, we need 100 ships and 125000 science.
			if (
				!this._host.game.diplomacy.get("spiders").unlocked &&
				mustExist(this._host.game.resPool.get("ship")).value >= 100 &&
				mustExist(this._host.game.resPool.get("science")).maxValue > 125000
			) {
				if (manpower >= 1000) {
					mustExist(this._host.game.resPool.get("manpower")).value -= 1000;
					const unlockedRace = mustExist(
						this._host.game.diplomacy.unlockRandomRace(),
					);
					this._host.engine.iactivity(
						"upgrade.race",
						[unlockedRace.title],
						"ks-upgrade",
					);
					manpower -= 1000;
					context.requestGameUiRefresh = true;
				}
			}

			// Dragons require nuclear fission to be researched.
			if (
				!this._host.game.diplomacy.get("dragons").unlocked &&
				this._host.game.science.get("nuclearFission").researched
			) {
				if (manpower >= 1000) {
					mustExist(this._host.game.resPool.get("manpower")).value -= 1000;
					const unlockedRace = mustExist(
						this._host.game.diplomacy.unlockRandomRace(),
					);
					this._host.engine.iactivity(
						"upgrade.race",
						[unlockedRace.title],
						"ks-upgrade",
					);
					manpower -= 1000;
					context.requestGameUiRefresh = true;
				}
			}
		}
	}

	autoTradeBlackcoin() {
		const coinPrice = this._host.game.calendar.cryptoPrice;
		const relicsInitial = this._host.game.resPool.get("relic").value;
		const coinsInitial = this._host.game.resPool.get("blackcoin").value;
		let coinsExchanged = 0.0;
		let relicsExchanged = 0.0;

		// All of this code is straight-forward. Buy low, sell high.

		// Exchanges up to a certain threshold, in order to keep a good exchange rate, then waits
		// for a higher threshold before exchanging for relics.
		if (
			coinPrice < this.settings.tradeBlackcoin.buy &&
			this.settings.tradeBlackcoin.trigger < relicsInitial
		) {
			this._host.game.diplomacy.buyBcoin();

			const currentCoin = this._host.game.resPool.get("blackcoin").value;
			coinsExchanged = Math.round(currentCoin - coinsInitial);
			this._host.engine.iactivity("act.blackcoin.buy", [
				this._host.renderAbsolute(coinsExchanged),
			]);
		} else if (
			coinPrice > this.settings.tradeBlackcoin.sell &&
			0 < this._host.game.resPool.get("blackcoin").value
		) {
			this._host.game.diplomacy.sellBcoin();

			const relicsCurrent = mustExist(
				this._host.game.resPool.get("relic"),
			).value;
			relicsExchanged = Math.round(relicsCurrent - relicsInitial);

			this._host.engine.iactivity("act.blackcoin.sell", [
				this._host.renderAbsolute(relicsExchanged),
			]);
		}
	}

	/**
	 * Trade with the given race.
	 *
	 * @param name The race to trade with.
	 * @param amount How often to trade with the race.
	 */
	trade(name: Race, amount: number): void {
		const race = this.getRace(name);

		this._host.game.diplomacy.tradeMultiple(race, amount);
		this._host.engine.storeForSummary(race.title, amount, "trade");
		this._host.engine.iactivity(
			"act.trade",
			[this._host.renderAbsolute(amount), ucfirst(race.title)],
			"ks-trade",
		);
	}

	/**
	 * Determine if a trade with the given race would be considered profitable.
	 *
	 * @param name The race to trade with.
	 * @returns `true` if the trade is profitable; `false` otherwise.
	 */
	getProfitability(name: Race): boolean {
		const race = this.getRace(name);

		// This will keep track of how much we have to spend on a given trade.
		// Higher values are worse.
		let cost = 0;
		// Get materials required to trade with the race.
		const materials = this.getMaterials(name);
		// For each material required to trade with the race...
		for (const [mat, amount] of objectEntries(materials)) {
			// ...determine how much of the resource is produced each tick.
			const tick = this._workshopManager.getTickVal(
				this._workshopManager.getResource(mat),
			);
			// If we're not producing any of this resource, it's spice, or blueprints,
			// don't consider it in the calculation.
			if (tick === "ignore") {
				continue;
			}
			// If we're consuming this resource instead of producing it,
			// instantly consider this trade not profitable.
			if (tick <= 0) {
				return false;
			}

			// Add to the cost.
			// We consider all resources to be equal in the profitability calculation.
			// We just add the cost of the resource, divided by how much of it we're
			// producing. So resources that we produce a lot of, don't "cost" as much.
			cost += amount / tick;
		}

		// This will keep track of how much we receive from a given trade.
		let profit = 0;
		// Get resources returned from trade.
		const output = this.getAverageTrade(race);
		// For each material resulting from a trade with the race...
		for (const [prod, amount] of objectEntries(output)) {
			const resource = this._workshopManager.getResource(prod);
			// ...determine how much of the resource is produced each tick.
			const tick = this._workshopManager.getTickVal(resource);
			// If we're not producing any of this resource, it's spice, or blueprints,
			// don't consider it in the calculation.
			if (tick === "ignore") {
				continue;
			}
			// If we're consuming this resource instead of producing it,
			// instantly consider this trade profitable.
			if (tick <= 0) {
				return true;
			}

			profit +=
				// For capped resources...
				0 < resource.maxValue
					? // ... only add as much to the profit as we can store.
						Math.min(amount, Math.max(resource.maxValue - resource.value, 0)) /
						tick
					: // For uncapped resources, add all of it.
						amount / tick;
		}

		// If the profit is higher than the cost, consider this profitable.
		return cost <= profit;
	}

	/**
	 * Determine which resources, and how much of them, a trade with the given race results in at average.
	 * This information is basically what you see in the UI on the individual races sections.
	 * Where it shows which resources that race will provide, and how much of it min-max.
	 * We want exactly this information - averaged.
	 *
	 * @param race The race to check.
	 * @returns The resources returned from an average trade and their amount.
	 */
	getAverageTrade(race: UnsafeRace): Partial<Record<Resource, number>> {
		// If you need to update this logic, copy from the game's source code from 'diplomacy.js',
		// from the 'render' function of 'com.nuclearunicorn.game.ui.tab.Diplomacy'.
		// Note that the race sections do not include Spice and Blueprints. The logic for these
		// resources has to be copied from the 'tradeImpl' of 'classes.managers.DiplomacyManager'.
		const baseTradeRatio = 1 + this._host.game.diplomacy.getTradeRatio();
		const tradeVolume = this._host.game.diplomacy.getTradeVolume();
		const currentSeason = this._host.game.calendar.getCurSeason().name;

		const tradeRatio =
			baseTradeRatio +
			this._host.game.diplomacy.calculateTradeBonusFromPolicies(
				race.name,
				this._host.game,
			) +
			this._host.game.challenges
				.getChallenge("pacifism")
				.getTradeBonusEffect(this._host.game);

		// Calculate for 100 trades, to easily derive a percentage.
		const tradeResults =
			this._host.game.diplomacy.calculateFailedNormalBonusTrades(
				this._host.game.diplomacy.getFinalStanding(race),
				100,
				0,
			);
		const spiceChance = this._host.game.diplomacy.getSpiceTradeChance(race);
		const blueprintTradeChance =
			this._host.game.diplomacy.getBlueprintTradeChance(race);

		const successRatio = (tradeResults.normal + tradeResults.bonus) / 100;

		const output: Partial<Record<Resource, number>> = {};
		for (const item of race.sells) {
			if (!this._host.game.diplomacy.isValidTrade(item, race)) {
				// Still put invalid trades into the result to not cause missing keys.
				output[item.name] = 0;
				continue;
			}

			const average =
				item.value *
				tradeRatio *
				tradeVolume *
				(1 + race.energy * 0.02) *
				(1 + (item.seasons ? item.seasons[currentSeason] : 0));
			output[item.name] = average;
		}

		if (race.name === "zebras") {
			const zebraRelationModifierTitanium =
				this._host.game.getEffect("zebraRelationModifier") *
				(this._host.game.bld.getBuildingExt("tradepost").meta.effects
					?.tradeRatio ?? 1);
			output.titanium =
				(1.5 + this._host.game.resPool.get("ship").value * 0.03) *
				(1 + zebraRelationModifierTitanium) *
				tradeVolume;
		}

		const spiceTradeAmount = successRatio * Math.min(spiceChance, 1);
		output.spice = 25 * spiceTradeAmount + 50 * tradeRatio * spiceTradeAmount;
		output.blueprint = successRatio * blueprintTradeChance;

		return output;
	}

	/**
	 * Determine how many trades are at least possible.
	 *
	 * @param name The race to trade with.
	 * @returns The lowest number of trades possible with this race.
	 */
	getLowestTradeAmount(name: Race | null): number {
		let amount: number | undefined;
		const materials = this.getMaterials(name);

		let total: number | undefined;
		for (const [resource, required] of objectEntries(materials)) {
			if (resource === "manpower") {
				let manpowerCost = required;
				if (this._host.game.challenges.isActive("postApocalypse")) {
					manpowerCost =
						required * (1 + this._host.game.bld.getPollutionLevel());
				}
				total =
					this._workshopManager.getValueAvailable(resource) / manpowerCost;
			} else if (resource === "gold") {
				let goldCost = required;
				if (this._host.game.challenges.isActive("postApocalypse")) {
					goldCost = required * (1 + this._host.game.bld.getPollutionLevel());
				}
				total = this._workshopManager.getValueAvailable(resource) / goldCost;
			} else {
				total = this._workshopManager.getValueAvailable(resource) / required;
			}

			// Set the amount to the lowest amount of possible trades seen yet.
			amount = amount === undefined || total < amount ? total : amount;
		}

		// Round the amount down and normalize to 0.
		amount = Math.floor(amount ?? 0);

		// If the lowest amount is 0, return 0.
		if (amount === 0) {
			return 0;
		}

		// If no race was specified, return the currently known lowest amount.
		if (name === null) {
			return amount;
		}

		const race = this.getRace(name);

		// Loop through the items obtained by the race, and determine
		// which resource has the most space left. Once we've determined this,
		// reduce the amount by this capacity. This ensures that we continue to trade
		// as long as at least one resource has capacity, and we never over-trade.

		let highestCapacity = 0;
		const tradeOutput = this.getAverageTrade(race);
		for (const item of race.sells) {
			const resource = this._workshopManager.getResource(item.name);

			// No need to process resources that don't cap
			if (!resource.maxValue) {
				highestCapacity = Number.POSITIVE_INFINITY;
				break;
			}

			const max = mustExist(tradeOutput[item.name]);

			const capacity = Math.max((resource.maxValue - resource.value) / max, 0);

			highestCapacity = capacity < highestCapacity ? highestCapacity : capacity;
		}

		// We must take the ceiling of capacity so that we will trade as long
		// as there is any room, even if it doesn't have exact space. Otherwise
		// we seem to starve trading altogether.
		highestCapacity = Math.ceil(highestCapacity);

		// If any of the resources resulting from a trade are already capped, we
		// don't want to trade with this race.
		if (highestCapacity === 0) {
			return 0;
		}

		// Now that we know the most we *should* trade for, check to ensure that
		// we trade for our max cost, or our max capacity, whichever is lower.
		// This helps us prevent trading for resources we can't store. Note that we
		// essentially ignore blueprints here.

		amount =
			highestCapacity < amount ? Math.max(highestCapacity - 1, 1) : amount;

		return Math.floor(amount);
	}

	/**
	 * Determine the resources required to trade with the given race.
	 *
	 * @param race The race to check. If not specified the resources for any
	 * trade will be returned.
	 * @returns The resources need to trade with the race.
	 */
	getMaterials(race: Maybe<Race> = null): Partial<Record<Resource, number>> {
		const materials: Partial<Record<Resource, number>> = {
			gold: 15 - this._host.game.getEffect("tradeGoldDiscount"),
			manpower: 50 - this._host.game.getEffect("tradeCatpowerDiscount"),
		};

		if (isNil(race)) {
			return materials;
		}

		const prices = this.getRace(race).buys;

		for (const price of prices) {
			materials[price.name] =
				price.val * this._host.game.diplomacy.getTradeVolume();
		}

		return materials;
	}

	/**
	 * Retrieve information about the given race from the game.
	 *
	 * @param name The race to get the information object for.
	 * @returns The information object for the given race.
	 */
	getRace(name: Race): UnsafeRace {
		const raceInfo = this._host.game.diplomacy.get(name);
		if (isNil(raceInfo)) {
			throw new Error(`Unable to retrieve race '${name}'`);
		}
		return raceInfo;
	}

	/**
	 * Determine if at least a single trade can be made.
	 *
	 * @param trade - The trade option to check. If not specified, all races are checked.
	 * @returns If the requested trade is possible.
	 */
	singleTradePossible(
		sectionTrigger: number,
		catpower: Required<UnsafeResource>,
		gold: Required<UnsafeResource>,
		trade?: TradeSettingsItem,
	): boolean {
		const trigger = trade
			? Engine.evaluateSubSectionTrigger(sectionTrigger, trade.trigger)
			: sectionTrigger;

		if (trigger < 0 && trade === undefined) {
			// We will have to check all potential trades individually.
			return true;
		}

		if (trigger < 0 && trade !== undefined) {
			// This will never trigger.
			return false;
		}

		// We should only trade if catpower and gold hit the trigger value.
		// Trades can additionally require specific resources. We will check for those later.
		if (
			catpower.value / catpower.maxValue < trigger ||
			gold.value / gold.maxValue < trigger
		) {
			return false;
		}

		// Get the materials required to trade with the race.
		const materials = this.getMaterials(trade?.race);
		for (const [resource, amount] of objectEntries<Resource, number>(
			materials,
		)) {
			// Check if we have a sufficient amount of that resource in storage.
			if (this._workshopManager.getValueAvailable(resource) < amount) {
				return false;
			}
		}
		return true;
	}
}
