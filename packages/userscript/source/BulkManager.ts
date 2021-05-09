import { CraftManager } from "./CraftManager";
import { AllItems, Requirement } from "./options/Options";
import { objectEntries } from "./tools/Entries";
import { isNil, mustExist } from "./tools/Maybe";
import {
  AllBuildings,
  BuildButton,
  BuildingMeta,
  Price,
  ReligionUpgradeInfo,
  Resource,
  TranscendenceUpgradeInfo,
  ZiggurathUpgradeInfo,
} from "./types";
import { UserScript } from "./UserScript";

export type BulkBuildListItem = {
  count: number;
  id: AllItems;
  label?: string;
  name?: AllItems;
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

  /**
   * Take a hash of potential builds and build as many of them as possible.
   * @param builds All potential builds.
   * @param metaData The metadata for the potential builds.
   * @param trigger The configured trigger threshold for these builds.
   * @param source The tab these builds originate from.
   * @returns Not sure.
   */
  bulk(
    builds: Partial<
      Record<
        AllItems,
        {
          enabled: boolean;
          label?: string;
          max?: number;
          name?: AllBuildings;
          require?: Requirement;
          stage?: number;
          variant?: unknown;
        }
      >
    >,
    metaData: Partial<
      Record<
        AllItems,
        BuildingMeta | ReligionUpgradeInfo | TranscendenceUpgradeInfo | ZiggurathUpgradeInfo
      >
    >,
    trigger: number,
    source?: "bonfire" | "space"
  ): Array<BulkBuildListItem> {
    const bList: Array<BulkBuildListItem> = [];
    const countList = [];
    let counter = 0;
    for (const [name, build] of objectEntries(builds)) {
      const buildMetaData = mustExist(metaData[name]);
      // If the build is disabled, skip it.
      if (!build.enabled) {
        continue;
      }

      // It's unclear what these are.
      if (buildMetaData.tHidden === true) {
        continue;
      }
      if (buildMetaData.rHidden === true) {
        continue;
      }
      if (buildMetaData.rHidden === undefined && !buildMetaData.unlocked) {
        continue;
      }

      // For cryochambers, if there are used cryochambers, don't build new ones.
      // Also, don't build more cryochambers than you have chronospheres, as they'll stay unused.
      if (
        name === "cryochambers" &&
        (mustExist(this._host.gamePage.time.getVSU("usedCryochambers")).val > 0 ||
          this._host.gamePage.bld.getBuildingExt("chronosphere").meta.val <= buildMetaData.val)
      ) {
        continue;
      }

      // TODO: This should be generalized to match all builds that have a `limitBuild` property.
      if (name === "ressourceRetrieval" && buildMetaData.val >= 100) {
        continue;
      }

      // Get the prices and the price ratio of this build.
      const prices = mustExist(
        this._isStagedBuild(buildMetaData) ? buildMetaData.stages[buildMetaData.stage].prices : buildMetaData.prices
      );
      const priceRatio = this.getPriceRatio(buildMetaData, source);

      // Check if we can build this item.
      if (!this.singleBuildPossible(buildMetaData, prices, priceRatio, source)) {
        continue;
      }

      // Check the requirements for this build.
      const require = !build.require ? false : this._craftManager.getResource(build.require);
      if (!require || trigger <= require.value / require.maxValue) {
        if (typeof build.stage !== "undefined" && build.stage !== buildMetaData.stage) {
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
          val: buildMetaData.val,
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

  /**
   * Try to trigger the build for a given button.
   * @param model The model associated with the button.
   * @param button The build button.
   * @param amount How many items to build.
   * @returns How many items were built.
   * @see `build`@`core.js`
   * @deprecated This should just call `build()` on the game page. I don't understand why it shouldn't.
   */
  construct(model: BuildButton["model"], button: BuildButton, amount: number): number {
    // TODO: Replace this with a call to gamePage.build()
    const meta = model.metadata;
    let counter = 0;

    // For limited builds, only construct up to the max.
    if (!isNil(meta.limitBuild) && meta.limitBuild - meta.val < amount) {
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

  private _isStagedBuild(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any
  ): data is {
    stage: number;
    stages: Array<{
      priceRatio: number;
      prices?: Array<Price>;
    }>;
  } {
    return "stage" in data && "stages" in data && !isNil(data.stage) && !isNil(data.stages);
  }

  /**
   * Determing the price modifier for the given building.
   * @param data The building metadata.
   * @param source The tab the building belongs to.
   * @returns The price modifier for this building.
   * @see `getPriceRatioWithAccessor`@`buildings.js`
   */
  getPriceRatio(
    data: BuildingMeta | ReligionUpgradeInfo | TranscendenceUpgradeInfo | ZiggurathUpgradeInfo,
    source?: "bonfire" | "space"
  ): number {
    // If the building has stages, use the ratio for the current stage.
    const ratio = mustExist(
      // TODO: This seems weird. Why not take the price ratio of the stage as the default?
      this._isStagedBuild(data)
        ? data.priceRatio || data.stages[data.stage].priceRatio
        : data.priceRatio
    );

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

  /**
   * Check if a given build could be performed.
   * @param build The build that should be checked.
   * @param prices The current prices for the build.
   * @param priceRatio The global price ratio modifier.
   * @param source What tab did the build originate from?
   * @returns `true` if the build is possible; `false` otherwise.
   */
  singleBuildPossible(
    build: { name: AllBuildings; val: number },
    prices: Array<Price>,
    priceRatio: number,
    source?: "bonfire" | "space"
  ): boolean {
    // Determine price reduction on this build.
    const pricesDiscount = this._host.gamePage.getLimitedDR(
      this._host.gamePage.getEffect(`${build.name}CostReduction` as const),
      1
    );
    const priceModifier = 1 - pricesDiscount;

    // Check if we can't afford any of the prices for this build.
    // Return `false` if we can't afford something, otherwise `true` is
    // returned by default.
    for (const price in prices) {
      const resourcePriceDiscount = this._host.gamePage.getLimitedDR(
        this._host.gamePage.getEffect(`${prices[price].name}CostReduction` as const),
        1
      );
      const resourcePriceModifier = 1 - resourcePriceDiscount;
      const finalResourcePrice = prices[price].val * priceModifier * resourcePriceModifier;

      // For space builds that consume oil, take the oil price reduction into account.
      // This is caused by space elevators.
      if (source && source === "space" && prices[price].name === "oil") {
        const oilModifier = this._host.gamePage.getLimitedDR(
          this._host.gamePage.getEffect("oilReductionRatio"),
          0.75
        );
        const oilPrice = finalResourcePrice * (1 - oilModifier);
        if (
          this._craftManager.getValueAvailable("oil", true) <
          oilPrice * Math.pow(1.05, build.val)
        ) {
          return false;
        }

        // For cryochambers, take burned paragon into account for the karma cost.
      } else if (build.name === "cryochambers" && prices[price].name === "karma") {
        const karmaModifier = this._host.gamePage.getLimitedDR(
          0.01 * this._host.gamePage.prestige.getBurnedParagonRatio(),
          1.0
        );
        const karmaPrice = finalResourcePrice * (1 - karmaModifier);
        if (
          this._craftManager.getValueAvailable("karma", true) <
          karmaPrice * Math.pow(priceRatio, build.val)
        ) {
          return false;
        }
      } else {
        if (
          this._craftManager.getValueAvailable(prices[price].name, true) <
          finalResourcePrice * Math.pow(priceRatio, build.val)
        ) {
          return false;
        }
      }
    }

    // We can afford this build.
    return true;
  }
}
