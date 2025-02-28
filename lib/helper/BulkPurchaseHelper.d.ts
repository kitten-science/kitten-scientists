import type { KittenScientists } from "../KittenScientists.js";
import type { WorkshopManager } from "../WorkshopManager.js";
import type { BonfireItem } from "../settings/BonfireSettings.js";
import type { AllItems } from "../settings/Settings.js";
import type {
  AllBuildings,
  BuildButton,
  Building,
  BuildingMeta,
  ButtonModernController,
  ButtonModernModel,
  ChronoForgeUpgradeInfo,
  Price,
  ReligionUpgradeInfo,
  SpaceBuildingInfo,
  TabId,
  TimeItemVariant,
  TranscendenceUpgradeInfo,
  UnicornItemVariant,
  VoidSpaceUpgradeInfo,
  ZiggurathUpgradeInfo,
} from "../types/index.js";
export type BulkBuildListItem = {
  count: number;
  id: AllItems;
  label?: string;
  name?: AllBuildings;
  stage?: number;
  variant?: TimeItemVariant | UnicornItemVariant;
};
export declare class BulkPurchaseHelper {
  private readonly _host;
  private readonly _workshopManager;
  constructor(host: KittenScientists, workshopManager: WorkshopManager);
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
        AllItems,
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
    sectionTrigger: number,
    sourceTab: TabId,
  ): Array<BulkBuildListItem>;
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
  private _precalculateBuilds;
  /**
   * Try to trigger the build for a given button.
   *
   * @param model The model associated with the button.
   * @param button The build button.
   * @param amount How many items to build.
   * @returns How many items were built.
   */
  construct(
    model: ButtonModernModel,
    button: BuildButton<string, ButtonModernModel, ButtonModernController>,
    amount: number,
  ): number;
  private _isStagedBuild;
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
      | BuildingMeta
      | ChronoForgeUpgradeInfo
      | ReligionUpgradeInfo
      | SpaceBuildingInfo
      | TranscendenceUpgradeInfo
      | VoidSpaceUpgradeInfo
      | ZiggurathUpgradeInfo,
    source?: TabId,
  ): number;
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
    build: {
      name: AllBuildings;
      val: number;
    },
    prices: Array<Price>,
    priceRatio: number,
    source?: TabId,
  ): boolean;
}
//# sourceMappingURL=BulkPurchaseHelper.d.ts.map
