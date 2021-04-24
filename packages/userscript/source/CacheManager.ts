import { objectEntries } from "./tools/Entries";
import { Resource } from "./types";
import { UserScript } from "./UserScript";

export class CacheManager {
  private readonly _host: UserScript;

  constructor(host: UserScript) {
    this._host = host;
  }

  pushToCache(data: { materials: Record<Resource, number>, timeStamp: number }): void {
    const cache = this._host.options.auto.cache.cache;
    const cacheSum = this._host.options.auto.cache.cacheSum;
    const materials = data["materials"];
    //var currentTick = this._host.gamePage.timer.ticksTotal;

    cache.push(data);
    for (const [mat, amount] of objectEntries(materials)) {
      if (!cacheSum[mat]) {
        cacheSum[mat] = 0;
      }
      cacheSum[mat] += amount;
    }

    for (let i = 0; i < cache.length; i++) {
      const oldData = cache[i];
      if (cache.length > 10000) {
        const oldMaterials = oldData["materials"];
        for (const [mat, amount] of objectEntries(oldMaterials)) {
          if (!cacheSum[mat]) {
            cacheSum[mat] = 0;
          }
          cacheSum[mat] -= amount;
        }
        cache.shift();
        i--;
      } else {
        return;
      }
    }
  }

  getResValue(res: Resource): number {
    const cache = this._host.options.auto.cache.cache;
    if (cache.length === 0) {
      return 0;
    }
    const cacheSum = this._host.options.auto.cache.cacheSum;
    if (!cacheSum[res]) {
      return 0;
    }
    const currentTick = this._host.gamePage.timer.ticksTotal;
    const startingTick = cache[0].timeStamp;

    return cacheSum[res] / (currentTick - startingTick);
  }
}
