import { CraftManager } from "./CraftManager";
import { UserScript } from "./UserScript";

export class BulkManager {
  private readonly _host: UserScript;
  private readonly _craftManager: CraftManager;

  constructor(host: UserScript) {
    this._host = host;
    this._craftManager = new CraftManager(this._host);
  }

  bulk(builds: Array<unknown>, metaData: unknown, trigger: number, source: unknown): void {
    const bList = [];
    const countList = [];
    let counter = 0;
    for (const name in builds) {
      const build = builds[name];
      const data = metaData[name];
      if (!build.enabled) {
        continue;
      }
      if (data.tHidden === true) {
        continue;
      }
      if (data.rHidden === true) {
        continue;
      }
      if (data.rHidden === undefined && !data.unlocked) {
        continue;
      }
      if (
        name === "cryochambers" &&
        (this._host.gamePage.time.getVSU("usedCryochambers").val > 0 ||
          this._host.gamePage.bld.getBuildingExt("chronosphere").meta.val <= data.val)
      ) {
        continue;
      }
      if (name === "ressourceRetrieval" && data.val >= 100) {
        continue;
      }
      const prices = data.stages ? data.stages[data.stage].prices : data.prices;
      const priceRatio = this.getPriceRatio(data, source);
      if (!this.singleBuildPossible(data, prices, priceRatio, source)) {
        continue;
      }
      const require = !build.require ? false : this._craftManager.getResource(build.require);
      if (!require || trigger <= require.value / require.maxValue) {
        if (typeof build.stage !== "undefined" && build.stage !== data.stage) {
          continue;
        }
        bList.push(new Object());
        bList[counter].id = name;
        bList[counter].label = build.label;
        bList[counter].name = build.name;
        bList[counter].stage = build.stage;
        bList[counter].variant = build.variant;
        countList.push(new Object());
        countList[counter].id = name;
        countList[counter].name = build.name;
        countList[counter].count = 0;
        countList[counter].spot = counter;

        // countList[counter].prices = prices;
        countList[counter].prices = [];
        const pricesDiscount = this._host.gamePage.getLimitedDR(
          this._host.gamePage.getEffect(name + "CostReduction"),
          1
        );
        const priceModifier = 1 - pricesDiscount;
        for (const i in prices) {
          const resPriceDiscount = this._host.gamePage.getLimitedDR(
            this._host.gamePage.getEffect(prices[i].name + "CostReduction"),
            1
          );
          const resPriceModifier = 1 - resPriceDiscount;
          countList[counter].prices.push({
            val: prices[i].val * priceModifier * resPriceModifier,
            name: prices[i].name,
          });
        }

        countList[counter].priceRatio = priceRatio;
        countList[counter].source = source;
        countList[counter].limit = build.max || 0;
        countList[counter].val = data.val;
        counter++;
      }
    }

    if (countList.length === 0) {
      return;
    }

    const tempPool = new Object();
    for (const res in this._host.gamePage.resPool.resources) {
      tempPool[
        this._host.gamePage.resPool.resources[res].name
      ] = this._host.gamePage.resPool.resources[res].value;
    }
    for (const res in tempPool) {
      tempPool[res] = this._craftManager.getValueAvailable(res, true);
    }

    let k = 0;
    while (countList.length !== 0) {
      bulkLoop: for (let j = 0; j < countList.length; j++) {
        const build = countList[j];
        const data = metaData[build.id];
        const prices = build.prices;
        const priceRatio = build.priceRatio;
        var source = build.source;
        for (let p = 0; p < prices.length; p++) {
          let spaceOil = false;
          let cryoKarma = false;
          if (source && source === "space" && prices[p].name === "oil") {
            spaceOil = true;
            const oilPrice =
              prices[p].val *
              (1 -
                this._host.gamePage.getLimitedDR(
                  this._host.gamePage.getEffect("oilReductionRatio"),
                  0.75
                ));
          } else if (build.id === "cryochambers" && prices[p].name === "karma") {
            cryoKarma = true;
            const karmaPrice =
              prices[p].val *
              (1 -
                this._host.gamePage.getLimitedDR(
                  0.01 * this._host.gamePage.prestige.getBurnedParagonRatio(),
                  1.0
                ));
          }

          let nextPriceCheck;
          if (spaceOil) {
            nextPriceCheck = tempPool["oil"] < oilPrice * Math.pow(1.05, k + data.val);
          } else if (cryoKarma) {
            nextPriceCheck = tempPool["karma"] < karmaPrice * Math.pow(priceRatio, k + data.val);
          } else {
            nextPriceCheck =
              tempPool[prices[p].name] < prices[p].val * Math.pow(priceRatio, k + data.val);
          }
          if (
            nextPriceCheck ||
            (data.noStackable && k + data.val >= 1) ||
            (build.id === "ressourceRetrieval" && k + data.val >= 100) ||
            (build.id === "cryochambers" &&
              this._host.gamePage.bld.getBuildingExt("chronosphere").meta.val <= k + data.val)
          ) {
            for (let p2 = 0; p2 < p; p2++) {
              if (source && source === "space" && prices[p2].name === "oil") {
                const oilPriceRefund =
                  prices[p2].val *
                  (1 -
                    this._host.gamePage.getLimitedDR(
                      this._host.gamePage.getEffect("oilReductionRatio"),
                      0.75
                    ));
                tempPool["oil"] += oilPriceRefund * Math.pow(1.05, k + data.val);
              } else if (build.id === "cryochambers" && prices[p2].name === "karma") {
                const karmaPriceRefund =
                  prices[p2].val *
                  (1 -
                    this._host.gamePage.getLimitedDR(
                      0.01 * this._host.gamePage.prestige.getBurnedParagonRatio(),
                      1.0
                    ));
                tempPool["karma"] += karmaPriceRefund * Math.pow(priceRatio, k + data.val);
              } else {
                const refundVal = prices[p2].val * Math.pow(priceRatio, k + data.val);
                tempPool[prices[p2].name] +=
                  prices[p2].name === "void" ? Math.ceil(refundVal) : refundVal;
              }
            }
            if (build.limit && build.limit != -1) {
              build.count = Math.max(0, Math.min(build.count, build.limit - build.val));
            }
            bList[countList[j].spot].count = countList[j].count;
            countList.splice(j, 1);
            j--;
            continue bulkLoop;
          }
          if (spaceOil) {
            tempPool["oil"] -= oilPrice * Math.pow(1.05, k + data.val);
          } else if (cryoKarma) {
            tempPool["karma"] -= karmaPrice * Math.pow(priceRatio, k + data.val);
          } else {
            const pVal = prices[p].val * Math.pow(priceRatio, k + data.val);
            tempPool[prices[p].name] -= prices[p].name === "void" ? Math.ceil(pVal) : pVal;
          }
        }
        countList[j].count++;
      }
      k++;
    }
    return bList;
  }

  construct(model: { metadata: unknown }, button: unknown, amount: number): number {
    const meta = model.metadata;
    let counter = 0;
    if (typeof meta.limitBuild == "number" && meta.limitBuild - meta.val < amount) {
      amount = meta.limitBuild - meta.val;
    }
    if ((model.enabled && button.controller.hasResources(model)) || this._host.gamePage.devMode) {
      while (button.controller.hasResources(model) && amount > 0) {
        model.prices = button.controller.getPrices(model);
        button.controller.payPrice(model);
        button.controller.incrementValue(model);
        counter++;
        amount--;
      }
      if (meta.breakIronWill) {
        this._host.gamePage.ironWill = false;
      }
      if (meta.unlocks) {
        this._host.gamePage.unlock(meta.unlocks);
      }
      if (meta.upgrades) {
        this._host.gamePage.upgrade(meta.upgrades);
      }
    }
    return counter;
  }

  getPriceRatio(data: unknown, source: unknown): number {
    const ratio = !data.stages
      ? data.priceRatio
      : data.priceRatio || data.stages[data.stage].priceRatio;

    let ratioDiff = 0;
    if (source && source === "bonfire") {
      ratioDiff =
        this._host.gamePage.getEffect(data.name + "PriceRatio") +
        this._host.gamePage.getEffect("priceRatio") +
        this._host.gamePage.getEffect("mapPriceReduction");

      ratioDiff = this._host.gamePage.getLimitedDR(ratioDiff, ratio - 1);
    }
    return ratio + ratioDiff;
  }

  singleBuildPossible(
    data: unknown,
    prices: Array<unknown>,
    priceRatio: number,
    source: unknown
  ): boolean {
    const pricesDiscount = this._host.gamePage.getLimitedDR(
      this._host.gamePage.getEffect(data.name + "CostReduction"),
      1
    );
    const priceModifier = 1 - pricesDiscount;
    for (const price in prices) {
      const resPriceDiscount = this._host.gamePage.getLimitedDR(
        this._host.gamePage.getEffect(prices[price].name + "CostReduction"),
        1
      );
      const resPriceModifier = 1 - resPriceDiscount;
      const rightPrice = prices[price].val * priceModifier * resPriceModifier;
      if (source && source === "space" && prices[price].name === "oil") {
        const oilPrice =
          rightPrice *
          (1 -
            this._host.gamePage.getLimitedDR(
              this._host.gamePage.getEffect("oilReductionRatio"),
              0.75
            ));
        if (
          this._craftManager.getValueAvailable("oil", true) <
          oilPrice * Math.pow(1.05, data.val)
        ) {
          return false;
        }
      } else if (data.name === "cryochambers" && prices[price].name === "karma") {
        const karmaPrice =
          rightPrice *
          (1 -
            this._host.gamePage.getLimitedDR(
              0.01 * this._host.gamePage.prestige.getBurnedParagonRatio(),
              1.0
            ));
        if (
          this._craftManager.getValueAvailable("karma", true) <
          karmaPrice * Math.pow(priceRatio, data.val)
        ) {
          return false;
        }
      } else {
        if (
          this._craftManager.getValueAvailable(prices[price].name, true) <
          rightPrice * Math.pow(priceRatio, data.val)
        ) {
          return false;
        }
      }
    }
    return true;
  }
}
