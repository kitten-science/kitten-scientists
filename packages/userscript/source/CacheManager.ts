import { UserScript } from "./UserScript";

export class CacheManager {
  private readonly _host: UserScript;

  constructor(host: UserScript) {
    this._host = host;
  }

  pushToCache(data: unknown): void {
    var cache = this._host.options.auto.cache.cache;
    var cacheSum = this._host.options.auto.cache.cacheSum;
    var materials = data["materials"];
    //var currentTick = this._host.gamePage.timer.ticksTotal;

    cache.push(data);
    for (var mat in materials) {
      if (!cacheSum[mat]) {
        cacheSum[mat] = 0;
      }
      cacheSum[mat] += materials[mat];
    }

    for (var i = 0; i < cache.length; i++) {
      var oldData = cache[i];
      if (cache.length > 10000) {
        var oldMaterials = oldData["materials"];
        for (var mat in oldMaterials) {
          if (!cacheSum[mat]) {
            cacheSum[mat] = 0;
          }
          cacheSum[mat] -= oldMaterials[mat];
        }
        cache.shift();
        i--;
      } else {
        return;
      }
    }
  }

  getResValue(res: unknown): unknown {
    const cache = this._host.options.auto.cache.cache;
    if (cache.length === 0) {
      return 0;
    }
    const cacheSum = this._host.options.auto.cache.cacheSum;
    if (!cacheSum[res]) {
      return 0;
    }
    var currentTick = this._host.gamePage.timer.ticksTotal;
    var startingTick = cache[0].timeStamp;

    return cacheSum[res] / (currentTick - startingTick);
  }
}
