import { CacheManager } from "./CacheManager";
import { TabManager } from "./TabManager";
import { objectEntries } from "./tools/Entries";
import { ucfirst } from "./tools/Format";
import { isNil, Maybe, mustExist } from "./tools/Maybe";
import { BuildButton, Race, RaceInfo, Resource, TradeInfo, TradingTab } from "./types";
import { UserScript } from "./UserScript";
import { WorkshopManager } from "./WorkshopManager";

export class TradeManager {
  private readonly _host: UserScript;
  readonly manager: TabManager<TradingTab>;
  private readonly _workshopManager: WorkshopManager;

  constructor(host: UserScript) {
    this._host = host;
    this.manager = new TabManager(this._host, "Trade");
    this._workshopManager = new WorkshopManager(this._host);
  }

  autoTrade(cacheManager?: CacheManager) {
    this.manager.render();

    // If we can't make any trades, bail out.
    if (!this.singleTradePossible()) {
      return;
    }

    // The races we might want to trade with during this frame.
    const trades: Array<Race> = [];

    const gold = this._workshopManager.getResource("gold");
    const requireTrigger = this._host.options.auto.trade.trigger;
    const season = this._host.gamePage.calendar.getCurSeason().name;

    // Determine how many races we will trade with this cycle.
    for (const [name, trade] of objectEntries(this._host.options.auto.trade.items)) {
      const race = this.getRace(name);

      // Check if the race is enabled, in season, unlocked, and we can actually afford it.
      if (!trade.enabled || !trade[season] || !race.unlocked || !this.singleTradePossible(name)) {
        continue;
      }

      // Additionally, we now check if the trade button is enabled, which kinda makes all previous
      // checks moot, but whatever :D
      const button = this.getTradeButton(race.name);
      if (!button.model.enabled) {
        continue;
      }

      // Determine which resource the race requires for trading, if any.
      const require = !trade.require ? false : this._workshopManager.getResource(trade.require);

      // Check if this trade would be profitable.
      const profitable = this.getProfitability(name);
      // If the trade is set to be limited and profitable, make this trade.
      if (trade.limited && profitable) {
        trades.push(name);
      } else if (
        // If this trade is not limited, it must either not require anything, or
        // the required resource must be over the trigger value.
        // Additionally, gold must also be over the trigger value.
        (!require || requireTrigger <= require.value / require.maxValue) &&
        requireTrigger <= gold.value / gold.maxValue
      ) {
        trades.push(name);
      }
    }

    // If no possible trades were found, bail out.
    if (trades.length === 0) {
      return;
    }

    // Figure out how much we can currently trade
    let maxTrades = this.getLowestTradeAmount(null, true, false);

    // If no trades are possible, bail out.
    if (maxTrades < 1) {
      return;
    }

    // Distribute max trades without starving any race.

    // This array should hold the amount of trades possible with each race.
    // The indices between this array and `trades` align.
    const maxByRace: Array<number> = [];
    // For all races we consider trading with, perform a more thorough check
    // if we actually can trade with them and how many times we could trade
    // with them.
    for (let tradeIndex = 0; tradeIndex < trades.length; tradeIndex++) {
      const race = trades[tradeIndex];
      const tradeSettings = this._host.options.auto.trade.items[race];
      // Does this trade require a certain resource?
      const require = !tradeSettings.require
        ? false
        : this._workshopManager.getResource(tradeSettings.require);
      // Have the trigger conditions for this trade been met?
      const trigConditions =
        (!require || requireTrigger <= require.value / require.maxValue) &&
        requireTrigger <= gold.value / gold.maxValue;
      // How many trades could we do?
      const tradePos = this.getLowestTradeAmount(race, tradeSettings.limited, trigConditions);
      // If no trades are possible, remove the race.
      if (tradePos < 1) {
        trades.splice(tradeIndex, 1);
        tradeIndex--;
        continue;
      }

      maxByRace.push(tradePos);
    }

    // If no trades are left over after this check, bail out.
    if (trades.length === 0) {
      return;
    }

    // Now let's do some trades.

    // This keeps track of how many trades we've done with each race.
    const tradesDone: Partial<Record<Race, number>> = {};
    // While we have races left to trade with, and enough resources to trade (this
    // is indicated by `maxTrades`)...
    while (0 < trades.length && 1 <= maxTrades) {
      // If we can make fewer trades than we have resources available for...
      if (maxTrades < trades.length) {
        // ...find a random race to trade with
        const randomRaceIndex = Math.floor(Math.random() * trades.length);
        // Init the counter if necessary.
        if (!tradesDone[trades[randomRaceIndex]]) {
          tradesDone[trades[randomRaceIndex]] = 0;
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        tradesDone[trades[randomRaceIndex]]! += 1;
        maxTrades -= 1;

        // As we are constrained on resources, don't trade with this race again.
        // We want to distribute the few resources we have between races.
        trades.splice(randomRaceIndex, 1);
        maxByRace.splice(randomRaceIndex, 1);
        continue;
      }

      // We now want to determine which race we can trade with the least amount
      // of times.
      // This likely to determine the "best" trades to perform.
      // The result is that we trade first with the races that we can make the
      // least amount of trades with, then continue to make trades with the
      // races we can make more trades with (although that amount could be reduced
      // by the time we get to them).
      let minTrades = Math.floor(maxTrades / trades.length);
      let minTradeIndex = 0;
      for (let tradeIndex = 0; tradeIndex < trades.length; ++tradeIndex) {
        if (maxByRace[tradeIndex] < minTrades) {
          minTrades = maxByRace[tradeIndex];
          minTradeIndex = tradeIndex;
        }
      }

      // Store this trade in the trades we've "done".
      if (!tradesDone[trades[minTradeIndex]]) {
        tradesDone[trades[minTradeIndex]] = 0;
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      tradesDone[trades[minTradeIndex]]! += minTrades;
      maxTrades -= minTrades;
      trades.splice(minTradeIndex, 1);
      maxByRace.splice(minTradeIndex, 1);
    }

    // If we found no trades to do, bail out.
    if (Object.values(tradesDone).length === 0) {
      return;
    }

    // Calculate how much we will spend and earn from trades.
    // This is straight forward.
    const tradeNet: Partial<Record<Resource, number>> = {};
    for (const [name, amount] of objectEntries(tradesDone)) {
      const race = this.getRace(name);

      const materials = this.getMaterials(name);
      for (const [mat, matAmount] of objectEntries(materials)) {
        if (!tradeNet[mat]) {
          tradeNet[mat] = 0;
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        tradeNet[mat]! -= matAmount * amount;
      }

      const meanOutput = this.getAverageTrade(race);
      for (const [out, outValue] of objectEntries(meanOutput)) {
        const res = this._workshopManager.getResource(out);
        if (!tradeNet[out]) {
          tradeNet[out] = 0;
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        tradeNet[out]! +=
          res.maxValue > 0
            ? Math.min(
                mustExist(meanOutput[out]) * mustExist(tradesDone[name]),
                Math.max(res.maxValue - res.value, 0)
              )
            : outValue * mustExist(tradesDone[name]);
      }
    }

    // Update the cache with the changes produced from the trades.
    if (!isNil(cacheManager)) {
      cacheManager.pushToCache({
        materials: tradeNet,
        timeStamp: this._host.gamePage.timer.ticksTotal,
      });
    }

    // Now actually perform the calculated trades.
    for (const [name, count] of objectEntries(tradesDone)) {
      // TODO: This check should be redundant. If no trades were possible,
      //       the entry shouldn't even exist.
      if (0 < count) {
        this.trade(name, count);
      }
    }
  }

  autoBuildEmbassies() {
    // Tries to calculate how many embassies for which races it can buy,
    // then it buys them. Code should be straight-forward.
    AutoEmbassy: if (this._host.gamePage.diplomacy.races[0].embassyPrices) {
      const culture = this._workshopManager.getResource("culture");
      let cultureVal = 0;
      const subTrigger = this._host.options.auto.trade.addition.buildEmbassies.subTrigger ?? 0;
      if (subTrigger <= culture.value / culture.maxValue) {
        const racePanels = this._host.gamePage.diplomacyTab.racePanels;
        cultureVal = this._workshopManager.getValueAvailable("culture", true);

        const embassyBulk: Partial<
          Record<
            Race,
            {
              val: number;
              basePrice: number;
              currentEm: number;
              priceSum: number;
              race: RaceInfo;
            }
          >
        > = {};
        const bulkTracker: Array<Race> = [];

        for (let panelIndex = 0; panelIndex < racePanels.length; panelIndex++) {
          if (!racePanels[panelIndex].embassyButton) {
            continue;
          }
          const name = racePanels[panelIndex].race.name;
          const race = this._host.gamePage.diplomacy.get(name);
          embassyBulk[name] = {
            val: 0,
            basePrice: race.embassyPrices[0].val,
            currentEm: race.embassyLevel,
            priceSum: 0,
            race: race,
          };
          bulkTracker.push(name);
        }

        if (bulkTracker.length === 0) {
          break AutoEmbassy;
        }

        let refreshRequired = false;

        while (bulkTracker.length > 0) {
          for (let raceIndex = 0; raceIndex < bulkTracker.length; raceIndex++) {
            const name = bulkTracker[raceIndex];
            const emBulk = mustExist(embassyBulk[name]);
            const nextPrice = emBulk.basePrice * Math.pow(1.15, emBulk.currentEm + emBulk.val);
            if (nextPrice <= cultureVal) {
              cultureVal -= nextPrice;
              emBulk.priceSum += nextPrice;
              emBulk.val += 1;
              refreshRequired = true;
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
          cultureVal = this._workshopManager.getValueAvailable("culture", true);
          if (cultureVal < emBulk.priceSum) {
            this._host.warning("Something has gone horribly wrong.", emBulk.priceSum, cultureVal);
          }
          this._host.gamePage.resPool.resources[13].value -= emBulk.priceSum;
          emBulk.race.embassyLevel += emBulk.val;
          this._host.storeForSummary("embassy", emBulk.val);
          if (emBulk.val !== 1) {
            this._host.iactivity("build.embassies", [emBulk.val, emBulk.race.title], "ks-trade");
          } else {
            this._host.iactivity("build.embassy", [emBulk.val, emBulk.race.title], "ks-trade");
          }
        }

        if (refreshRequired) {
          this._host.gamePage.ui.render();
        }
      }
    }
  }

  autoFeedElders() {
    const leviathanInfo = this._host.gamePage.diplomacy.get("leviathans");
    const necrocorns = this._host.gamePage.resPool.get("necrocorn");

    if (!leviathanInfo.unlocked || necrocorns.value === 0) {
      return;
    }

    if (1 <= necrocorns.value) {
      // If feeding the elders would increase their energy level towards the
      // cap, do it.
      if (leviathanInfo.energy < this._host.gamePage.diplomacy.getMarkerCap()) {
        this._host.gamePage.diplomacy.feedElders();
        this._host.iactivity("act.feed");
        this._host.storeForSummary("feed", 1);
      }
    } else {
      // We can reach this branch if we have partial necrocorns from resets.
      // The partial necrocorns will then be fead to the elders to bring us back
      // to even zero.
      if (0.25 * (1 + this._host.gamePage.getEffect("corruptionBoostRatio")) < 1) {
        this._host.storeForSummary("feed", necrocorns.value);
        this._host.gamePage.diplomacy.feedElders();
        this._host.iactivity("dispose.necrocorn");
      }
    }
  }

  autoUnlock() {
    if (!this._host.gamePage.tabs[4].visible) {
      return;
    }

    // Check how many races we could reasonably unlock at this point.
    const maxRaces = this._host.gamePage.diplomacy.get("leviathans").unlocked ? 8 : 7;
    // If we haven't unlocked that many races yet...
    if (this._host.gamePage.diplomacyTab.racePanels.length < maxRaces) {
      // Get the currently available catpower.
      let manpower = this._workshopManager.getValueAvailable("manpower", true);
      // TODO: These should be checked in reverse order. Otherwise the check for lizards
      //       can cause the zebras to be discovered at later stages in the game. Then it
      //       gets to the check for the zebras and doesn't explore again, as they're
      //       already unlocked. Then it takes another iteration to unlock the other race.
      // Send explorers if we haven't discovered the lizards yet.
      if (!this._host.gamePage.diplomacy.get("lizards").unlocked) {
        if (manpower >= 1000) {
          this._host.gamePage.resPool.get("manpower").value -= 1000;
          this._host.iactivity(
            "upgrade.race",
            [this._host.gamePage.diplomacy.unlockRandomRace().title],
            "ks-upgrade"
          );
          manpower -= 1000;
          this._host.gamePage.ui.render();
        }
      }

      // Do exactly the same for the sharks.
      if (!this._host.gamePage.diplomacy.get("sharks").unlocked) {
        if (manpower >= 1000) {
          this._host.gamePage.resPool.get("manpower").value -= 1000;
          this._host.iactivity(
            "upgrade.race",
            [this._host.gamePage.diplomacy.unlockRandomRace().title],
            "ks-upgrade"
          );
          manpower -= 1000;
          this._host.gamePage.ui.render();
        }
      }

      // Do exactly the same for the griffins.
      if (!this._host.gamePage.diplomacy.get("griffins").unlocked) {
        if (manpower >= 1000) {
          this._host.gamePage.resPool.get("manpower").value -= 1000;
          this._host.iactivity(
            "upgrade.race",
            [this._host.gamePage.diplomacy.unlockRandomRace().title],
            "ks-upgrade"
          );
          manpower -= 1000;
          this._host.gamePage.ui.render();
        }
      }

      // For nagas, we additionally need enough culture.
      if (
        !this._host.gamePage.diplomacy.get("nagas").unlocked &&
        this._host.gamePage.resPool.get("culture").value >= 1500
      ) {
        if (manpower >= 1000) {
          this._host.gamePage.resPool.get("manpower").value -= 1000;
          this._host.iactivity(
            "upgrade.race",
            [this._host.gamePage.diplomacy.unlockRandomRace().title],
            "ks-upgrade"
          );
          manpower -= 1000;
          this._host.gamePage.ui.render();
        }
      }

      // Zebras require us to have a ship.
      if (
        !this._host.gamePage.diplomacy.get("zebras").unlocked &&
        this._host.gamePage.resPool.get("ship").value >= 1
      ) {
        if (manpower >= 1000) {
          this._host.gamePage.resPool.get("manpower").value -= 1000;
          this._host.iactivity(
            "upgrade.race",
            [this._host.gamePage.diplomacy.unlockRandomRace().title],
            "ks-upgrade"
          );
          manpower -= 1000;
          this._host.gamePage.ui.render();
        }
      }

      // For spiders, we need 100 ships and 125000 science.
      if (
        !this._host.gamePage.diplomacy.get("spiders").unlocked &&
        mustExist(this._host.gamePage.resPool.get("ship")).value >= 100 &&
        mustExist(this._host.gamePage.resPool.get("science")).maxValue > 125000
      ) {
        if (manpower >= 1000) {
          mustExist(this._host.gamePage.resPool.get("manpower")).value -= 1000;
          this._host.iactivity(
            "upgrade.race",
            [this._host.gamePage.diplomacy.unlockRandomRace().title],
            "ks-upgrade"
          );
          manpower -= 1000;
          this._host.gamePage.ui.render();
        }
      }

      // Dragons require nuclear fission to be researched.
      if (
        !this._host.gamePage.diplomacy.get("dragons").unlocked &&
        this._host.gamePage.science.get("nuclearFission").researched
      ) {
        if (manpower >= 1000) {
          mustExist(this._host.gamePage.resPool.get("manpower")).value -= 1000;
          this._host.iactivity(
            "upgrade.race",
            [this._host.gamePage.diplomacy.unlockRandomRace().title],
            "ks-upgrade"
          );
          manpower -= 1000;
          this._host.gamePage.ui.render();
        }
      }
    }
  }

  /**
   * Trade with the given race.
   *
   * @param name The race to trade with.
   * @param amount How often to trade with the race.
   */
  trade(name: Race, amount: number): void {
    if (!name || 1 > amount) {
      this._host.warning(
        "KS trade checks are not functioning properly, please create an issue on the github page."
      );
    }

    const race = this.getRace(name);
    const button = this.getTradeButton(race.name);

    if (!button.model.enabled || !this._host.options.auto.trade.items[name].enabled) {
      this._host.warning(
        "KS trade checks are not functioning properly, please create an issue on the github page."
      );
    }

    this._host.gamePage.diplomacy.tradeMultiple(race, amount);
    this._host.storeForSummary(race.title, amount, "trade");
    this._host.iactivity("act.trade", [amount, ucfirst(race.title)], "ks-trade");
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
      const tick = this._workshopManager.getTickVal(this._workshopManager.getResource(mat));
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
      // We consider all resources to be equal in the profatibility calculation.
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
            Math.min(amount, Math.max(resource.maxValue - resource.value, 0)) / tick
          : // For uncapped resources, add all of it.
            amount / tick;
    }

    // If the profit is higher than the cost, consider this profitable.
    return cost <= profit;
  }

  /**
   * Determine which resources and how much of them a trade with the given race results in.
   *
   * @param race The race to check.
   * @returns The resources returned from an average trade and their amount.
   */
  getAverageTrade(race: RaceInfo): Partial<Record<Resource, number>> {
    // TODO: This is a lot of magic. It's possible some of it was copied directly from the game.
    const standingRatio =
      this._host.gamePage.getEffect("standingRatio") +
      this._host.gamePage.diplomacy.calculateStandingFromPolicies(race.name, this._host.gamePage);

    const raceRatio = 1 + race.energy * 0.02;

    const tradeRatio =
      1 +
      this._host.gamePage.diplomacy.getTradeRatio() +
      this._host.gamePage.diplomacy.calculateTradeBonusFromPolicies(race.name, this._host.gamePage);

    const failedRatio = race.standing < 0 ? race.standing + standingRatio : 0;
    const successRatio = 0 < failedRatio ? 1 + failedRatio : 1;
    const bonusRatio = 0 < race.standing ? Math.min(race.standing + standingRatio / 2, 1) : 0;

    const output: Partial<Record<Resource, number>> = {};
    for (const item of race.sells) {
      if (!this._isValidTrade(item, race)) {
        // Still put invalid trades into the result to not cause missing keys.
        output[item.name] = 0;
        continue;
      }

      let mean = 0;
      const tradeChance = race.embassyPrices
        ? item.chance * (1 + this._host.gamePage.getLimitedDR(0.01 * race.embassyLevel, 0.75))
        : item.chance;
      if (race.name === "zebras" && item.name === "titanium") {
        const shipCount = this._host.gamePage.resPool.get("ship").value;
        const titaniumProbability = Math.min(0.15 + shipCount * 0.0035, 1);
        const titaniumRatio = 1 + shipCount / 50;
        mean = 1.5 * titaniumRatio * (successRatio * titaniumProbability);
      } else {
        const seasionRatio = !item.seasons
          ? 1
          : 1 + item.seasons[this._host.gamePage.calendar.getCurSeason().name];
        const normBought = (successRatio - bonusRatio) * Math.min(tradeChance / 100, 1);
        const normBonus = bonusRatio * Math.min(tradeChance / 100, 1);
        mean = (normBought + 1.25 * normBonus) * item.value * raceRatio * seasionRatio * tradeRatio;
      }
      output[item.name] = mean;
    }

    const spiceChance = race.embassyPrices ? 0.35 * (1 + 0.01 * race.embassyLevel) : 0.35;
    const spiceTradeAmount = successRatio * Math.min(spiceChance, 1);
    output.spice = 25 * spiceTradeAmount + (50 * spiceTradeAmount * tradeRatio) / 2;
    output.blueprint = 0.1 * successRatio;

    return output;
  }

  /**
   * Determine if this trade is valid.
   *
   * @param item The tradeable item.
   * @param race The race to trade with.
   * @returns `true` if the trade is valid; `false` otherwise.
   */
  private _isValidTrade(item: TradeInfo, race: RaceInfo): boolean {
    return (
      // Do we have enough embassies to receive the item?
      !(item.minLevel && race.embassyLevel < item.minLevel) &&
      // TODO: These seem a bit too magical.
      (this._host.gamePage.resPool.get(item.name).unlocked ||
        item.name === "titanium" ||
        item.name === "uranium" ||
        race.name === "leviathans")
    );
  }

  /**
   * Determine how many trades are at least possible.
   *
   * @param name The race to trade with.
   * @param limited Is the race set to be limited.
   * @param trigConditions Ignored
   * @returns The lowest number of trades possible with this race.
   */
  getLowestTradeAmount(name: Race | null, limited: boolean, trigConditions: unknown): number {
    let amount: number | undefined = undefined;
    const materials = this.getMaterials(name);

    let total: number | undefined = undefined;
    for (const [resource, required] of objectEntries(materials)) {
      // If this resource is manpower, the amount of trades it allows is straight forward.
      if (resource === "manpower") {
        total = this._workshopManager.getValueAvailable(resource, true) / required;
      } else {
        // For other resources, use a different path to determine the available resource
        // amount.
        // TODO: It's unclear how this works
        total =
          this._workshopManager.getValueAvailable(
            resource,
            limited,
            this._host.options.auto.trade.trigger
          ) / required;
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

    // If no race was specified, or this is trading with leviathans, return the
    // currently known, lowest amount.
    // The special case for leviathans indicates that the following code is buggy or
    // problematic, as leviathans are the last race.
    if (name === null || name === "leviathans") {
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
      let max = 0;

      // No need to process resources that don't cap
      if (!resource.maxValue) {
        continue;
      }

      max = mustExist(tradeOutput[item.name]);

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

    amount = highestCapacity < amount ? Math.max(highestCapacity - 1, 1) : amount;

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
      manpower: 50 - this._host.gamePage.getEffect("tradeCatpowerDiscount"),
      gold: 15 - this._host.gamePage.getEffect("tradeGoldDiscount"),
    };

    if (isNil(race)) {
      return materials;
    }

    const prices = this.getRace(race).buys;

    for (const price of prices) {
      materials[price.name] = price.val;
    }

    return materials;
  }

  /**
   * Retrieve information about the given race from the game.
   *
   * @param name The race to get the information object for.
   * @returns The information object for the given race.
   */
  getRace(name: Race): RaceInfo {
    const raceInfo = this._host.gamePage.diplomacy.get(name);
    if (isNil(raceInfo)) {
      throw new Error(`Unable to retrieve race '${name}'`);
    }
    return raceInfo;
  }

  /**
   * Retrieve a reference to the trade button for the given race from the game.
   *
   * @param race The race to get the button reference for.
   * @returns The reference to the trade button.
   */
  getTradeButton(race: string): BuildButton {
    const panel = this.manager.tab.racePanels.find(subject => subject.race.name === race);
    if (isNil(panel)) {
      throw new Error(`Unable to find trade button for '${race}'`);
    }
    return panel.tradeBtn;
  }

  /**
   * Determine if at least a single trade can be made.
   *
   * @param name The race to trade with. If not specified, all races are checked.
   * @returns If the requested trade is possible.
   */
  singleTradePossible(name?: Race): boolean {
    // Get the materials required to trade with the race.
    const materials = this.getMaterials(name);
    for (const [resource, amount] of objectEntries<Resource, number>(materials)) {
      // Check if we have a sufficient amount of that resource in storage.
      if (this._workshopManager.getValueAvailable(resource, true) < amount) {
        return false;
      }
    }
    return true;
  }
}
