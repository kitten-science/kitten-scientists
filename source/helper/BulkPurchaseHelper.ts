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
import {
  type AllBuildings,
  type Building,
  Buildings,
  type ChronoForgeUpgrade,
  ChronoForgeUpgrades,
  type Price,
  type ReligionUpgrade,
  ReligionUpgrades,
  type Resource,
  type SpaceBuilding,
  SpaceBuildings,
  type StagedBuilding,
  StagedBuildings,
  type TabId,
  type TimeItemVariant,
  type TranscendenceUpgrade,
  TranscendenceUpgrades,
  type UnicornItemVariant,
  type Unlocks,
  type VoidSpaceUpgrade,
  VoidSpaceUpgrades,
  type ZigguratUpgrade,
  ZigguratUpgrades,
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

export type BuildRequest = {
  id: AllBuildings;
  limit: number;
  val: number;
  // For staged buildings.
  name: AllBuildings | null;
  stage: number | null;
  variant: TimeItemVariant | UnicornItemVariant | null;
};

export type ConcreteBuild = {
  id: AllBuildings;
  limit: number;
  val: number;
  count: number;
  builder: (build: ConcreteBuild) => void;
  // For staged buildings.
  name: AllBuildings | null;
  stage: number | null;
  variant: TimeItemVariant | UnicornItemVariant | null;
};

export class BulkPurchaseHelper {
  private readonly _host: KittenScientists;
  private readonly _workshopManager: WorkshopManager;
  private _priceCache: Map<AllBuildings, Array<Array<Price>>>;

  constructor(host: KittenScientists, workshopManager: WorkshopManager) {
    this._host = host;
    this._workshopManager = workshopManager;
    this._priceCache = new Map<AllBuildings, Array<Array<Price>>>();
  }

  resetPriceCache(): void {
    this._priceCache = new Map<AllBuildings, Array<Array<Price>>>();
  }

  _getPriceForBuild(build: AllBuildings, atValue = 0): Array<Price> {
    const cachedPrices = this._priceCache.get(build) ?? [];
    const cachedPrice = cachedPrices[atValue];
    if (cachedPrice !== undefined) {
      return cachedPrice;
    }

    if (StagedBuildings.includes(build as StagedBuilding)) {
      const baseStage: Partial<Record<StagedBuilding, Building>> = {
        broadcasttower: "amphitheatre",
        dataCenter: "library",
        hydroplant: "aqueduct",
        solarfarm: "pasture",
        spaceport: "warehouse",
      };
      return this._getPriceForBuild(mustExist(baseStage[build as StagedBuilding]), atValue);
    }

    if (Buildings.includes(build as Building)) {
      const buildingMeta = this._host.game.bld.getBuildingExt(build as Building);
      const buildingMetaGet = buildingMeta.get;
      buildingMeta.get = ((attr: Parameters<typeof buildingMetaGet>[0]) => {
        if (attr === "val") {
          return atValue;
        }
        return buildingMetaGet.apply(buildingMeta, [attr]);
      }) as typeof buildingMetaGet;

      const prices = this._host.game.bld.getPricesWithAccessor(buildingMeta);
      buildingMeta.get = buildingMetaGet;
      cachedPrices[atValue] = prices;
      this._priceCache.set(build, cachedPrices);
      return prices;
    }

    if (ChronoForgeUpgrades.includes(build as ChronoForgeUpgrade)) {
      const button = this._host.game.time.queue.getQueueElementControllerAndModel({
        name: build,
        type: "chronoforge",
      });

      const prices = button.controller.getPrices({
        ...button.model,
        metadata: { ...button.model.metadata, val: atValue },
      });
      cachedPrices[atValue] = prices;
      this._priceCache.set(build, cachedPrices);
      return prices;
    }

    if (ReligionUpgrades.includes(build as ReligionUpgrade)) {
      const button = this._host.game.time.queue.getQueueElementControllerAndModel({
        name: build,
        type: "religion",
      });

      const prices = button.controller.getPrices({
        ...button.model,
        metadata: { ...button.model.metadata, val: atValue },
      });
      cachedPrices[atValue] = prices;
      this._priceCache.set(build, cachedPrices);
      return prices;
    }

    if (SpaceBuildings.includes(build as SpaceBuilding)) {
      const button = this._host.game.time.queue.getQueueElementControllerAndModel({
        name: build,
        type: "spaceBuilding",
      });

      const prices = button.controller.getPrices({
        ...button.model,
        metadata: { ...button.model.metadata, val: atValue },
      });
      cachedPrices[atValue] = prices;
      this._priceCache.set(build, cachedPrices);
      return prices;
    }

    if (TranscendenceUpgrades.includes(build as TranscendenceUpgrade)) {
      const button = this._host.game.time.queue.getQueueElementControllerAndModel({
        name: build,
        type: "transcendenceUpgrades",
      });

      const prices = button.controller.getPrices({
        ...button.model,
        metadata: { ...button.model.metadata, val: atValue },
      });
      cachedPrices[atValue] = prices;
      this._priceCache.set(build, cachedPrices);
      return prices;
    }

    if (VoidSpaceUpgrades.includes(build as VoidSpaceUpgrade)) {
      const button = this._host.game.time.queue.getQueueElementControllerAndModel({
        name: build,
        type: "voidSpace",
      });

      const prices = button.controller.getPrices({
        ...button.model,
        metadata: { ...button.model.metadata, val: atValue },
      });
      cachedPrices[atValue] = prices;
      this._priceCache.set(build, cachedPrices);
      return prices;
    }

    if (ZigguratUpgrades.includes(build as ZigguratUpgrade)) {
      const button = this._host.game.time.queue.getQueueElementControllerAndModel({
        name: build,
        type: "zigguratUpgrades",
      });

      const prices = button.controller.getPrices({
        ...button.model,
        metadata: { ...button.model.metadata, val: atValue },
      });
      cachedPrices[atValue] = prices;
      this._priceCache.set(build, cachedPrices);
      return prices;
    }

    throw Error(`unable to get meta for '${build}'`);
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
          max: number;
          baseBuilding?: Building;
          building?: AllBuildings | BonfireItem;
          stage?: number;
          trigger: number;
          sectionTrigger: number;
          variant?: TimeItemVariant | UnicornItemVariant;
          builder: (build: ConcreteBuild) => void;
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
  ): Array<ConcreteBuild> {
    const buildDrafts: Array<ConcreteBuild> = [];
    const buildsSorted = objectEntries(builds).sort((a, b) => {
      const aMeta = mustExist(metaData[a[0]]);
      const bMeta = mustExist(metaData[b[0]]);
      if (aMeta.val !== bMeta.val) {
        return aMeta.val - bMeta.val;
      }
      return a[0].localeCompare(b[0], "en");
    });

    for (const [name, build] of buildsSorted) {
      const trigger = Engine.evaluateSubSectionTrigger(build.sectionTrigger, build.trigger);
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

      // If the build is for a stage that the building isn't currently at, skip it.
      if (
        this._isStagedBuild(buildMetaData) &&
        typeof build.stage !== "undefined" &&
        build.stage !== buildMetaData.stage
      ) {
        continue;
      }

      const itemPrices = this._getPriceForBuild(name);

      // Check the requirements for this build.
      // We want a list of all resources that are required for this build, which have a capacity.
      const requiredMaterials = itemPrices
        .map(price => this._workshopManager.getResource(price.name))
        .filter(material => 0 < material.maxValue);
      const allMaterialsAboveTrigger =
        requiredMaterials.filter(material => material.value / material.maxValue < trigger)
          .length === 0;

      if (allMaterialsAboveTrigger) {
        // Create an entry in the cache list for the bulk processing.
        buildDrafts.push({
          builder: build.builder,
          count: 1,
          id: name,
          limit: build.max,
          name: (build.baseBuilding ?? build.building) as Building,
          stage: build.stage ?? null,
          val: buildMetaData.val,
          variant: build.variant ?? null,
        });
      }
    }

    if (buildDrafts.length === 0) {
      return [];
    }

    // Create a copy of the currently available resources.
    // We need a copy, because `_precalculateBuilds` modifies this data.
    const currentResourcePool: Record<Resource, number> = {} as Record<Resource, number>;
    for (const res of this._host.game.resPool.resources) {
      currentResourcePool[res.name] = this._workshopManager.getValueAvailable(res.name);
    }

    let iterations = 0;
    const buildsCommitted = new Array<Array<ConcreteBuild>>();
    while (iterations < 1e6 && 0 < buildDrafts.length) {
      let increasedThisIteration = 0;
      const canBeBuilt = [];
      let tempPool = { ...currentResourcePool };

      for (const buildDraft of buildDrafts) {
        const possibleInstances = this._precalculateBuilds(
          {
            ...buildDraft,
            limit: Math.min(
              negativeOneToInfinity(buildDraft.limit),
              buildDraft.val + buildDraft.count,
            ),
          },
          metaData,
          tempPool,
        );

        if (possibleInstances.count === 0) {
          continue;
        }

        if (possibleInstances.count !== buildDraft.count) {
          tempPool = possibleInstances.remainingResources;
          canBeBuilt.push({ ...buildDraft, count: possibleInstances.count });
          continue;
        }

        tempPool = possibleInstances.remainingResources;
        canBeBuilt.push({ ...buildDraft });
        ++buildDraft.count;
        ++increasedThisIteration;
      }

      if (increasedThisIteration === 0) {
        // Return last full, or partial result.
        break;
      }

      buildsCommitted.push(canBeBuilt);
      ++iterations;
    }

    if (buildsCommitted.length === 0) {
      return [];
    }

    let validBuild: Array<ConcreteBuild> | undefined;
    for (const builds of buildsCommitted) {
      const tempPool = { ...currentResourcePool };
      let buildIsValid = true;
      for (const build of builds) {
        const possibleInstances = this._precalculateBuilds(
          {
            ...build,
            limit: Math.min(negativeOneToInfinity(build.limit), build.val + build.count),
          },
          metaData,
          tempPool,
        );
        if (possibleInstances.count < build.count) {
          buildIsValid = false;
          break;
        }
      }
      if (buildIsValid) {
        validBuild = builds;
      } else {
        break;
      }
    }

    if (validBuild !== undefined) {
      return validBuild;
    }

    console.warn(
      ...cl(`Took '${iterations}' iterations to evaluate bulk build request without result.`),
    );
    return [];
  }

  /**
   * Calculate how many of a given build item build be built with the given resources.
   *
   * @param buildCacheItem The item to build.
   * @param metaData The metadata for the potential builds.
   * @param resources The currently available resources.
   * @returns The number of items that could be built, and the amount of resources that would be left, after buying them.
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
    resources: Readonly<Record<Resource, number>> = {} as Readonly<Record<Resource, number>>,
  ): {
    count: number;
    remainingResources: Record<Resource, number>;
  } {
    let buildsPossible = 0;

    const tempPool = { ...resources };

    // The KG metadata associated with the build.
    const buildMetaData = mustExist(metaData[buildCacheItem.id]);
    let maxItemsBuilt = false;

    // There is actually no strong guarantee that `maxItemsBuilt` changes in the loops below.
    // This could end up being an infinite loop under unexpected conditions.
    while (!maxItemsBuilt && buildsPossible < 1e5) {
      if (buildCacheItem.limit <= buildMetaData.val + buildsPossible) {
        break;
      }

      const prices = this._getPriceForBuild(buildCacheItem.id, buildMetaData.val + buildsPossible);

      for (let priceIndex = 0; priceIndex < prices.length; priceIndex++) {
        if (tempPool[prices[priceIndex].name] < prices[priceIndex].val) {
          maxItemsBuilt = true;
          break;
        }
      }
      if (!maxItemsBuilt) {
        ++buildsPossible;
        for (let priceIndex = 0; priceIndex < prices.length; priceIndex++) {
          tempPool[prices[priceIndex].name] -= prices[priceIndex].val;
        }
      }
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
   * @returns `true` if the build is possible; `false` otherwise.
   */
  singleBuildPossible(build: AllBuildings): boolean {
    const prices = this._getPriceForBuild(build);

    // Check if we can't afford any of the prices for this build.
    // Return `false` if we can't afford something, otherwise `true` is
    // returned by default.
    for (const price of prices) {
      if (this._workshopManager.getValueAvailable(price.name) < price.val) {
        return false;
      }
    }

    // We can afford this build.
    return true;
  }
}
