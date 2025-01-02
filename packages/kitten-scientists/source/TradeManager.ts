import { Maybe, isNil, mustExist } from "@oliversalzburg/js-utils/data/nil.js";
import { Automation, Engine, FrameContext } from "./Engine.js";
import { KittenScientists } from "./KittenScientists.js";
import { TabManager } from "./TabManager.js";
import { WorkshopManager } from "./WorkshopManager.js";
import { MaterialsCache } from "./helper/MaterialsCache.js";
import { TradeSettings, TradeSettingsItem } from "./settings/TradeSettings.js";
import { objectEntries } from "./tools/Entries.js";
import { negativeOneToInfinity, ucfirst } from "./tools/Format.js";
import { cwarn } from "./tools/Log.js";
import { ResourceInfo } from "./types/craft.js";
import { BuildButton, Race, RaceInfo, Resource, TradeInfo, TradeTab } from "./types/index.js";

export class TradeManager implements Automation {
  private readonly _host: KittenScientists;
  readonly settings: TradeSettings;
  readonly manager: TabManager<TradeTab>;
  private readonly _workshopManager: WorkshopManager;

  constructor(
    host: KittenScientists,
    workshopManager: WorkshopManager,
    settings = new TradeSettings(),
  ) {
    this._host = host;
    this.settings = settings;
    this.manager = new TabManager(this._host, "Trade");
    this._workshopManager = workshopManager;
  }

  tick(context: FrameContext) {
    if (!this.settings.enabled) {
      return;
    }

    this.manager.render();

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

  autoTrade(cacheManager?: MaterialsCache) {
    const catpower = this._workshopManager.getResource("manpower");
    const gold = this._workshopManager.getResource("gold");
    const sectionTrigger = this.settings.trigger;

    // If we can't make any trades, bail out.
    if (!this.singleTradePossible(sectionTrigger, catpower, gold)) {
      return;
    }

    // The races we might want to trade with during this frame.
    const trades: Array<Race> = [];

    const season = this._host.game.calendar.getCurSeason().name;

    // Determine how many races we will trade with this cycle.
    for (const trade of Object.values(this.settings.races)) {
      const race = this.getRace(trade.race);

      // Check if the race is enabled, in season, unlocked, and we can actually afford it.
      if (
        !trade.enabled ||
        !trade.seasons[season].enabled ||
        !race.unlocked ||
        !this.singleTradePossible(sectionTrigger, catpower, gold, trade)
      ) {
        continue;
      }

      // Additionally, we now check if the trade button is enabled, which kinda makes all previous
      // checks moot, but whatever :D
      const button = this.getTradeButton(race.name);
      if (!button?.model?.enabled) {
        continue;
      }

      const trigger = Engine.evaluateSubSectionTrigger(sectionTrigger, trade.trigger);
      // Determine which resource the race requires for trading, if any.
      const require = trade.require ? this._workshopManager.getResource(trade.require) : false;

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
      const tradeSettings = this.settings.races[race];

      // Does this trade require a certain resource?
      const require = !tradeSettings.require
        ? false
        : this._workshopManager.getResource(tradeSettings.require);

      // Have the trigger conditions for this trade been met?
      const trigger = Engine.evaluateSubSectionTrigger(sectionTrigger, tradeSettings.trigger);
      const trigConditions =
        (!require || trigger <= require.value / require.maxValue) &&
        trigger <= gold.value / gold.maxValue;

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
        const tradeIndex = trades[randomRaceIndex];
        // Init the counter if necessary.
        if (isNil(tradesDone[tradeIndex])) {
          tradesDone[tradeIndex] = 0;
        }
        tradesDone[tradeIndex] += 1;
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
      const tradeIndex = trades[minTradeIndex];
      for (let tradeIndex = 0; tradeIndex < trades.length; ++tradeIndex) {
        if (maxByRace[tradeIndex] < minTrades) {
          minTrades = maxByRace[tradeIndex];
          minTradeIndex = tradeIndex;
        }
      }

      // Store this trade in the trades we've "done".
      if (isNil(tradesDone[tradeIndex])) {
        tradesDone[tradeIndex] = 0;
      }
      tradesDone[tradeIndex] += minTrades;
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
        tradeNet[mat] -= matAmount * amount;
      }

      const meanOutput = this.getAverageTrade(race);
      for (const [out, outValue] of objectEntries(meanOutput)) {
        const res = this._workshopManager.getResource(out);
        if (!tradeNet[out]) {
          tradeNet[out] = 0;
        }
        tradeNet[out] +=
          res.maxValue > 0
            ? Math.min(
                mustExist(meanOutput[out]) * mustExist(tradesDone[name]),
                Math.max(res.maxValue - res.value, 0),
              )
            : outValue * mustExist(tradesDone[name]);
      }
    }

    // Update the cache with the changes produced from the trades.
    if (!isNil(cacheManager)) {
      cacheManager.pushToCache({
        materials: tradeNet,
        timeStamp: this._host.game.timer.ticksTotal,
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

  autoBuildEmbassies(context: FrameContext) {
    if (!this._host.game.diplomacy.races[0].embassyPrices) {
      return;
    }

    // Tries to calculate how many embassies for which races it can buy,
    // then it buys them. Code should be straight-forward.

    const culture = this._workshopManager.getResource("culture");
    let cultureVal = 0;
    const trigger = this.settings.buildEmbassies.trigger;
    if (culture.value / culture.maxValue < trigger) {
      return;
    }

    const racePanels = this._host.game.diplomacyTab.racePanels;
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
      const race = this._host.game.diplomacy.get(name);
      const max = negativeOneToInfinity(this.settings.buildEmbassies.races[name].max);

      if (
        !this.settings.buildEmbassies.races[name].enabled ||
        max <= race.embassyLevel ||
        !race.unlocked
      ) {
        continue;
      }

      embassyBulk[name] = {
        val: 0,
        max,
        basePrice: mustExist(race.embassyPrices?.[0]).val,
        currentEm: race.embassyLevel,
        priceSum: 0,
        race: race,
      };
      bulkTracker.push(name);
    }

    if (bulkTracker.length === 0) {
      return;
    }

    while (bulkTracker.length > 0) {
      for (let raceIndex = 0; raceIndex < bulkTracker.length; raceIndex++) {
        const name = bulkTracker[raceIndex];
        const emBulk = mustExist(embassyBulk[name]);

        if (emBulk.max <= emBulk.currentEm + emBulk.val) {
          bulkTracker.splice(raceIndex, 1);
          --raceIndex;
          continue;
        }

        const nextPrice = emBulk.basePrice * Math.pow(1.15, emBulk.currentEm + emBulk.val);
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
        cwarn("Something has gone horribly wrong.", emBulk.priceSum, cultureVal);
      }
      // We don't want to invoke the embassy build action multiple times, as
      // that would cause lots of log messages.
      // Instead, we replicate the behavior of the game here and purchase in bulk.
      this._workshopManager.getResource("culture").value -= emBulk.priceSum;
      emBulk.race.embassyLevel += emBulk.val;

      this._host.engine.storeForSummary("embassy", emBulk.val);
      if (emBulk.val !== 1) {
        this._host.engine.iactivity("build.embassies", [emBulk.val, emBulk.race.title], "ks-build");
      } else {
        this._host.engine.iactivity("build.embassy", [emBulk.val, emBulk.race.title], "ks-build");
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
    const maxRaces = this._host.game.diplomacy.get("leviathans").unlocked ? 8 : 7;
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
          const unlockedRace = this._host.game.diplomacy.unlockRandomRace();
          this._host.engine.iactivity("upgrade.race", [unlockedRace.title], "ks-upgrade");
          manpower -= 1000;
          context.requestGameUiRefresh = true;
        }
      }

      // Do exactly the same for the sharks.
      if (!this._host.game.diplomacy.get("sharks").unlocked) {
        if (manpower >= 1000) {
          this._host.game.resPool.get("manpower").value -= 1000;
          const unlockedRace = this._host.game.diplomacy.unlockRandomRace();
          this._host.engine.iactivity("upgrade.race", [unlockedRace.title], "ks-upgrade");
          manpower -= 1000;
          context.requestGameUiRefresh = true;
        }
      }

      // Do exactly the same for the griffins.
      if (!this._host.game.diplomacy.get("griffins").unlocked) {
        if (manpower >= 1000) {
          this._host.game.resPool.get("manpower").value -= 1000;
          const unlockedRace = this._host.game.diplomacy.unlockRandomRace();
          this._host.engine.iactivity("upgrade.race", [unlockedRace.title], "ks-upgrade");
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
          const unlockedRace = this._host.game.diplomacy.unlockRandomRace();
          this._host.engine.iactivity("upgrade.race", [unlockedRace.title], "ks-upgrade");
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
          const unlockedRace = this._host.game.diplomacy.unlockRandomRace();
          this._host.engine.iactivity("upgrade.race", [unlockedRace.title], "ks-upgrade");
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
          const unlockedRace = this._host.game.diplomacy.unlockRandomRace();
          this._host.engine.iactivity("upgrade.race", [unlockedRace.title], "ks-upgrade");
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
          const unlockedRace = this._host.game.diplomacy.unlockRandomRace();
          this._host.engine.iactivity("upgrade.race", [unlockedRace.title], "ks-upgrade");
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
        this._host.game.getDisplayValueExt(coinsExchanged),
      ]);
    } else if (
      coinPrice > this.settings.tradeBlackcoin.sell &&
      0 < this._host.game.resPool.get("blackcoin").value
    ) {
      this._host.game.diplomacy.sellBcoin();

      const relicsCurrent = mustExist(this._host.game.resPool.get("relic")).value;
      relicsExchanged = Math.round(relicsCurrent - relicsInitial);

      this._host.engine.iactivity("act.blackcoin.sell", [
        this._host.game.getDisplayValueExt(relicsExchanged),
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
    const button = this.getTradeButton(race.name);

    if (!button?.model?.enabled || !this.settings.races[name].enabled) {
      cwarn(
        "KS trade checks are not functioning properly, please create an issue on the github page.",
      );
    }

    this._host.game.diplomacy.tradeMultiple(race, amount);
    this._host.engine.storeForSummary(race.title, amount, "trade");
    this._host.engine.iactivity("act.trade", [amount, ucfirst(race.title)], "ks-trade");
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
      this._host.game.getEffect("standingRatio") +
      this._host.game.diplomacy.calculateStandingFromPolicies(race.name, this._host.game);

    const raceRatio = 1 + race.energy * 0.02;

    const tradeRatio =
      1 +
      this._host.game.diplomacy.getTradeRatio() +
      this._host.game.diplomacy.calculateTradeBonusFromPolicies(race.name, this._host.game);

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
        ? item.chance * (1 + this._host.game.getLimitedDR(0.01 * race.embassyLevel, 0.75))
        : item.chance;
      if (race.name === "zebras" && item.name === "titanium") {
        const shipCount = this._host.game.resPool.get("ship").value;
        const titaniumProbability = Math.min(0.15 + shipCount * 0.0035, 1);
        const titaniumRatio = 1 + shipCount / 50;
        mean = 1.5 * titaniumRatio * (successRatio * titaniumProbability);
      } else {
        const seasionRatio = !item.seasons
          ? 1
          : 1 + item.seasons[this._host.game.calendar.getCurSeason().name];
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
      (this._host.game.resPool.get(item.name).unlocked ||
        item.name === "titanium" ||
        item.name === "uranium" ||
        race.name === "leviathans")
    );
  }

  /**
   * Determine how many trades are at least possible.
   *
   * @param name The race to trade with.
   * @param _limited Is the race set to be limited.
   * @param _trigConditions Ignored
   * @returns The lowest number of trades possible with this race.
   */
  getLowestTradeAmount(name: Race | null, _limited: boolean, _trigConditions: unknown): number {
    let amount: number | undefined = undefined;
    const materials = this.getMaterials(name);

    let total: number | undefined = undefined;
    for (const [resource, required] of objectEntries(materials)) {
      // If this resource is manpower, the amount of trades it allows is straight forward.
      if (resource === "manpower") {
        total = this._workshopManager.getValueAvailable(resource) / required;
      } else {
        // For other resources, use a different path to determine the available resource
        // amount.
        // TODO: It's unclear how this works
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
      manpower: 50 - this._host.game.getEffect("tradeCatpowerDiscount"),
      gold: 15 - this._host.game.getEffect("tradeGoldDiscount"),
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
    const raceInfo = this._host.game.diplomacy.get(name);
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
  getTradeButton(race: string): BuildButton | null {
    const panel = this.manager.tab.racePanels.find(subject => subject.race.name === race);
    return panel?.tradeBtn ?? null;
  }

  /**
   * Determine if at least a single trade can be made.
   *
   * @param trade - The trade option to check. If not specified, all races are checked.
   * @returns If the requested trade is possible.
   */
  singleTradePossible(
    sectionTrigger: number,
    catpower: ResourceInfo,
    gold: ResourceInfo,
    trade?: TradeSettingsItem,
  ): boolean {
    const trigger = trade
      ? Engine.evaluateSubSectionTrigger(sectionTrigger, trade.trigger)
      : sectionTrigger;

    // We should only trade if catpower and gold hit the trigger value.
    // Trades can additionally require specific resources. We will check for those later.
    if (catpower.value / catpower.maxValue < trigger || gold.value / gold.maxValue < trigger) {
      return false;
    }

    // Get the materials required to trade with the race.
    const materials = this.getMaterials(trade?.race);
    for (const [resource, amount] of objectEntries<Resource, number>(materials)) {
      // Check if we have a sufficient amount of that resource in storage.
      if (this._workshopManager.getValueAvailable(resource) < amount) {
        return false;
      }
    }
    return true;
  }
}
