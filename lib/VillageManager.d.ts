import type { Automation, FrameContext } from "./Engine.js";
import type { KittenScientists } from "./KittenScientists.js";
import { TabManager } from "./TabManager.js";
import type { WorkshopManager } from "./WorkshopManager.js";
import { MaterialsCache } from "./helper/MaterialsCache.js";
import { VillageSettings } from "./settings/VillageSettings.js";
import type { VillageTab } from "./types/village.js";
export declare class VillageManager implements Automation {
  private readonly _host;
  readonly settings: VillageSettings;
  readonly manager: TabManager<VillageTab>;
  private readonly _cacheManager;
  private readonly _workshopManager;
  constructor(host: KittenScientists, workshopManager: WorkshopManager, settings?: VillageSettings);
  tick(_context: FrameContext): void;
  autoDistributeKittens(): void;
  autoElect(): void;
  autoPromoteKittens(): void;
  autoPromoteLeader(): void;
  autoHunt(cacheManager?: MaterialsCache): void;
  autoFestival(cacheManager?: MaterialsCache): void;
}
//# sourceMappingURL=VillageManager.d.ts.map
