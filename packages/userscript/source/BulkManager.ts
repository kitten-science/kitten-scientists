import { CraftManager } from "./CraftManager";
import { Requirement } from "./options/OptionsLegacy";
import { objectEntries } from "./tools/Entries";
import { mustExist } from "./tools/Maybe";
import { AllBuildableItems, BuildButton, BuildingMeta, Price, Resource } from "./types";
import { UserScript } from "./UserScript";

export type BulkBuildListItem = {
  count: number;
  id: AllBuildableItems;
  label?: string;
  name?: AllBuildableItems;
  stage?: number;
  variant?: unknown;
};

export class BulkManager {
  private readonly _host: UserScript;
  private readonly _craftManager: CraftManager;

  constructor(host: UserScript) {
    this._host = host;
    this._craftManager = new CraftManager(this._host);
  }

  bulk(
    builds: Partial<
      Record<
        AllBuildableItems,
        {
          enabled: boolean;
          label?: string;
          max: number;
          name?: string;
          require?: Requirement;
          stage?: number;
          variant?: unknown;
        }
      >
    >,
    metaData: Partial<Record<AllBuildableItems, BuildingMeta>>,
    trigger: number,
    source?: "bonfire" | "space"
  ): Array<BulkBuildListItem> {
    const bList: Array<BulkBuildListItem> = [];
    const countList = [];
    let counter = 0;
    for (const [name, build] of objectEntries(builds)) {
      const data = mustExist(metaData[name]);
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
        (mustExist(this._host.gamePage.time.getVSU("usedCryochambers")).val > 0 ||
          this._host.gamePage.bld.getBuildingExt("chronosphere").meta.val <= data.val)
      ) {
        continue;
      }
      if (name === "ressourceRetrieval" && data.val >= 100) {
        continue;
      }
      const prices = mustExist(
        typeof data.stages !== "undefined" ? data.stages[mustExist(data.stage)].prices : data.prices
      );
      const priceRatio = this.getPriceRatio(data, source);
      if (!this.singleBuildPossible(data, prices, priceRatio, source)) {
        continue;
      }
      const require = !build.require ? false : this._craftManager.getResource(build.require);
      if (!require || trigger <= require.value / require.maxValue) {
        if (typeof build.stage !== "undefined" && build.stage !== data.stage) {
          continue;
        }
        bList.push({
          count: 0,
          id: name,
          label: build.label,
          name: build.name,
          stage: build.stage,
          variant: build.variant,
        });

        const itemPrices = [];
        const pricesDiscount = this._host.gamePage.getLimitedDR(
          this._host.gamePage.getEffect(`${name}CostReduction` as const),
          1
        );
        const priceModifier = 1 - pricesDiscount;
        for (const i in prices) {
          const resPriceDiscount = this._host.gamePage.getLimitedDR(
            this._host.gamePage.getEffect(`${prices[i].name}CostReduction` as const),
            1
          );
          const resPriceModifier = 1 - resPriceDiscount;
          itemPrices.push({
            val: prices[i].val * priceModifier * resPriceModifier,
            name: prices[i].name,
          });
        }

        countList.push({
          id: name,
          name: build.name,
          count: 0,
          spot: counter,
          prices: itemPrices,
          priceRatio: priceRatio,
          source: source,
          limit: build.max || 0,
          val: data.val,
        });

        counter++;
      }
    }

    if (countList.length === 0) {
      return [];
    }

    const tempPool: Partial<Record<Resource, number>> = {};
    for (const res of this._host.gamePage.resPool.resources) {
      tempPool[res.name] = res.value;
    }
    for (const [res, resource] of objectEntries(tempPool)) {
      tempPool[res] = this._craftManager.getValueAvailable(res, true);
    }

    let k = 0;
    while (countList.length !== 0) {
      bulkLoop: for (let j = 0; j < countList.length; j++) {
        const build = countList[j];
        const data = mustExist(metaData[build.id]);
        const prices = build.prices;
        const priceRatio = build.priceRatio;
        const source = build.source;

        for (let p = 0; p < prices.length; p++) {
          let spaceOil = false;
          let cryoKarma = false;
          let karmaPrice = Infinity;
          let oilPrice = Infinity;
          if (source && source === "space" && prices[p].name === "oil") {
            spaceOil = true;
            oilPrice =
              prices[p].val *
              (1 -
                this._host.gamePage.getLimitedDR(
                  this._host.gamePage.getEffect("oilReductionRatio"),
                  0.75
                ));
          } else if (build.id === "cryochambers" && prices[p].name === "karma") {
            cryoKarma = true;
            karmaPrice =
              prices[p].val *
              (1 -
                this._host.gamePage.getLimitedDR(
                  0.01 * this._host.gamePage.prestige.getBurnedParagonRatio(),
                  1.0
                ));
          }

          let nextPriceCheck;
          if (spaceOil) {
            nextPriceCheck = mustExist(tempPool["oil"]) < oilPrice * Math.pow(1.05, k + data.val);
          } else if (cryoKarma) {
            nextPriceCheck =
              mustExist(tempPool["karma"]) < karmaPrice * Math.pow(priceRatio, k + data.val);
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
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                tempPool["oil"]! += oilPriceRefund * Math.pow(1.05, k + data.val);
              } else if (build.id === "cryochambers" && prices[p2].name === "karma") {
                const karmaPriceRefund =
                  prices[p2].val *
                  (1 -
                    this._host.gamePage.getLimitedDR(
                      0.01 * this._host.gamePage.prestige.getBurnedParagonRatio(),
                      1.0
                    ));
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                tempPool["karma"]! += karmaPriceRefund * Math.pow(priceRatio, k + data.val);
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
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            tempPool["oil"]! -= oilPrice * Math.pow(1.05, k + data.val);
          } else if (cryoKarma) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            tempPool["karma"]! -= karmaPrice * Math.pow(priceRatio, k + data.val);
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

  construct(model: BuildButton["model"], button: BuildButton, amount: number): number {
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

  getPriceRatio(data: BuildingMeta, source?: "bonfire" | "space"): number {
    const ratio = !data.stages
      ? data.priceRatio
      : data.priceRatio || data.stages[mustExist(data.stage)].priceRatio;

    let ratioDiff = 0;
    if (source && source === "bonfire") {
      ratioDiff =
        this._host.gamePage.getEffect(`${data.name}PriceRatio` as const) +
        this._host.gamePage.getEffect("priceRatio") +
        this._host.gamePage.getEffect("mapPriceReduction");

      ratioDiff = this._host.gamePage.getLimitedDR(ratioDiff, ratio - 1);
    }
    return ratio + ratioDiff;
  }

  singleBuildPossible(
    data: { name: string; val: number },
    prices: Array<Price>,
    priceRatio: number,
    source?: "bonfire" | "space"
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
