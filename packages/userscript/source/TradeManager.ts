import { CraftManager } from "./CraftManager";
import { TabManager } from "./TabManager";
import { objectEntries } from "./tools/Entries";
import { ucfirst } from "./tools/Format";
import { isNil, Maybe, mustExist } from "./tools/Maybe";
import { BuildButton, Race, RaceInfo, Resource, TradeInfo, TradingTab } from "./types";
import { UserScript } from "./UserScript";

export class TradeManager {
  private readonly _host: UserScript;
  readonly manager: TabManager<TradingTab>;
  private readonly _craftManager: CraftManager;

  constructor(host: UserScript) {
    this._host = host;
    this.manager = new TabManager(this._host, "Trade");
    this._craftManager = new CraftManager(this._host);
  }

  /**
   * Trade with the given race.
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
      const tick = this._craftManager.getTickVal(this._craftManager.getResource(mat));
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
      const resource = this._craftManager.getResource(prod);
      // ...determine how much of the resource is produced each tick.
      const tick = this._craftManager.getTickVal(resource);
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
        total = this._craftManager.getValueAvailable(resource, true) / required;
      } else {
        // For other resources, use a different path to determine the available resource
        // amount.
        // TODO: It's unclear how this works
        total =
          this._craftManager.getValueAvailable(
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
      const resource = this._craftManager.getResource(item.name);
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
   * @param name The race to trade with. If not specified, all races are checked.
   * @returns If the requested trade is possible.
   */
  singleTradePossible(name?: Race): boolean {
    // Get the materials required to trade with the race.
    const materials = this.getMaterials(name);
    for (const [resource, amount] of objectEntries<Resource, number>(materials)) {
      // Check if we have a sufficient amount of that resource in storage.
      if (this._craftManager.getValueAvailable(resource, true) < amount) {
        return false;
      }
    }
    return true;
  }
}
