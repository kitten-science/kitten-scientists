import { type FrameContext } from "./Engine.js";
import type { KittenScientists } from "./KittenScientists.js";
import { TabManager } from "./TabManager.js";
import { UpgradeManager } from "./UpgradeManager.js";
import type { WorkshopManager } from "./WorkshopManager.js";
import { ScienceSettings } from "./settings/ScienceSettings.js";
import type { ScienceTab } from "./types/index.js";
export declare class ScienceManager extends UpgradeManager {
  readonly manager: TabManager<ScienceTab>;
  readonly settings: ScienceSettings;
  private readonly _workshopManager;
  constructor(host: KittenScientists, workshopManager: WorkshopManager, settings?: ScienceSettings);
  tick(_context: FrameContext): Promise<void>;
  autoUnlock(): Promise<void>;
  autoPolicy(): Promise<void>;
  /**
   * If there is currently an astronomical event, observe it.
   */
  observeStars(): void;
}
//# sourceMappingURL=ScienceManager.d.ts.map
