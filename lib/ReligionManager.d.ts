import type { BonfireManager } from "./BonfireManager.js";
import type { Automation, FrameContext } from "./Engine.js";
import type { KittenScientists } from "./KittenScientists.js";
import { TabManager } from "./TabManager.js";
import type { WorkshopManager } from "./WorkshopManager.js";
import {
  type FaithItem,
  type ReligionItem,
  ReligionSettings,
  type ReligionSettingsItem,
} from "./settings/ReligionSettings.js";
import {
  type ReligionTab,
  type ReligionUpgradeInfo,
  type TranscendenceUpgradeInfo,
  UnicornItemVariant,
  type ZiggurathUpgrade,
  type ZiggurathUpgradeInfo,
} from "./types/index.js";
export declare class ReligionManager implements Automation {
  private readonly _host;
  readonly settings: ReligionSettings;
  readonly manager: TabManager<ReligionTab>;
  private readonly _bulkManager;
  private readonly _bonfireManager;
  private readonly _workshopManager;
  constructor(
    host: KittenScientists,
    bonfireManager: BonfireManager,
    workshopManager: WorkshopManager,
    settings?: ReligionSettings,
  );
  tick(context: FrameContext): Promise<void>;
  private _autoBuild;
  private _buildBestUnicornBuilding;
  private _buildNonUnicornBuildings;
  private _buildReligionBuildings;
  /**
   * Determine the best unicorn-related building to buy next.
   * This is the building where the cost is in the best proportion to the
   * unicorn production bonus it generates.
   *
   * @see https://github.com/Bioniclegenius/NummonCalc/blob/112f716e2fde9956dfe520021b0400cba7b7113e/NummonCalc.js#L490
   * @returns The best unicorn building.
   */
  getBestUnicornBuilding(): ZiggurathUpgrade | "unicornPasture" | null;
  build(name: ReligionItem | "unicornPasture", variant: UnicornItemVariant, amount: number): void;
  getBuildMetaData(
    builds: Partial<Record<FaithItem, ReligionSettingsItem>>,
  ): Partial<
    Record<FaithItem, ReligionUpgradeInfo | ZiggurathUpgradeInfo | TranscendenceUpgradeInfo>
  >;
  /**
   * Retrieve information about an upgrade.
   *
   * @param name The name of the upgrade.
   * @param variant The variant of the upgrade.
   * @returns The build information for the upgrade.
   */
  getBuild(
    name: ReligionItem | "unicornPasture",
    variant: UnicornItemVariant,
  ): ReligionUpgradeInfo | TranscendenceUpgradeInfo | ZiggurathUpgradeInfo | null;
  /**
   * Find the button that allows purchasing a given upgrade.
   *
   * @param name The name of the upgrade.
   * @param variant The variant of the upgrade.
   * @returns The button to buy the upgrade, or `null`.
   */
  private _getBuildButton;
  private _transformBtnSacrificeHelper;
  private _autoSacrificeUnicorns;
  private _autoSacrificeAlicorns;
  private _autoTears;
  private _autoTCs;
  private _autoTAP;
  private _autoAdore;
  private _autoTranscend;
  private _autoPraise;
}
//# sourceMappingURL=ReligionManager.d.ts.map
