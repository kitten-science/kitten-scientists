import type { KittenScientists } from "../KittenScientists.js";
import type { Resource } from "../types/index.js";
/**
 * The `CacheManager` apparently stores a state of resources in stock.
 * Components can push individual resource sets into the cache to update
 * the overall stock cache.
 */
export declare class MaterialsCache {
  private readonly _host;
  private readonly _cache;
  private readonly _cacheSum;
  constructor(host: KittenScientists);
  /**
   * Store a set of materials in the cache.
   * This is usually done *after* hunting and trading.
   * TODO: This is indicative of the desire to know the resource state at the beginning of
   *       a frame. This is likely required to make different automations play nice together.
   *
   * @param data The materials to store in the cache.
   * @param data.materials The materials themselves.
   * @param data.timeStamp The current time.
   */
  pushToCache(data: {
    materials: Partial<Record<Resource, number>>;
    timeStamp: number;
  }): void;
  /**
   * Retrieve the resource amount that is stored in the cache.
   *
   * @param resource The resource to check.
   * @returns The cached resource amount, divided by how long it has been cached.
   */
  getResValue(resource: Resource): number;
}
//# sourceMappingURL=MaterialsCache.d.ts.map
