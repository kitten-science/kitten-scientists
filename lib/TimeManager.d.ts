import type { FrameContext } from "./Engine.js";
import type { KittenScientists } from "./KittenScientists.js";
import { TabManager } from "./TabManager.js";
import type { WorkshopManager } from "./WorkshopManager.js";
import { type TimeItem, TimeSettings, type TimeSettingsItem } from "./settings/TimeSettings.js";
import {
  type BuildButton,
  type ButtonModernController,
  type ButtonModernModel,
  type ChronoForgeUpgrade,
  type ChronoForgeUpgradeInfo,
  TimeItemVariant,
  type TimeTab,
  type VoidSpaceUpgrade,
  type VoidSpaceUpgradeInfo,
} from "./types/index.js";
export declare class TimeManager {
  private readonly _host;
  readonly settings: TimeSettings;
  readonly manager: TabManager<TimeTab>;
  private readonly _bulkManager;
  private readonly _workshopManager;
  constructor(host: KittenScientists, workshopManager: WorkshopManager, settings?: TimeSettings);
  tick(context: FrameContext): void;
  /**
   * Try to build as many of the passed buildings as possible.
   * Usually, this is called at each iteration of the automation engine to
   * handle the building of items on the Time tab.
   *
   * @param builds The buildings to build.
   */
  autoBuild(context: FrameContext, builds?: Partial<Record<TimeItem, TimeSettingsItem>>): void;
  build(
    name: ChronoForgeUpgrade | VoidSpaceUpgrade,
    variant: TimeItemVariant,
    amount: number,
  ): void;
  getBuild(
    name: ChronoForgeUpgrade | VoidSpaceUpgrade,
    variant: TimeItemVariant,
  ): ChronoForgeUpgradeInfo | VoidSpaceUpgradeInfo;
  getBuildButton(
    name: ChronoForgeUpgrade | VoidSpaceUpgrade,
    variant: TimeItemVariant,
  ): BuildButton<string, ButtonModernModel, ButtonModernController> | null;
  fixCryochambers(): void;
}
//# sourceMappingURL=TimeManager.d.ts.map
