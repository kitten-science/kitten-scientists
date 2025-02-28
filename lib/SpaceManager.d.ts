import type { Automation, FrameContext } from "./Engine.js";
import type { KittenScientists } from "./KittenScientists.js";
import { TabManager } from "./TabManager.js";
import type { WorkshopManager } from "./WorkshopManager.js";
import { type SpaceBuildingSetting, SpaceSettings } from "./settings/SpaceSettings.js";
import type { SpaceBuilding, SpaceBuildingInfo, SpaceTab } from "./types/index.js";
export declare class SpaceManager implements Automation {
  private readonly _host;
  readonly settings: SpaceSettings;
  readonly manager: TabManager<SpaceTab>;
  private readonly _bulkManager;
  private readonly _workshopManager;
  constructor(host: KittenScientists, workshopManager: WorkshopManager, settings?: SpaceSettings);
  tick(context: FrameContext): void;
  /**
   * Try to build as many of the passed buildings as possible.
   * Usually, this is called at each iteration of the automation engine to
   * handle the building of items on the Space tab.
   *
   * @param builds The buildings to build.
   */
  autoBuild(
    context: FrameContext,
    builds?: Partial<Record<SpaceBuilding, SpaceBuildingSetting>>,
  ): void;
  autoUnlock(context: FrameContext): void;
  build(name: SpaceBuilding, amount: number): number;
  getBuild(name: SpaceBuilding): SpaceBuildingInfo;
  private _getBuildButton;
}
//# sourceMappingURL=SpaceManager.d.ts.map
