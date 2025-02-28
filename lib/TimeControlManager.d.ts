import type { BonfireManager } from "./BonfireManager.js";
import type { Engine, FrameContext } from "./Engine.js";
import type { KittenScientists } from "./KittenScientists.js";
import type { ReligionManager } from "./ReligionManager.js";
import type { SpaceManager } from "./SpaceManager.js";
import { TabManager } from "./TabManager.js";
import type { WorkshopManager } from "./WorkshopManager.js";
import { TimeControlSettings } from "./settings/TimeControlSettings.js";
import {
  type ChronoForgeUpgrade,
  type ChronoForgeUpgradeInfo,
  TimeItemVariant,
  type TimeTab,
  type VoidSpaceUpgrade,
  type VoidSpaceUpgradeInfo,
} from "./types/index.js";
export declare class TimeControlManager {
  private readonly _host;
  readonly settings: TimeControlSettings;
  readonly manager: TabManager<TimeTab>;
  private readonly _bonfireManager;
  private readonly _religionManager;
  private readonly _spaceManager;
  private readonly _workshopManager;
  constructor(
    host: KittenScientists,
    bonfireManager: BonfireManager,
    religionManager: ReligionManager,
    spaceManager: SpaceManager,
    workshopManager: WorkshopManager,
    settings?: TimeControlSettings,
  );
  tick(_context: FrameContext): Promise<void>;
  autoReset(engine: Engine): Promise<void>;
  accelerateTime(): void;
  timeSkip(): void;
  getBuild(
    name: ChronoForgeUpgrade | VoidSpaceUpgrade,
    variant: TimeItemVariant,
  ): ChronoForgeUpgradeInfo | VoidSpaceUpgradeInfo;
}
//# sourceMappingURL=TimeControlManager.d.ts.map
