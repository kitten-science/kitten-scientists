import { objectEntries } from "./tools/Entries";
import { Resource } from "./types";
import { UserScript } from "./UserScript";

export class CacheManager {
  private readonly _host: UserScript;

  private readonly _cache = new Array<{ materials: Partial<Record<Resource, number>>; timeStamp: number }>();
  private readonly _cacheSum: Partial<Record<Resource, number>> = {};

  constructor(host: UserScript) {
    this._host = host;
  }

  pushToCache(data: { materials: Partial<Record<Resource, number>>; timeStamp: number }): void {
    const cache = this._cache;
    const cacheSum = this._cacheSum;
    const materials = data["materials"];
    //var currentTick = this._host.gamePage.timer.ticksTotal;

    cache.push(data);
    for (const [mat, amount] of objectEntries(materials)) {
      if (!cacheSum[mat]) {
        cacheSum[mat] = 0;
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      cacheSum[mat]! += amount;
    }

    for (let i = 0; i < cache.length; i++) {
      const oldData = cache[i];
      if (cache.length > 10000) {
        const oldMaterials = oldData["materials"];
        for (const [mat, amount] of objectEntries(oldMaterials)) {
          if (!cacheSum[mat]) {
            cacheSum[mat] = 0;
          }
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          cacheSum[mat]! -= amount;
        }
        cache.shift();
        i--;
      } else {
        return;
      }
    }
  }

  getResValue(res: Resource): number {
    const cache = this._cache;
    if (cache.length === 0) {
      return 0;
    }
    const cacheSum = this._cacheSum;
    if (!cacheSum[res]) {
      return 0;
    }
    const currentTick = this._host.gamePage.timer.ticksTotal;
    const startingTick = cache[0].timeStamp;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return cacheSum[res]! / (currentTick - startingTick);
  }
}
