import type { Automation, FrameContext } from "./Engine.js";
import type { KittenScientists } from "./KittenScientists.js";
import { TabManager } from "./TabManager.js";
import type { WorkshopManager } from "./WorkshopManager.js";
import {
  type BonfireBuildingSetting,
  type BonfireItem,
  BonfireSettings,
} from "./settings/BonfireSettings.js";
import type {
  BuildButton,
  Building,
  BuildingExt,
  ButtonModernController,
  ButtonModernModel,
  GameTab,
} from "./types/index.js";
export type BonfireTab = GameTab;
export declare class BonfireManager implements Automation {
  private readonly _host;
  readonly settings: BonfireSettings;
  readonly manager: TabManager;
  private readonly _bulkManager;
  private readonly _workshopManager;
  constructor(host: KittenScientists, workshopManager: WorkshopManager, settings?: BonfireSettings);
  tick(context: FrameContext): void;
  /**
   * Try to build as many of the passed buildings as possible.
   * Usually, this is called at each iteration of the automation engine to
   * handle the building of items on the Bonfire tab.
   *
   * @param builds The buildings to build.
   */
  autoBuild(
    context: FrameContext,
    builds?: Partial<Record<BonfireItem, BonfireBuildingSetting>>,
  ): void;
  autoUpgrade(context: FrameContext): void;
  autoMisc(context: FrameContext): void;
  autoGather(): void;
  build(name: Building, stage: number | undefined, amount: number): void;
  private _getBuildLabel;
  getBuild(name: Building): BuildingExt;
  getBuildButton(
    name: Building,
    stage?: number,
  ): BuildButton<string, ButtonModernModel, ButtonModernController> | null;
}
//# sourceMappingURL=BonfireManager.d.ts.map
