import { type Automation, type FrameContext } from "./Engine.js";
import type { KittenScientists } from "./KittenScientists.js";
import { TabManager } from "./TabManager.js";
import { UpgradeManager } from "./UpgradeManager.js";
import type { MaterialsCache } from "./helper/MaterialsCache.js";
import { type CraftSettingsItem, WorkshopSettings } from "./settings/WorkshopSettings.js";
import type { CraftableInfo, ResourceInfo } from "./types/craft.js";
import type { Resource, ResourceCraftable } from "./types/index.js";
import type { VillageTab } from "./types/village.js";
export declare class WorkshopManager extends UpgradeManager implements Automation {
  readonly settings: WorkshopSettings;
  readonly manager: TabManager<VillageTab>;
  static readonly DEFAULT_CONSUME_RATE = 1;
  constructor(host: KittenScientists, settings?: WorkshopSettings);
  tick(_context: FrameContext): Promise<void>;
  autoUnlock(): Promise<void>;
  /**
   * Try to craft as many of the passed resources as possible.
   * Usually, this is called at each iteration of the automation engine to
   * handle the crafting of items on the Workshop tab.
   *
   * @param crafts The resources to build.
   */
  autoCraft(crafts?: Partial<Record<ResourceCraftable, CraftSettingsItem>>): void;
  /**
   * Craft a certain amount of items.
   *
   * @param name The resource to craft.
   * @param amount How many items of the resource to craft.
   */
  craft(name: ResourceCraftable, amount: number): void;
  private _canCraft;
  /**
   * Retrieve the resource information object from the game.
   *
   * @param name The name of the craftable resource.
   * @returns The information object for the resource.
   */
  getCraft(name: ResourceCraftable): CraftableInfo;
  /**
   * Check if we have enough resources to craft a single craftable resource.
   *
   * @param name The name of the resource.
   * @returns `true` if the build is possible; `false` otherwise.
   */
  singleCraftPossible(name: ResourceCraftable): boolean;
  /**
   * Returns a hash of the required source resources and their
   * amount to craft the given resource.
   *
   * @param name The resource to craft.
   * @returns The source resources you need and how many.
   */
  getMaterials(name: ResourceCraftable): Partial<Record<Resource, number>>;
  /**
   * Determine how much of a resource is produced per tick. For craftable resources,
   * this also includes how many of them we *could* craft this tick.
   *
   * @param resource The resource to retrieve the production for.
   * @param cacheManager A `CacheManager` to use in the process.
   * @param preTrade ?
   * @returns The amount of resources produced per tick, adjusted arbitrarily.
   */
  getTickVal(
    resource: ResourceInfo,
    cacheManager?: MaterialsCache,
    preTrade?: boolean | undefined,
  ): number | "ignore";
  /**
   * Determine the resources and their amount that would usually result from a hunt.
   *
   * @returns The amounts of resources usually gained from hunting.
   */
  getAverageHunt(): Partial<Record<Resource, number>>;
  /**
   * Retrieve the information object for a resource.
   *
   * @param name The resource to retrieve info for.
   * @returns The information object for the resource.
   */
  getResource(name: Resource): ResourceInfo;
  /**
   * Determine how many items of a resource are currently available.
   *
   * @param name The resource.
   * @returns How many items are currently available.
   */
  getValue(name: Resource): number;
  /**
   * Determine how many items of the resource to always keep in stock.
   *
   * @param name The resource.
   * @returns How many items of the resource to always keep in stock.
   */
  getStock(name: Resource): number;
  /**
   * Retrieve the consume rate for a resource.
   *
   * @param name - The resource.
   * @returns The consume rate for the resource.
   */
  getConsume(name: Resource): number;
  /**
   * Determine how much of a resource is available for a certain operation
   * to use.
   *
   * @param name The resource to check.
   * @returns The available amount of the resource.
   */
  getValueAvailable(name: Resource): number;
  /**
   * Determine how much catnip we have available to "work with" per tick.
   *
   * @param worstWeather Should the worst weather be assumed for this calculation?
   * @param pastures How many pastures to take into account.
   * @param aqueducts How many aqueducts to take into account
   * @returns The potential catnip per tick.
   */
  getPotentialCatnip(worstWeather: boolean, pastures: number, aqueducts: number): number;
  /**
   * Maintains the CSS classes in the resource indicators in the game UI to
   * reflect if the amount of resource in stock is below or above the desired
   * total amount to keep in stock.
   * The user can configure this in the Workshop automation section.
   */
  refreshStock(): void;
}
//# sourceMappingURL=WorkshopManager.d.ts.map
