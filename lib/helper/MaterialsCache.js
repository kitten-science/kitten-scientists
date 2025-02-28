import { objectEntries } from "../tools/Entries.js";
/**
 * The `CacheManager` apparently stores a state of resources in stock.
 * Components can push individual resource sets into the cache to update
 * the overall stock cache.
 */
export class MaterialsCache {
  _host;
  _cache = new Array();
  _cacheSum = {};
  constructor(host) {
    this._host = host;
  }
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
  pushToCache(data) {
    // Store this entry in the cache.
    this._cache.push(data);
    // Update the cached sums for the passed materials.
    for (const [mat, amount] of objectEntries(data.materials)) {
      if (!this._cacheSum[mat]) {
        this._cacheSum[mat] = 0;
      }
      this._cacheSum[mat] += amount;
    }
    // Iterate over all entries in the cache.
    // TODO: This seems to be completely pointless, as the cache is never accessed.
    //       Beyond that, it seems to be a cleanup procedure that is very poorly
    //       implemented.
    for (let cacheIndex = 0; cacheIndex < this._cache.length; ++cacheIndex) {
      const oldData = this._cache[cacheIndex];
      if (this._cache.length > 10000) {
        const oldMaterials = oldData.materials;
        for (const [mat, amount] of objectEntries(oldMaterials)) {
          if (!this._cacheSum[mat]) {
            this._cacheSum[mat] = 0;
          }
          this._cacheSum[mat] -= amount;
        }
        this._cache.shift();
        cacheIndex--;
      } else {
        return;
      }
    }
  }
  /**
   * Retrieve the resource amount that is stored in the cache.
   *
   * @param resource The resource to check.
   * @returns The cached resource amount, divided by how long it has been cached.
   */
  getResValue(resource) {
    // If the cache is empty, or no sum was stored yet, return 0.
    if (this._cache.length === 0 || !this._cacheSum[resource]) {
      return 0;
    }
    const currentTick = this._host.game.timer.ticksTotal;
    const startingTick = this._cache[0].timeStamp;
    // Adjust the cached value by the amount of ticks that have passed
    // since the last time the cache was updated.
    // TODO: Why? This seems arbitrary, just like this entire cache manager.
    return this._cacheSum[resource] / (currentTick - startingTick);
  }
}
//# sourceMappingURL=MaterialsCache.js.map
