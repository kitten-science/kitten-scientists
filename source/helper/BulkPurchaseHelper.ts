import { difference } from "@oliversalzburg/js-utils/data/array.js";
import { isNil, mustExist } from "@oliversalzburg/js-utils/data/nil.js";
import { Engine } from "../Engine.js";
import type { KittenScientists } from "../KittenScientists.js";
import type { BonfireItem } from "../settings/BonfireSettings.js";
import { objectEntries } from "../tools/Entries.js";
import { negativeOneToInfinity } from "../tools/Format.js";
import { cl } from "../tools/Log.js";
import type {
  UnsafeBuilding,
  UnsafeStagingBldButtonOptions,
  UnsafeUnstagedBuildingButtonOptions,
} from "../types/buildings.js";
import type {
  BuildingStackableBtnController,
  UnsafeBuildingBtnModernModel,
  UnsafeBuildingStackableBtnModel,
} from "../types/core.js";
import type {
  AllBuildings,
  Building,
  Price,
  Resource,
  TabId,
  TimeItemVariant,
  UnicornItemVariant,
  Unlocks,
} from "../types/index.js";
import type {
  UnsafeReligionBtnModel,
  UnsafeReligionButtonOptions,
  UnsafeReligionUpgrade,
  UnsafeTranscendenceBtnModel,
  UnsafeTranscendenceButtonOptions,
  UnsafeTranscendenceUpgrade,
  UnsafeZigguratBtnModel,
  UnsafeZigguratButtonOptions,
  UnsafeZigguratUpgrade,
} from "../types/religion.js";
import type {
  UnsafePlanetBuildingButtonOptions,
  UnsafeSpaceBuilding,
  UnsafeSpaceProgramButtonOptions,
} from "../types/space.js";
import type {
  UnsafeChronoForgeUpgrade,
  UnsafeChronoforgeUpgradeButtonOptions,
  UnsafeVoidSpaceUpgrade,
  UnsafeVoidSpaceUpgradeButtonOptions,
} from "../types/time.js";
import type { WorkshopManager } from "../WorkshopManager.js";

export type BulkBuildListItem = {
  count: number;
  id: AllBuildings;
  label?: string;
  name?: AllBuildings;
  stage?: number;
  variant?: TimeItemVariant | UnicornItemVariant;
};

type BuildRequest = {
  id: AllBuildings;
  prices: Array<Price>;
  priceRatio: number;
  source: TabId;
  limit: number;
  val: number;
};

type PotentialBuild = {
  id: AllBuildings;
  label?: string;
  name?: AllBuildings;
  spot: number;
  count: number;
  prices: Array<Price>;
  priceRatio: number;
  source: TabId;
  limit: number;
  val: number;
  variant?: TimeItemVariant | UnicornItemVariant;
};

export class BulkPurchaseHelper {
  private readonly _host: KittenScientists;
  private readonly _workshopManager: WorkshopManager;

  constructor(host: KittenScientists, workshopManager: WorkshopManager) {
    this._host = host;
    this._workshopManager = workshopManager;
  }

  /**
   * Take a hash of potential builds and determine how many of them can be built.
   *
   * @param builds - All potential builds.
   * @param metaData - The metadata for the potential builds.
   * @param sectionTrigger - The configured trigger threshold for the section of these builds.
   * @param sourceTab - The tab these builds originate from.
   * @returns All the possible builds.
   */
  bulk(
    builds: Partial<
      Record<
        AllBuildings,
        {
          enabled: boolean;
          label?: string;
          max?: number;
          baseBuilding?: Building;
          building?: AllBuildings | BonfireItem;
          stage?: number;
          trigger: number;
          variant?: TimeItemVariant | UnicornItemVariant;
        }
      >
    >,
    metaData: Partial<
      Record<
        AllBuildings,
        Required<
          | UnsafeBuilding
          | UnsafeChronoForgeUpgrade
          | UnsafeReligionUpgrade
          | UnsafeSpaceBuilding
          | UnsafeTranscendenceUpgrade
          | UnsafeVoidSpaceUpgrade
          | UnsafeZigguratUpgrade
        >
      >
    >,
    sectionTrigger: number,
    sourceTab: TabId,
  ): Array<BulkBuildListItem> {
    const potentialBuilds: Array<PotentialBuild> = [];

    // How many builds are on the list.
    let counter = 0;

    for (const [name, build] of objectEntries(builds)) {
      const trigger = Engine.evaluateSubSectionTrigger(sectionTrigger, build.trigger);
      const buildMetaData = mustExist(metaData[name]);

      // If the build is disabled, skip it.
      if (!build.enabled || trigger < 0) {
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
        (mustExist(this._host.game.time.getVSU("usedCryochambers")).val > 0 ||
          this._host.game.bld.getBuildingExt("chronosphere").meta.val <= buildMetaData.val)
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
          : buildMetaData.prices,
      );
      const priceRatio = this.getPriceRatio(buildMetaData, sourceTab);

      // Check if we can build this item.
      if (!this.singleBuildPossible(buildMetaData, prices, priceRatio, sourceTab)) {
        continue;
      }

      // Check the requirements for this build.
      // We want a list of all resources that are required for this build, which have a capacity.
      const requiredMaterials = prices
        .map(price => this._workshopManager.getResource(price.name))
        .filter(material => 0 < material.maxValue);
      const allMaterialsAboveTrigger =
        requiredMaterials.filter(material => material.value / material.maxValue < trigger)
          .length === 0;

      if (allMaterialsAboveTrigger) {
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
        const pricesDiscount = this._host.game.getLimitedDR(
          this._host.game.getEffect(`${name}CostReduction` as const),
          1,
        );
        const priceModifier = 1 - pricesDiscount;

        // Determine the actual prices for this building.
        for (const price of prices) {
          const resPriceDiscount = this._host.game.getLimitedDR(
            this._host.game.getEffect(`${price.name}CostReduction` as const),
            1,
          );
          const resPriceModifier = 1 - resPriceDiscount;
          itemPrices.push({
            name: price.name,
            val: price.val * priceModifier * resPriceModifier,
          });
        }

        // Create an entry in the cache list for the bulk processing.
        potentialBuilds.push({
          count: 0,
          id: name,
          label: build.label,
          limit: build.max || 0,
          name: (build.baseBuilding ?? build.building) as Building,
          priceRatio: priceRatio,
          prices: itemPrices,
          source: sourceTab,
          spot: counter,
          val: buildMetaData.val,
          variant: build.variant,
        });

        counter++;
      }
    }

    if (potentialBuilds.length === 0) {
      return [];
    }

    // Create a copy of the currently available resources.
    // We need a copy, because `_getPossibleBuildCount` modifies this data.
    const currentResourcePool: Record<Resource, number> = {} as Record<Resource, number>;
    for (const res of this._host.game.resPool.resources) {
      currentResourcePool[res.name] = this._workshopManager.getValueAvailable(res.name);
    }

    let iterations = 0;
    const buildsCommitted = new Array<PotentialBuild>();
    while (iterations < 1e5) {
      const candidatesThisIteration = difference(potentialBuilds, buildsCommitted);

      let buildThisIteration = 0;
      const committedThisIteration = [];
      let tempPool = { ...currentResourcePool };
      // Pay already committed builds from the temp pool.
      for (const committedBuild of buildsCommitted) {
        const possibleInstances = this._precalculateBuilds(
          {
            ...committedBuild,
            limit: committedBuild.val + committedBuild.count,
          },
          metaData,
          tempPool,
        );
        tempPool = possibleInstances.remainingResources;
      }

      // Now see what we can do with the rest of the pool.
      for (const potentialBuild of candidatesThisIteration) {
        const targetInstanceCount = potentialBuild.count + 1;
        const possibleInstances = this._precalculateBuilds(
          {
            ...potentialBuild,
            limit: Math.min(
              negativeOneToInfinity(potentialBuild.limit),
              potentialBuild.val + targetInstanceCount,
            ),
          },
          metaData,
          tempPool,
        );

        if (possibleInstances.count < targetInstanceCount) {
          committedThisIteration.push(potentialBuild);
          continue;
        }

        potentialBuild.count = targetInstanceCount;
        tempPool = possibleInstances.remainingResources;

        buildThisIteration++;
      }

      buildsCommitted.push(...committedThisIteration);

      iterations++;

      if (buildThisIteration === 0) {
        break;
      }
    }

    console.debug(...cl(`Took '${iterations}' iterations to evaluate bulk build request.`));

    return buildsCommitted;
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
  private _precalculateBuilds(
    buildCacheItem: BuildRequest,
    metaData: Partial<
      Record<
        AllBuildings,
        Required<
          | UnsafeBuilding
          | UnsafeChronoForgeUpgrade
          | UnsafeReligionUpgrade
          | UnsafeSpaceBuilding
          | UnsafeTranscendenceUpgrade
          | UnsafeVoidSpaceUpgrade
          | UnsafeZigguratUpgrade
        >
      >
    >,
    resources: Record<Resource, number> = {} as Record<Resource, number>,
  ): {
    count: number;
    remainingResources: Record<Resource, number>;
  } {
    let buildsPossible = 0;

    const tempPool = Object.assign({}, resources);

    // The KG metadata associated with the build.
    const buildMetaData = mustExist(metaData[buildCacheItem.id]);
    const prices = buildCacheItem.prices;
    const priceRatio = buildCacheItem.priceRatio;
    const source = buildCacheItem.source;
    let maxItemsBuilt = false;

    if (prices.length === 0) {
      return { count: 0, remainingResources: tempPool };
    }

    // There is actually no strong guarantee that `maxItemsBuilt` changes in the loops below.
    // This could end up being an infinite loop under unexpected conditions.
    while (!maxItemsBuilt) {
      // Go through the prices for this build.
      for (let priceIndex = 0; priceIndex < prices.length; priceIndex++) {
        // Is this an oil cost for a build on the space tab?
        let spaceOil = false;
        // Is this a karma cost for building cryochambers?
        let cryoKarma = false;
        // The actual, discounted oil price for the build.
        let oilPrice = Number.POSITIVE_INFINITY;
        // The actual, discounted karma price for the build.
        let karmaPrice = Number.POSITIVE_INFINITY;

        // Determine the new state of the flags above.
        if (source === "Space" && prices[priceIndex].name === "oil") {
          spaceOil = true;

          const oilReductionRatio = this._host.game.getEffect("oilReductionRatio");
          oilPrice =
            prices[priceIndex].val * (1 - this._host.game.getLimitedDR(oilReductionRatio, 0.75));
        } else if (buildCacheItem.id === "cryochambers" && prices[priceIndex].name === "karma") {
          cryoKarma = true;

          const burnedParagonRatio = this._host.game.prestige.getBurnedParagonRatio();
          karmaPrice =
            prices[priceIndex].val *
            (1 - this._host.game.getLimitedDR(0.01 * burnedParagonRatio, 1.0));
        }

        if (spaceOil) {
          maxItemsBuilt = tempPool.oil < oilPrice * 1.05 ** (buildsPossible + buildMetaData.val);
        } else if (cryoKarma) {
          maxItemsBuilt =
            tempPool.karma < karmaPrice * priceRatio ** (buildsPossible + buildMetaData.val);
        } else {
          maxItemsBuilt =
            tempPool[prices[priceIndex].name] <
            prices[priceIndex].val * priceRatio ** (buildsPossible + buildMetaData.val);
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
            buildsPossible + buildMetaData.val >= 1) ||
          // Is this the resource retrieval build? This one is limited to 100 units.
          (buildCacheItem.id === "ressourceRetrieval" &&
            buildsPossible + buildMetaData.val >= 100) ||
          (buildCacheItem.id === "cryochambers" &&
            this._host.game.bld.getBuildingExt("chronosphere").meta.val <=
              buildsPossible + buildMetaData.val)
        ) {
          // Go through all prices that we have already checked.
          for (let priceIndex2 = 0; priceIndex2 < priceIndex; priceIndex2++) {
            // TODO: This seems to just be `spaceOil`.
            // TODO: A lot of this code seems to be a duplication from a few lines above.
            if (source === "Space" && prices[priceIndex2].name === "oil") {
              const oilReductionRatio = this._host.game.getEffect("oilReductionRatio");
              const oilPriceRefund =
                prices[priceIndex2].val *
                (1 - this._host.game.getLimitedDR(oilReductionRatio, 0.75));

              tempPool.oil += oilPriceRefund * 1.05 ** (buildsPossible + buildMetaData.val);

              // TODO: This seems to just be `cryoKarma`.
            } else if (
              buildCacheItem.id === "cryochambers" &&
              prices[priceIndex2].name === "karma"
            ) {
              const burnedParagonRatio = this._host.game.prestige.getBurnedParagonRatio();
              const karmaPriceRefund =
                prices[priceIndex2].val *
                (1 - this._host.game.getLimitedDR(0.01 * burnedParagonRatio, 1.0));

              tempPool.karma +=
                karmaPriceRefund * priceRatio ** (buildsPossible + buildMetaData.val);
            } else {
              const refundVal =
                prices[priceIndex2].val * priceRatio ** (buildsPossible + buildMetaData.val);
              tempPool[prices[priceIndex2].name] +=
                prices[priceIndex2].name === "void" ? Math.ceil(refundVal) : refundVal;
            }
          }

          // Is this a limited build? If so, don't build more than the limit.
          if (buildCacheItem.limit && buildCacheItem.limit !== -1) {
            buildsPossible = Math.max(
              0,
              Math.min(buildsPossible, buildCacheItem.limit - buildCacheItem.val),
            );
          }

          return { count: buildsPossible, remainingResources: tempPool };
        }

        // Deduct the cost of this price from the temporary resource cache.
        if (spaceOil) {
          tempPool.oil -= oilPrice * 1.05 ** (buildsPossible + buildMetaData.val);
        } else if (cryoKarma) {
          tempPool.karma -= karmaPrice * priceRatio ** (buildsPossible + buildMetaData.val);
        } else {
          const newPriceValue =
            prices[priceIndex].val * priceRatio ** (buildsPossible + buildMetaData.val);
          tempPool[prices[priceIndex].name] -=
            prices[priceIndex].name === "void" ? Math.ceil(newPriceValue) : newPriceValue;
        }

        // Check the next price...
      }

      ++buildsPossible;
    }

    return { count: buildsPossible, remainingResources: tempPool };
  }

  /**
   * Try to trigger the build for a given button.
   *
   * @param model The model associated with the button.
   * @param button The build button.
   * @param amount How many items to build.
   * @returns How many items were built.
   */
  construct<
    TModel extends
      | UnsafeBuildingBtnModernModel<UnsafeStagingBldButtonOptions>
      | UnsafeBuildingBtnModernModel<UnsafeUnstagedBuildingButtonOptions>
      | UnsafeBuildingStackableBtnModel<UnsafeChronoforgeUpgradeButtonOptions>
      | UnsafeBuildingStackableBtnModel<UnsafePlanetBuildingButtonOptions>
      | UnsafeBuildingStackableBtnModel<UnsafeSpaceProgramButtonOptions>
      | UnsafeBuildingStackableBtnModel<UnsafeVoidSpaceUpgradeButtonOptions>
      | UnsafeReligionBtnModel<UnsafeReligionButtonOptions>
      | UnsafeTranscendenceBtnModel<UnsafeTranscendenceButtonOptions>
      | UnsafeZigguratBtnModel<UnsafeZigguratButtonOptions>,
    TController extends BuildingStackableBtnController<TModel>,
  >(model: TModel, controller: TController, amount: number): number {
    if ("name" in model === false) {
      return 0;
    }
    if ("controller" in model.options === false) {
      return 0;
    }
    if ("getMetadata" in model.options.controller === false) {
      return 0;
    }

    const meta = model.metadata;
    let counter = 0;
    let amountCalculated = amount;

    // For limited builds, only construct up to the max.
    const vsMeta = meta as Required<UnsafeVoidSpaceUpgrade>;
    if (!isNil(vsMeta.limitBuild) && vsMeta.limitBuild - vsMeta.val < amountCalculated) {
      amountCalculated = vsMeta.limitBuild - vsMeta.val;
    }

    if ((model.enabled && controller.hasResources(model)) || this._host.game.devMode) {
      while (controller.hasResources(model) && amountCalculated > 0) {
        model.prices = controller.getPrices(model);
        controller.payPrice(model);
        controller.incrementValue(model);
        counter++;
        amountCalculated--;
      }
      if (vsMeta.breakIronWill) {
        this._host.game.ironWill = false;
      }
      if (!isNil(meta)) {
        if ("unlocks" in meta && !isNil(meta.unlocks)) {
          this._host.game.unlock(meta.unlocks as Partial<Unlocks>);
        }
        if ("upgrades" in meta && !isNil(meta.upgrades)) {
          this._host.game.upgrade(meta.upgrades as Partial<Unlocks>);
        }
      }
    }
    return counter;
  }

  private _isStagedBuild(
    // biome-ignore lint/suspicious/noExplicitAny: This is currently too hard to work around.
    data: any,
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
   * Determine the price modifier for the given building.
   *
   * @param data The building metadata.
   * @param source The tab the building belongs to.
   * @returns The price modifier for this building.
   * @see `getPriceRatioWithAccessor`@`buildings.js`
   */
  getPriceRatio(
    data:
      | UnsafeBuilding
      | UnsafeChronoForgeUpgrade
      | UnsafeReligionUpgrade
      | UnsafeSpaceBuilding
      | UnsafeTranscendenceUpgrade
      | UnsafeVoidSpaceUpgrade
      | UnsafeZigguratUpgrade,
    source?: TabId,
  ): number {
    // If the building has stages, use the ratio for the current stage.
    const ratio =
      // TODO: This seems weird. Why not take the price ratio of the stage as the default?
      this._isStagedBuild(data)
        ? data.priceRatio || data.stages[data.stage].priceRatio
        : (data.priceRatio ?? 0);

    let ratioDiff = 0;
    if (source && source === "Bonfire") {
      ratioDiff =
        this._host.game.getEffect(`${data.name}PriceRatio` as const) +
        this._host.game.getEffect("priceRatio") +
        this._host.game.getEffect("mapPriceReduction");

      ratioDiff = this._host.game.getLimitedDR(ratioDiff, ratio - 1);
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
    source?: TabId,
  ): boolean {
    // Determine price reduction on this build.
    const pricesDiscount = this._host.game.getLimitedDR(
      this._host.game.getEffect(`${build.name}CostReduction` as const),
      1,
    );
    const priceModifier = 1 - pricesDiscount;

    // Check if we can't afford any of the prices for this build.
    // Return `false` if we can't afford something, otherwise `true` is
    // returned by default.
    for (const price of prices) {
      const resourcePriceDiscount = this._host.game.getLimitedDR(
        this._host.game.getEffect(`${price.name}CostReduction` as const),
        1,
      );
      const resourcePriceModifier = 1 - resourcePriceDiscount;
      const finalResourcePrice = price.val * priceModifier * resourcePriceModifier;

      // For space builds that consume oil, take the oil price reduction into account.
      // This is caused by space elevators.
      if (source && source === "Space" && price.name === "oil") {
        const oilModifier = this._host.game.getLimitedDR(
          this._host.game.getEffect("oilReductionRatio"),
          0.75,
        );
        const oilPrice = finalResourcePrice * (1 - oilModifier);
        if (this._workshopManager.getValueAvailable("oil") < oilPrice * 1.05 ** build.val) {
          return false;
        }

        // For cryochambers, take burned paragon into account for the karma cost.
      } else if (build.name === "cryochambers" && price.name === "karma") {
        const karmaModifier = this._host.game.getLimitedDR(
          0.01 * this._host.game.prestige.getBurnedParagonRatio(),
          1.0,
        );
        const karmaPrice = finalResourcePrice * (1 - karmaModifier);
        if (
          this._workshopManager.getValueAvailable("karma") <
          karmaPrice * priceRatio ** build.val
        ) {
          return false;
        }
      } else {
        if (
          this._workshopManager.getValueAvailable(price.name) <
          finalResourcePrice * priceRatio ** build.val
        ) {
          return false;
        }
      }
    }

    // We can afford this build.
    return true;
  }
}
