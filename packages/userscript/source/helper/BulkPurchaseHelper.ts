import { BonfireItem } from "../settings/BonfireSettings";
import { AllItems, Requirement } from "../settings/Settings";
import { objectEntries } from "../tools/Entries";
import { isNil, mustExist } from "../tools/Maybe";
import {
  AllBuildings,
  BuildButton,
  Building,
  BuildingMeta,
  BuildingStackableBtnController,
  ButtonModernController,
  ButtonModernModel,
  ChronoForgeUpgradeInfo,
  Price,
  ReligionUpgradeInfo,
  Resource,
  SpaceBuildingInfo,
  TimeItemVariant,
  TranscendenceUpgradeInfo,
  UnicornItemVariant,
  UpgradeInfo,
  VoidSpaceUpgradeInfo,
  ZiggurathUpgradeInfo,
} from "../types";
import { UserScript } from "../UserScript";
import { WorkshopManager } from "../WorkshopManager";

export type BulkBuildListItem = {
  count: number;
  id: AllItems;
  label?: string;
  name?: AllBuildings;
  stage?: number;
  variant?: TimeItemVariant | UnicornItemVariant;
};

export class BulkPurchaseHelper {
  private readonly _host: UserScript;
  private readonly _workshopManager: WorkshopManager;

  constructor(host: UserScript, workshopManager: WorkshopManager) {
    this._host = host;
    this._workshopManager = workshopManager;
  }

  /**
   * Take a hash of potential builds and determine how many of them can be built.
   *
   * @param builds All potential builds.
   * @param metaData The metadata for the potential builds.
   * @param trigger The configured trigger threshold for these builds.
   * @param sourceTab The tab these builds originate from.
   * @returns All the possible builds.
   */
  bulk(
    builds: Partial<
      Record<
        AllItems,
        {
          enabled: boolean;
          label?: string;
          max?: number;
          baseBuilding?: Building;
          building?: AllBuildings | BonfireItem;
          require?: Requirement;
          stage?: number;
          variant?: TimeItemVariant | UnicornItemVariant;
        }
      >
    >,
    metaData: Partial<
      Record<
        AllItems,
        | BuildingMeta
        | ChronoForgeUpgradeInfo
        | ReligionUpgradeInfo
        | SpaceBuildingInfo
        | TranscendenceUpgradeInfo
        | VoidSpaceUpgradeInfo
        | ZiggurathUpgradeInfo
      >
    >,
    trigger: number,
    sourceTab?: "bonfire" | "space"
  ): Array<BulkBuildListItem> {
    const buildsPerformed: Array<BulkBuildListItem> = [];
    const potentialBuilds: Array<{
      id: AllItems;
      name?: AllBuildings;
      count: number;
      spot: number;
      prices: Array<Price>;
      priceRatio: number;
      source?: "bonfire" | "space";
      limit: number;
      val: number;
    }> = [];

    // How many builds are on the list.
    let counter = 0;

    for (const [name, build] of objectEntries(builds)) {
      const buildMetaData = mustExist(metaData[name]);
      // If the build is disabled, skip it.
      if (!build.enabled) {
        continue;
      }

      // tHidden is a flag that is manually set to exclude time buildings from the process.
      if ("tHidden" in buildMetaData && buildMetaData.tHidden === true) {
        continue;
      }
      // rHidden is a flag that is manually set to exclude religion buildings from the process.
      if ("rHidden" in buildMetaData && buildMetaData.rHidden === true) {
        continue;
      }
      // If the building isn't unlocked, skip it.
      if (buildMetaData.unlocked === false) {
        continue;
      }

      // If the max allowed buildings have already been built, there is no need to check them.
      if (!isNil(build.max) && -1 < build.max && build.max <= buildMetaData.val) {
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
        this._isStagedBuild(buildMetaData)
          ? buildMetaData.stages[buildMetaData.stage].prices
          : buildMetaData.prices
      );
      const priceRatio = this.getPriceRatio(buildMetaData, sourceTab);

      // Check if we can build this item.
      if (!this.singleBuildPossible(buildMetaData, prices, priceRatio, sourceTab)) {
        continue;
      }

      // Check the requirements for this build.
      const require = !build.require ? false : this._workshopManager.getResource(build.require);
      // Either if we don't require a resource, of the stock is filled to a percentage
      // greater than the trigger value.
      if (!require || trigger <= require.value / require.maxValue) {
        // If the build is for a stage that the building isn't currently at, skip it.
        if (
          this._isStagedBuild(buildMetaData) &&
          typeof build.stage !== "undefined" &&
          build.stage !== buildMetaData.stage
        ) {
          continue;
        }

        const itemPrices = [];

        // Get cost reduction modifier.
        // TODO: This seems to be a bug, it should be `build.name`, but only if it is set.
        const pricesDiscount = this._host.gamePage.getLimitedDR(
          // @ts-expect-error getEffect will return 0 for invalid effects. So this is safe either way.
          this._host.gamePage.getEffect(`${name}CostReduction` as const),
          1
        );
        const priceModifier = 1 - pricesDiscount;

        // Determine the actual prices for this building.
        for (const price of prices) {
          const resPriceDiscount = this._host.gamePage.getLimitedDR(
            this._host.gamePage.getEffect(`${price.name}CostReduction` as const),
            1
          );
          const resPriceModifier = 1 - resPriceDiscount;
          itemPrices.push({
            val: price.val * priceModifier * resPriceModifier,
            name: price.name,
          });
        }

        // Create an entry in the build list for this building.
        buildsPerformed.push({
          count: 0,
          id: name,
          label: build.label,
          name: (build.baseBuilding ?? build.building) as Building,
          stage: build.stage,
          variant: build.variant,
        });

        // Create an entry in the cache list for the bulk processing.
        potentialBuilds.push({
          id: name,
          name: (build.baseBuilding ?? build.building) as Building,
          count: 0,
          spot: counter,
          prices: itemPrices,
          priceRatio: priceRatio,
          source: sourceTab,
          limit: build.max || 0,
          val: buildMetaData.val,
        });

        counter++;
      }
    }

    if (potentialBuilds.length === 0) {
      return [];
    }

    // Create a copy of the currently available resources.
    const tempPool: Record<Resource, number> = {} as Record<Resource, number>;
    for (const res of this._host.gamePage.resPool.resources) {
      tempPool[res.name] = this._workshopManager.getValueAvailable(res.name, true);
    }

    for (const potentialBuild of potentialBuilds) {
      // The item in the builds cache, that we're currently processing.
      const buildCount = this._getPossibleBuildCount(potentialBuild, metaData, tempPool);
      potentialBuild.count = buildCount;

      const performedBuild = mustExist(
        buildsPerformed.find(build => build.id === potentialBuild.id)
      );
      performedBuild.count = potentialBuild.count;
    }

    return buildsPerformed;
  }

  /**
   * Calculate how many of a given build item build be built with the given resources.
   *
   * @param buildCacheItem The item to build.
   * @param buildCacheItem.id ?
   * @param buildCacheItem.name ?
   * @param buildCacheItem.count ?
   * @param buildCacheItem.spot ?
   * @param buildCacheItem.prices ?
   * @param buildCacheItem.priceRatio ?
   * @param buildCacheItem.source ?
   * @param buildCacheItem.limit ?
   * @param buildCacheItem.val ?
   * @param metaData The metadata for the potential builds.
   * @param resources The currently available resources.
   * @returns The number of items that could be built. If this is non-zero, the `resources` will have been adjusted
   * to reflect the number of builds made.
   */
  private _getPossibleBuildCount(
    buildCacheItem: {
      id: AllItems;
      name?: AllBuildings;
      count: number;
      spot: number;
      prices: Array<Price>;
      priceRatio: number;
      source?: "bonfire" | "space";
      limit: number;
      val: number;
    },
    metaData: Partial<
      Record<
        AllItems,
        | BuildingMeta
        | ChronoForgeUpgradeInfo
        | ReligionUpgradeInfo
        | SpaceBuildingInfo
        | TranscendenceUpgradeInfo
        | VoidSpaceUpgradeInfo
        | ZiggurathUpgradeInfo
      >
    >,
    resources: Record<Resource, number> = {} as Record<Resource, number>
  ) {
    // This variable makes no sense.
    // It _seems_ like it should indicate how many buildings of a specific build slot have been built.
    // But what it actually holds is how many builds have been performed.
    // It might be a "best effort" to try to predict how prices would develop if the builds were made.
    // Some testing suggests that this is a bug. If you start a fresh KG in dev mode and give all resources,
    // with all bonfire builds enabled in KS, not all resources will be spent.
    // I assume this is due to the fact that the script believes it has already built 30 libraries,
    // when it was only 30 catnip fields (and only catnip was spent).
    let unknown_k = 0;

    const tempPool = Object.assign({}, resources);

    // The KG metadata associated with the build.
    const buildMetaData = mustExist(metaData[buildCacheItem.id]);
    const prices = buildCacheItem.prices;
    const priceRatio = buildCacheItem.priceRatio;
    const source = buildCacheItem.source;
    let maxItemsBuilt = false;

    while (!maxItemsBuilt) {
      // Go through the prices for this build.
      for (let priceIndex = 0; priceIndex < prices.length; priceIndex++) {
        // Is this an oil cost for a build on the space tab?
        let spaceOil = false;
        // Is this a karma cost for building cryochambers?
        let cryoKarma = false;
        // The actual, discounted oil price for the build.
        let oilPrice = Infinity;
        // The actual, discounted karma price for the build.
        let karmaPrice = Infinity;

        // Determine the new state of the flags above.
        if (source && source === "space" && prices[priceIndex].name === "oil") {
          spaceOil = true;

          const oilReductionRatio = this._host.gamePage.getEffect("oilReductionRatio");
          oilPrice =
            prices[priceIndex].val *
            (1 - this._host.gamePage.getLimitedDR(oilReductionRatio, 0.75));
        } else if (buildCacheItem.id === "cryochambers" && prices[priceIndex].name === "karma") {
          cryoKarma = true;

          const burnedParagonRatio = this._host.gamePage.prestige.getBurnedParagonRatio();
          karmaPrice =
            prices[priceIndex].val *
            (1 - this._host.gamePage.getLimitedDR(0.01 * burnedParagonRatio, 1.0));
        }

        if (spaceOil) {
          maxItemsBuilt =
            tempPool["oil"] < oilPrice * Math.pow(1.05, unknown_k + buildMetaData.val);
        } else if (cryoKarma) {
          maxItemsBuilt =
            tempPool["karma"] < karmaPrice * Math.pow(priceRatio, unknown_k + buildMetaData.val);
        } else {
          maxItemsBuilt =
            tempPool[prices[priceIndex].name] <
            prices[priceIndex].val * Math.pow(priceRatio, unknown_k + buildMetaData.val);
        }

        // Check if any special builds have reached their reasonable limit of units to build.
        // In which case we update our temporary resources cache. Not sure why.
        if (
          maxItemsBuilt ||
          // Is this a non-stackable build?
          // Space missions and religion upgrades (before transcendence is unlocked)
          // are example of non-stackable builds.
          ("noStackable" in buildMetaData &&
            buildMetaData.noStackable &&
            unknown_k + buildMetaData.val >= 1) ||
          // Is this the resource retrieval build? This one is limited to 100 units.
          (buildCacheItem.id === "ressourceRetrieval" && unknown_k + buildMetaData.val >= 100) ||
          (buildCacheItem.id === "cryochambers" &&
            this._host.gamePage.bld.getBuildingExt("chronosphere").meta.val <=
              unknown_k + buildMetaData.val)
        ) {
          // Go through all prices that we have already checked.
          for (let priceIndex2 = 0; priceIndex2 < priceIndex; priceIndex2++) {
            // TODO: This seems to just be `spaceOil`.
            // TODO: A lot of this code seems to be a duplication from a few lines above.
            if (source && source === "space" && prices[priceIndex2].name === "oil") {
              const oilReductionRatio = this._host.gamePage.getEffect("oilReductionRatio");
              const oilPriceRefund =
                prices[priceIndex2].val *
                (1 - this._host.gamePage.getLimitedDR(oilReductionRatio, 0.75));

              tempPool["oil"] += oilPriceRefund * Math.pow(1.05, unknown_k + buildMetaData.val);

              // TODO: This seems to just be `cryoKarma`.
            } else if (
              buildCacheItem.id === "cryochambers" &&
              prices[priceIndex2].name === "karma"
            ) {
              const burnedParagonRatio = this._host.gamePage.prestige.getBurnedParagonRatio();
              const karmaPriceRefund =
                prices[priceIndex2].val *
                (1 - this._host.gamePage.getLimitedDR(0.01 * burnedParagonRatio, 1.0));

              tempPool["karma"] +=
                karmaPriceRefund * Math.pow(priceRatio, unknown_k + buildMetaData.val);
            } else {
              const refundVal =
                prices[priceIndex2].val * Math.pow(priceRatio, unknown_k + buildMetaData.val);
              tempPool[prices[priceIndex2].name] +=
                prices[priceIndex2].name === "void" ? Math.ceil(refundVal) : refundVal;
            }
          }

          // Is this a limited build? If so, don't build more than the limit.
          if (buildCacheItem.limit && buildCacheItem.limit !== -1) {
            buildCacheItem.count = Math.max(
              0,
              Math.min(buildCacheItem.count, buildCacheItem.limit - buildCacheItem.val)
            );
          }

          // As we have reached our reasonable limit for this build, store the count
          // and remove the build from the builds cache.
          Object.assign(resources, tempPool);
          return buildCacheItem.count;
        }

        // Deduct the cost of this price from the temporary resource cache.
        if (spaceOil) {
          tempPool["oil"] -= oilPrice * Math.pow(1.05, unknown_k + buildMetaData.val);
        } else if (cryoKarma) {
          tempPool["karma"] -= karmaPrice * Math.pow(priceRatio, unknown_k + buildMetaData.val);
        } else {
          const newPriceValue =
            prices[priceIndex].val * Math.pow(priceRatio, unknown_k + buildMetaData.val);
          tempPool[prices[priceIndex].name] -=
            prices[priceIndex].name === "void" ? Math.ceil(newPriceValue) : newPriceValue;
        }

        // Check the next price...
      }

      // We're starting to make sense of this variable, as we refactored out this method.
      ++unknown_k;
      ++buildCacheItem.count;
    }

    Object.assign(resources, tempPool);
    return buildCacheItem.count;
  }

  /**
   * Try to trigger the build for a given button.
   *
   * @param model The model associated with the button.
   * @param button The build button.
   * @param amount How many items to build.
   * @returns How many items were built.
   * @see `build`@`core.js`
   * @deprecated This should just call `build()` on the game page. I don't understand why it shouldn't.
   */
  construct(
    model: ButtonModernModel,
    button: BuildButton<string, ButtonModernModel, ButtonModernController>,
    amount: number
  ): number {
    // TODO: Replace this with a call to gamePage.build()
    const meta = model.metadata;
    let counter = 0;

    // For limited builds, only construct up to the max.
    const vsMeta = meta as VoidSpaceUpgradeInfo;
    if (!isNil(vsMeta.limitBuild) && vsMeta.limitBuild - vsMeta.val < amount) {
      amount = vsMeta.limitBuild - vsMeta.val;
    }

    if ((model.enabled && button.controller.hasResources(model)) || this._host.gamePage.devMode) {
      while (button.controller.hasResources(model) && amount > 0) {
        model.prices = button.controller.getPrices(model);
        button.controller.payPrice(model);
        (button.controller as BuildingStackableBtnController).incrementValue(model);
        counter++;
        amount--;
      }
      if (vsMeta.breakIronWill) {
        this._host.gamePage.ironWill = false;
      }
      if ((meta as UpgradeInfo).unlocks) {
        this._host.gamePage.unlock((meta as UpgradeInfo).unlocks);
      }
      if ((meta as VoidSpaceUpgradeInfo).upgrades) {
        this._host.gamePage.upgrade((meta as VoidSpaceUpgradeInfo).upgrades);
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return "stage" in data && "stages" in data && !isNil(data.stage) && !isNil(data.stages);
  }

  /**
   * Determing the price modifier for the given building.
   *
   * @param data The building metadata.
   * @param source The tab the building belongs to.
   * @returns The price modifier for this building.
   * @see `getPriceRatioWithAccessor`@`buildings.js`
   */
  getPriceRatio(
    data:
      | BuildingMeta
      | ChronoForgeUpgradeInfo
      | ReligionUpgradeInfo
      | SpaceBuildingInfo
      | TranscendenceUpgradeInfo
      | VoidSpaceUpgradeInfo
      | ZiggurathUpgradeInfo,
    source?: "bonfire" | "space"
  ): number {
    // If the building has stages, use the ratio for the current stage.
    const ratio =
      // TODO: This seems weird. Why not take the price ratio of the stage as the default?
      this._isStagedBuild(data)
        ? data.priceRatio || data.stages[data.stage].priceRatio
        : data.priceRatio ?? 0;

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
   *
   * @param build The build that should be checked.
   * @param build.name The name of the build.
   * @param build.val Probably how many items should be built in total.
   * TODO: Why is this relevant if we only care about a single build being possible?
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
    for (const price of prices) {
      const resourcePriceDiscount = this._host.gamePage.getLimitedDR(
        this._host.gamePage.getEffect(`${price.name}CostReduction` as const),
        1
      );
      const resourcePriceModifier = 1 - resourcePriceDiscount;
      const finalResourcePrice = price.val * priceModifier * resourcePriceModifier;

      // For space builds that consume oil, take the oil price reduction into account.
      // This is caused by space elevators.
      if (source && source === "space" && price.name === "oil") {
        const oilModifier = this._host.gamePage.getLimitedDR(
          this._host.gamePage.getEffect("oilReductionRatio"),
          0.75
        );
        const oilPrice = finalResourcePrice * (1 - oilModifier);
        if (
          this._workshopManager.getValueAvailable("oil", true) <
          oilPrice * Math.pow(1.05, build.val)
        ) {
          return false;
        }

        // For cryochambers, take burned paragon into account for the karma cost.
      } else if (build.name === "cryochambers" && price.name === "karma") {
        const karmaModifier = this._host.gamePage.getLimitedDR(
          0.01 * this._host.gamePage.prestige.getBurnedParagonRatio(),
          1.0
        );
        const karmaPrice = finalResourcePrice * (1 - karmaModifier);
        if (
          this._workshopManager.getValueAvailable("karma", true) <
          karmaPrice * Math.pow(priceRatio, build.val)
        ) {
          return false;
        }
      } else {
        if (
          this._workshopManager.getValueAvailable(price.name, true) <
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
