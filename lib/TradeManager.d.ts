import { type Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import { type Automation, type FrameContext } from "./Engine.js";
import type { KittenScientists } from "./KittenScientists.js";
import { TabManager } from "./TabManager.js";
import type { WorkshopManager } from "./WorkshopManager.js";
import type { MaterialsCache } from "./helper/MaterialsCache.js";
import { TradeSettings, type TradeSettingsItem } from "./settings/TradeSettings.js";
import type { ResourceInfo } from "./types/craft.js";
import type { BuildButton, Race, RaceInfo, Resource, TradeTab } from "./types/index.js";
export declare class TradeManager implements Automation {
  private readonly _host;
  readonly settings: TradeSettings;
  readonly manager: TabManager<TradeTab>;
  private readonly _workshopManager;
  constructor(host: KittenScientists, workshopManager: WorkshopManager, settings?: TradeSettings);
  tick(context: FrameContext): void;
  autoTrade(cacheManager?: MaterialsCache): void;
  autoBuildEmbassies(context: FrameContext): void;
  autoFeedElders(): void;
  autoUnlock(context: FrameContext): void;
  autoTradeBlackcoin(): void;
  /**
   * Trade with the given race.
   *
   * @param name The race to trade with.
   * @param amount How often to trade with the race.
   */
  trade(name: Race, amount: number): void;
  /**
   * Determine if a trade with the given race would be considered profitable.
   *
   * @param name The race to trade with.
   * @returns `true` if the trade is profitable; `false` otherwise.
   */
  getProfitability(name: Race): boolean;
  /**
   * Determine which resources and how much of them a trade with the given race results in.
   *
   * @param race The race to check.
   * @returns The resources returned from an average trade and their amount.
   */
  getAverageTrade(race: RaceInfo): Partial<Record<Resource, number>>;
  /**
   * Determine if this trade is valid.
   *
   * @param item The tradeable item.
   * @param race The race to trade with.
   * @returns `true` if the trade is valid; `false` otherwise.
   */
  private _isValidTrade;
  /**
   * Determine how many trades are at least possible.
   *
   * @param name The race to trade with.
   * @param _limited Is the race set to be limited.
   * @param _trigConditions Ignored
   * @returns The lowest number of trades possible with this race.
   */
  getLowestTradeAmount(name: Race | null, _limited: boolean, _trigConditions: unknown): number;
  /**
   * Determine the resources required to trade with the given race.
   *
   * @param race The race to check. If not specified the resources for any
   * trade will be returned.
   * @returns The resources need to trade with the race.
   */
  getMaterials(race?: Maybe<Race>): Partial<Record<Resource, number>>;
  /**
   * Retrieve information about the given race from the game.
   *
   * @param name The race to get the information object for.
   * @returns The information object for the given race.
   */
  getRace(name: Race): RaceInfo;
  /**
   * Retrieve a reference to the trade button for the given race from the game.
   *
   * @param race The race to get the button reference for.
   * @returns The reference to the trade button.
   */
  getTradeButton(race: string): BuildButton | null;
  /**
   * Determine if at least a single trade can be made.
   *
   * @param trade - The trade option to check. If not specified, all races are checked.
   * @returns If the requested trade is possible.
   */
  singleTradePossible(
    sectionTrigger: number,
    catpower: ResourceInfo,
    gold: ResourceInfo,
    trade?: TradeSettingsItem,
  ): boolean;
}
//# sourceMappingURL=TradeManager.d.ts.map
