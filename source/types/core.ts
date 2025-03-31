import type { AnyFunction, AnyFunctionReturning } from "@oliversalzburg/js-utils/core.js";
import type { Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import type {
  BuildingMeta,
  BuildingsManager,
  UnsafeBuilding,
  UnsafeGatherCatnipButtonOptions,
  UnsafeRefineCatnipButtonOptions,
  UnsafeStagingBldButtonOptions,
  UnsafeUnstagedBuildingButtonOptions,
} from "./buildings.js";
import type {
  UnsafeApplyPendingButtonOptions,
  UnsafeChallengeButtonOptions,
  UnsafeReclaimReservesButtonOptions,
  UnsafeShowChallengeEffectsButtonOptions,
} from "./challenges.js";
import type {
  UnsafeAutoPinnedButtonOptions,
  UnsafeBuyBcoinButtonOptions,
  UnsafeCrashBcoinButtonOptions,
  UnsafeEmbassyButtonOptions,
  UnsafeFeedButtonOptions,
  UnsafeSellBcoinButtonOptions,
  UnsafeSendExplorersButtonOptions,
  UnsafeTradeButtonOptions,
} from "./diplomacy.js";
import type { GamePage } from "./game.js";
import type { Price, UnsafeBuyItemResult, UnsafeBuyItemResultDeferred, Upgrade } from "./index.js";
import type {
  UnsafeBurnParagonButtonOptions,
  UnsafePrestigeButtonOptions,
  UnsafeTurnHGOffButtonOptions,
} from "./prestige.js";
import type {
  AllMultiLinkBtnOptions,
  UnsafePactsButtonOptions,
  UnsafePraiseButtonOptions,
  UnsafeRefineTearsButtonOptions,
  UnsafeReligionButtonOptions,
  UnsafeResetFaithButtonOptions,
  UnsafeTranscendButtonOptions,
  UnsafeTranscendenceButtonOptions,
  UnsafeZigguratButtonOptions,
} from "./religion.js";
import type { UnsafePolicyButtonOptions, UnsafeTechButtonOptions } from "./science.js";
import type {
  UnsafePlanetBuildingButtonOptions,
  UnsafeSpaceProgramButtonOptions,
} from "./space.js";
import type {
  UnsafeAccelerateTimeButtonOptions,
  UnsafeChronoforgeUpgradeButtonOptions,
  UnsafeFixCryochamberButtonOptions,
  UnsafeResetButtonOptions,
  UnsafeShatterTCButtonOptions,
  UnsafeVoidSpaceUpgradeButtonOptions,
} from "./time.js";
import type { UISystem } from "./ui.js";
import type {
  UnsafeBiomeButtonOptions,
  UnsafeClearJobsButtonOptions,
  UnsafeFestivalButtonOptions,
  UnsafeHuntButtonOptions,
  UnsafeJobButtonOptions,
  UnsafeLoadoutButtonOptions,
  UnsafeOptimizeJobsButtonOptions,
  UnsafePromoteKittensButtonOptions,
  UnsafeRedeemGiftButtonOptions,
  UnsafeUpgradeExplorersButtonOptions,
  UnsafeUpgradeHQButtonOptions,
} from "./village.js";
import type {
  UnsafeCraftButtonOptions,
  UnsafeUpgradeButtonOptions,
  UnsafeZebraUpgradeButtonOptions,
} from "./workshop.js";

// biome-ignore lint/complexity/noBannedTypes: It's a common base class in the game that should be correctly represented.
export type Control = {
  /* intentionally left blank. exists for clarity */
};

export type TabManager<TMeta extends UnsafeMeta<unknown> | unknown = unknown> = Control & {
  effectsCachedExisting: Record<string, unknown>;
  meta: Array<TMeta>;
  panelData: Record<string, { collapsed: boolean }>;
  new (): TabManager<TMeta>;
  registerPanel: (id: string, panel: Panel) => void;
  /**
   * @param meta - metadata set (e.g. buildings list, upgrades list, etc)
   * @param provider - any object having getEffect(metaElem, effectName) method
   */
  registerMeta: (
    type: Maybe<"research" | "stackable"> | false,
    meta: unknown,
    provider: UnsafeMeta["provider"],
  ) => void;
  setEffectsCachedExisting: () => void;
  updateEffectCached: () => void;
  updateMetaEffectCached: (metadata: Array<unknown>) => void;
  _hasLimitedDiminishingReturn: (name: string) => boolean;
  getMetaEffect: (name: string, metadata: unknown) => number;
  getMeta: <TMeta extends UnsafeMeta>(name: string, metadata: Array<TMeta>) => TMeta | undefined;
  loadMetadata: (
    meta: Array<UnsafeMeta>,
    saveMeta: Array<{ name: string }>,
    metaId: string,
  ) => void;
  filterMetadata: (
    meta: Array<UnsafeMeta>,
    fields: Array<keyof UnsafeMeta>,
  ) => Array<Partial<Array<UnsafeMeta>>>;
  resetStateStackable: (bld: unknown) => void;
  resetStateResearch: () => void;
};

export type Console = {
  static: {
    filters: Record<string, { title: string; enabled: boolean; unlocked: boolean }>;
  };
  filters: Console["static"]["filters"];
  messages: Array<unknown>;
  maxMessages: number;
  messageIdCounter: number;
  ui: UISystem | null;
  game: GamePage;
  new (game: GamePage): Console;
  msg: (message: string, type: string, tag: string, noBullet: boolean) => void;
  clear: () => void;
  lockFilter: (filterName: string) => void;
  resetState: () => void;
  save: (saveData: unknown) => void;
  load: (saveData: unknown) => void;
};

export type ButtonController<
  TModel extends UnsafeButtonModel | undefined | unknown = unknown,
  TControllerOpts extends
    | {
        updateVisible?: (
          controller: ButtonController<TModel, TControllerOpts>,
          model: TModel,
        ) => void;
        getName?: (controller: ButtonController<TModel, TControllerOpts>, model: TModel) => string;
      }
    | undefined
    | unknown = unknown,
> = {
  game: GamePage;
  controllerOpts: TControllerOpts;

  new (game: GamePage, controllerOpts?: TControllerOpts): ButtonController<TModel, TControllerOpts>;

  fetchModel: <TModelOptions extends Record<string, unknown> | undefined = undefined>(
    options: TModelOptions,
  ) => ReturnType<ButtonController<TModel, TControllerOpts>["initModel"]>;
  fetchExtendedModel: <TModel extends UnsafeButtonModel | undefined = undefined>(
    model: TModel,
  ) => void;
  initModel: <TModelOptions extends Record<string, unknown> | undefined = undefined>(
    options: TModelOptions,
  ) => TModel;
  defaults: () => UnsafeButtonModelDefaults;

  createPriceLineModel: (model: undefined, price: Price) => UnsafePriceLineModel;
  hasResources: (model: { prices?: Maybe<Array<Price>> }, prices?: Array<Price>) => boolean;
  /**
   * Updates the `enabled` field in the model of the button.
   * @param model The button this controller is associated with.
   */
  updateEnabled: (model: {
    prices?: Array<Price>;
    enabled?: boolean;
    highlightUnavailable?: boolean;
    resourceIsLimited?: boolean;
  }) => void;
  /**
   * Does nothing by default. Can invoke custom handler.
   * @param model The button this controller is associated with.
   */
  updateVisible: (model?: undefined) => void;
  getPrices: <T extends { prices?: Maybe<Array<Price>> }>(model: T) => Array<Price>;
  getName: (model: TModel) => string;
  getDescription: (model: TModel) => string;
  /** @deprecated */
  adjustPrice: (model: TModel, ratio: number) => void;
  /** @deprecated */
  rejustPrice: (model: TModel, ratio: number) => void;
  payPrice: (model: TModel) => void;
  payPriceForUndoRefund: (model: TModel) => void;
  clickHandler: (model: TModel, event: Event) => void;
  buyItem: (
    model: {
      prices?: Maybe<Array<Price>>;
      enabled?: boolean;
      handler: AnyFunction;
      priceRatio?: number;
    },
    event?: Maybe<Event>,
  ) => UnsafeBuyItemResult;
  refund: (model: TModel) => void;
};

export type AllButtonOptions = AllButtonModernOptions;

export type AllButtonIds = Upgrade;

/**
 * Button is an abstract base class that is never constructed directly.
 */
export type Button<TOpts extends AllButtonOptions | unknown = unknown> = Control & {
  model: TOpts extends { controller: { fetchModel: AnyFunctionReturning } }
    ? ReturnType<TOpts["controller"]["fetchModel"]>
    : unknown;
  controller: TOpts extends { controller: unknown } ? TOpts["controller"] : unknown;
  game: GamePage;
  domNode: HTMLDivElement;
  container: unknown;
  tab: string | null;
  buttonTitle: string | null;
  opts: TOpts;
  new (opts: TOpts, game: GamePage): Button<TOpts>;
  setOpts: (opts: TOpts) => void;
  id: TOpts extends { id: unknown } ? TOpts["id"] : undefined;

  init: () => void;
  updateVisible: () => void;
  updateEnabled: () => void;
  update: () => void;

  render: (btnContainer?: HTMLElement) => void;
  animate: () => void;
  onClick: (event?: MouseEvent) => void;
  onKeyPress: (event: KeyboardEvent) => void;
  afterRender: () => void;

  addLink: (linkModel: UnsafeLinkModel) => UnsafeLinkResult;
  addLinkList: (links: Array<UnsafeLinkModel>) => Record<string, UnsafeLinkResult>;
};

export type ButtonModernController<
  TModel extends UnsafeButtonModel | undefined | unknown = unknown,
  TControllerOpts extends Record<string, unknown> | undefined | unknown = unknown,
> = ButtonController<TModel, TControllerOpts> & {
  new (game: GamePage): ButtonModernController;
  defaults: () => UnsafeButtonModernModelDefaults;
  getFlavor: (model: TModel) => string;
  getEffects: (model: TModel) => unknown;
  getTotalEffects: (model: TModel) => unknown;
  getNextEffectValue: (model: TModel, effectName: string) => unknown;
  createPriceLineModel: (model: TModel, price: Price) => UnsafePriceLineModel;
  _createPriceLineModel: (
    price: Price,
    simplePrices: boolean,
    indent?: number,
  ) => UnsafePriceLineModelExt;
  fetchExtendedModel: (model: TModel) => void;
  updateEffectModels: (model: TModel) => void;
  isPrecraftAvailable: (model: TModel) => boolean;
  precraft: (model: TModel) => void;
  _precraftRes: (price: Price) => void;
};

export type AllButtonModernOptions =
  | UnsafeGatherCatnipButtonOptions
  | UnsafeReclaimReservesButtonOptions
  | UnsafeApplyPendingButtonOptions
  | UnsafeShowChallengeEffectsButtonOptions
  | UnsafeFeedButtonOptions
  | UnsafeBuyBcoinButtonOptions
  | UnsafeSellBcoinButtonOptions
  | UnsafeCrashBcoinButtonOptions
  | UnsafeBurnParagonButtonOptions
  | UnsafeTurnHGOffButtonOptions
  | UnsafePraiseButtonOptions
  | UnsafeResetFaithButtonOptions
  | UnsafeTranscendButtonOptions
  | UnsafeFixCryochamberButtonOptions
  | UnsafeResetButtonOptions
  | UnsafeUpgradeExplorersButtonOptions
  | UnsafeUpgradeHQButtonOptions
  | UnsafeClearJobsButtonOptions
  | UnsafeHuntButtonOptions
  | UnsafeFestivalButtonOptions
  | UnsafeOptimizeJobsButtonOptions
  | UnsafePromoteKittensButtonOptions
  | UnsafeRedeemGiftButtonOptions
  | AllBuildingBtnOptions
  | UnsafeCraftButtonOptions
  | UnsafeRefineCatnipButtonOptions
  | UnsafeTradeButtonOptions
  | UnsafeEmbassyButtonOptions
  | UnsafeAutoPinnedButtonOptions
  | UnsafeSendExplorersButtonOptions
  | UnsafeRefineTearsButtonOptions
  | AllMultiLinkBtnOptions
  | UnsafeAccelerateTimeButtonOptions
  | UnsafeBiomeButtonOptions
  | UnsafeLoadoutButtonOptions
  | UnsafeJobButtonOptions;

export type ButtonModern<TOpts extends AllButtonModernOptions | unknown = unknown> =
  Button<TOpts> & {
    afterRender: () => void;
    getTooltipHTML: () => string;
    attachTooltip: (htmlProvider: unknown) => void;
    updateTooltip: (
      container: unknown,
      tooltip: JQuery<HTMLElement>,
      htmlProvider: unknown,
    ) => void;
    renderLinks: () => void;
    updateLink: (buttonLink: unknown, modelLink: unknown) => void;
    getSelectedObject: () => ButtonModern<TOpts>["model"];
  };

export type BuildingBtnController<
  TModel extends UnsafeBuildingBtnModernModel<AllBuildingBtnOptions> | unknown = unknown,
> = ButtonModernController<TModel> & {
  new (game: GamePage): BuildingBtnController<TModel>;
  initModel: (options?: unknown | undefined) => TModel;
  fetchModel: (options: unknown) => TModel;
  getMetadata: (
    model?: unknown | undefined,
  ) => TModel extends { options: { building: infer S extends UnsafeBuilding } }
    ? BuildingMeta<S>
    : null;
  getEffects: (model: TModel) => TModel extends { effects: unknown } ? TModel["effects"] : unknown;
  getTotalEffects: (
    model: TModel,
  ) => TModel extends { totalEffectsCached: unknown } ? TModel["totalEffectsCached"] : unknown;
  getNextEffectValue: (model: TModel, effectName: string) => number | undefined;
  getDescription: (model: TModel) => string;
  getFlavor: (model: TModel) => string;
  hasSellLink: (model: TModel) => false;
  metadataHasChanged: (model: TModel) => void;
  off: (model: TModel, amt?: number) => void;
  offAll: (model: TModel) => void;
  on: (model: TModel, amt?: number) => void;
  onAll: (model: TModel) => void;
  sell: (event: Event, model: TModel) => number;
  sellInternal: (model: TModel, end: number, requireSellLink: boolean) => void;
  decrementValue: (model: TModel, amt?: number) => void;
  updateVisible: (model: { visible?: boolean; metadata: { unlocked: boolean } }) => void;
  handleTogglableOnOffClick: (model: TModel) => void;
  handleToggleAutomationLinkClick: (model: TModel) => void;
};

export type AllBuildingBtnOptions = UnsafeChallengeButtonOptions | AllBuildingStackableBtnOptions;

export type BuildingBtn<TOpts extends AllBuildingBtnOptions | unknown = unknown> =
  ButtonModern<TOpts> & {
    sellHref: null;
    toggleHref: null;
    renderLinks: () => void;
    sell: (event: Event) => void;
    update: () => void;
  };

export type BuildingStackableBtnController<
  TModel extends
    | UnsafeBuildingStackableBtnModel<AllBuildingStackableBtnOptions>
    | unknown = unknown,
> = BuildingBtnController<TModel> & {
  new (game: GamePage): BuildingStackableBtnController<TModel>;
  defaults: () => UnsafeBuildingStackableBtnModelDefaults;
  getName: (model: TModel) => string;
  getPrices: (model: TModel) => Array<Price>;
  updateEnabled: (model: TModel) => void;
  buyItem: (model: TModel, event: Maybe<Event>, buyType: unknown) => UnsafeBuyItemResult;
  buyItemAll: (model: TModel, event: Maybe<Event>, callback: unknown) => UnsafeBuyItemResult;
  _buyItem_step2: (
    model: TModel,
    event: Event,
    buyType: unknown,
  ) => UnsafeBuyItemResult | UnsafeBuyItemResultDeferred;
  build: (model: TModel, maxBld: number) => void;
  incrementValue: (model: TModel) => void;
};

export type AllBuildingStackableBtnOptions =
  | UnsafeUnstagedBuildingButtonOptions
  | UnsafeTranscendenceButtonOptions
  | UnsafePactsButtonOptions
  | UnsafeZigguratButtonOptions
  | UnsafeReligionButtonOptions
  | UnsafePlanetBuildingButtonOptions
  | UnsafeSpaceProgramButtonOptions
  | UnsafeShatterTCButtonOptions
  | UnsafeChronoforgeUpgradeButtonOptions
  | UnsafeVoidSpaceUpgradeButtonOptions
  | AllBuildingResearchBtnOptions
  | UnsafeStagingBldButtonOptions;

export type BuildingStackableBtn<TOpts extends AllBuildingStackableBtnOptions | unknown = unknown> =
  BuildingBtn<TOpts> & {
    onClick: (event: unknown) => void;
  };

export type BuildingNotStackableBtnController<
  TModel extends UnsafeBuildingBtnModernModel<AllBuildingBtnOptions> | unknown = unknown,
> = BuildingBtnController<TModel> & {
  new (game: GamePage): BuildingNotStackableBtnController<TModel>;
  getDescription: (model: TModel) => string;
  getName: (model: TModel) => string;
  getPrices: (model: TModel) => Array<Price>;
  updateEnabled: (model: TModel) => void;
  buyItem: (model: TModel, event?: undefined, callback?: undefined) => UnsafeBuyItemResult;
  onPurchase: (model: TModel) => void;
};

export type AllBuildingResearchBtnOptions =
  | UnsafePrestigeButtonOptions
  | UnsafePolicyButtonOptions
  | UnsafeTechButtonOptions
  | UnsafeUpgradeButtonOptions
  | UnsafeZebraUpgradeButtonOptions;

export type BuildingResearchBtn<TOpts extends AllBuildingResearchBtnOptions> = BuildingBtn<TOpts>;

export type Spacer = {
  title: string;
  new (title: string): Spacer;
  render: (container?: HTMLElement) => void;
  update: () => void;
};

export type ContentRowRenderer = {
  twoRows: boolean;
  leftRow: null;
  rightRow: null;
  initRenderer: (content: unknown) => void;
  getElementContainer: (id: string) => unknown;
};

export type IGameAware = {
  game: GamePage | null;
  setGame: (game: GamePage) => void;
};

export type IChildrenAware<TChildren = unknown> = {
  children: Array<TChildren>;
  addChild: (child: unknown) => void;
  render: (container?: HTMLElement) => void;
  update: () => void;
};

export type Panel<TChildren = unknown> = ContentRowRenderer &
  IChildrenAware<TChildren> & {
    game: GamePage | null;
    collapsed: boolean;
    visible: boolean;
    name: string;
    panelDiv: null;
    toggle: null;
    contentDiv: null;
    new (name: string, tabManager: TabManager): Panel;
    render: (container?: HTMLElement) => HTMLDivElement;
    onKeyPress: (event: Event) => void;
    collapse: (isCollapsed: boolean) => void;
    onToggle: (isCollapsed: unknown) => void;
    setVisible: (visible: boolean) => void;
    update: () => void;
    setGame: (game: GamePage) => void;
  };

export type Tab<TChildren = unknown, TButtons = TChildren> = ContentRowRenderer &
  IChildrenAware<TChildren> & {
    game: GamePage | null;
    buttons: Array<TButtons> | null;
    tabId: null;
    tabName: null;
    domNode: null;
    visible: boolean;
    new (opts: unknown, game: GamePage): Tab;
    render: (tabContainer?: HTMLElement) => void;
    update: () => void;
    updateTab: () => void;
    addButton: (button: unknown) => void;
  };

export type UnsafeMeta<TMeta = unknown> = {
  meta: Array<TMeta>;
  provider: {
    getEffect: (metaElem: unknown, effectName: unknown) => number;
  };
};

export type UnsafeBuyResultOperationDeferred = {
  itemBought: boolean;
  reason: string;
  def?: {
    then: (callable: (result: UnsafeBuyItemResult) => void) => void;
  };
};

export type UnsafeButtonModelDefaults = Record<string, unknown> & {
  name: string;
  description: string;
  visible: boolean;
  enabled: boolean;
  handler: Maybe<(btn: unknown) => void>;
  prices: Maybe<Array<Price>>;
  priceRatio: null;
  twoRow: boolean | null;
  refundPercentage: number;
  highlightUnavailable: boolean;
  resourceIsLimited: string;
  multiplyEffects: boolean;
};

export type UnsafeButtonModernModelDefaults = {
  simplePrices: boolean;
  hasResourceHover: boolean;
  tooltipName: boolean;
} & UnsafeButtonModelDefaults;

export type UnsafeBuildingStackableBtnModelDefaults = {
  simplePrices: boolean;
  multiplyEffects: boolean;
} & UnsafeButtonModernModelDefaults;

export type UnsafeButtonModelOptions = {
  priceRatio: number;
  handler: unknown;
  twoRow: boolean;
};

export type UnsafeButtonOptions<
  TController extends ButtonController<UnsafeButtonModel> | unknown = unknown,
  TId extends string | undefined | unknown = unknown,
> = {
  controller: TController;
  id?: TId;
};

export type UnsafeButtonModel<
  TModelOptions extends UnsafeButtonOptions | undefined | unknown = unknown,
> = UnsafeButtonModelDefaults & {
  options: TModelOptions;
  priceModels?: Array<UnsafePriceLineModel>;
};

export type UnsafeButtonModernModel<
  TModelOptions extends UnsafeButtonOptions | undefined | unknown = unknown,
> = UnsafeButtonModernModelDefaults & UnsafeButtonModel<TModelOptions>;

export type UnsafeBuildingBtnModel<TModelOptions extends UnsafeButtonOptions | unknown = unknown> =
  UnsafeButtonModernModel<TModelOptions> & {
    metadata: TModelOptions extends { controller: infer C }
      ? C extends { getMetadata: AnyFunctionReturning<infer S> }
        ? S
        : unknown
      : unknown;
  };

export type UnsafeBuildingBtnModernModel<
  TModelOptions extends UnsafeButtonOptions | undefined | unknown = unknown,
> = UnsafeBuildingBtnModel<TModelOptions> & {
  metaAccessor: BuildingsManager["getBuildingExt"];
};

export type UnsafeBuildingStackableBtnModel<
  TModelOptions extends UnsafeButtonOptions | undefined | unknown = unknown,
> = UnsafeBuildingStackableBtnModelDefaults & UnsafeBuildingBtnModernModel<TModelOptions>;

export type UnsafeLinkModel = {
  id: string;
  title: string;
  alt?: string;
  handler: () => void;
};
export type UnsafeLinkResult = {
  link: HTMLAnchorElement;
  linkHandler: (event: MouseEvent) => void;
};
export type UnsafePriceLineModel = {
  title: string;
  name: string;
  val: number;
  progress: number;
  displayValue: string;
};
export type UnsafePriceLineModelExt = {
  title: string;
  name: string;
  val: number;
  hasResources: boolean;
  displayValue: string;
  indent: number;
  eta: number;
  hasLimitIssue: boolean;
};
