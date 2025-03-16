import type { Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import type { BuildingMeta, UnsafeBuilding } from "./buildings.js";
import type { GamePage } from "./game.js";
import type {
  AllBuildings,
  Price,
  UnsafeBuyItemResult,
  UnsafeBuyItemResultDeferred,
} from "./index.js";
import type { TransformBtnController } from "./religion.js";
import type { UnsafePolicyBtnModel } from "./science.js";
import type { UISystem } from "./ui.js";

// biome-ignore lint/complexity/noBannedTypes: It's a common base class in the game that should be correctly represented.
export type Control = {
  /* intentionally left blank. exists for clarity */
};

export type TabManager<TMeta extends Record<string, unknown> | unknown = unknown> = Control & {
  effectsCachedExisting: Record<string, unknown>;
  meta: Array<UnsafeMeta<TMeta>>;
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
  getMeta: (name: string, metadata: Array<UnsafeMeta>) => UnsafeMeta | undefined;
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

export type UnsafeMeta<TMeta extends Record<string, unknown> | unknown = unknown> = {
  meta: TMeta;
  provider: {
    getEffect: (metaElem: unknown, effectName: unknown) => number;
  };
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
  TControllerOpts extends Record<string, unknown> | undefined = undefined,
> = {
  game: GamePage;
  controllerOpts: TControllerOpts;

  new (game: GamePage, controllerOpts?: TControllerOpts): ButtonController<TControllerOpts>;

  fetchModel: <
    TModel extends UnsafeButtonModel<TModelOptions> | undefined = undefined,
    TModelOptions extends Record<string, unknown> | undefined = TModel extends Record<
      string,
      unknown
    >
      ? TModel["options"]
      : undefined,
  >(
    options: TModelOptions,
  ) => TModel;
  fetchExtendedModel: <TModel extends UnsafeButtonModel | undefined = undefined>(
    model: TModel,
  ) => void;
  initModel: <
    TModel extends UnsafeButtonModel<TModelOptions> | undefined = undefined,
    TModelOptions extends Record<string, unknown> | undefined = TModel extends Record<
      string,
      unknown
    >
      ? TModel["options"]
      : undefined,
  >(
    options: TModelOptions,
  ) => TModel;
  defaults: () => UnsafeButtonModelDefaults;

  createPriceLineModel: (
    model: unknown,
    price: Price,
  ) => { title: string; name: string; val: number; progress: number; displayValue: string };
  hasResources: <TModel extends UnsafeBuildingBtnModel>(
    model: TModel,
    prices?: Array<Price>,
  ) => boolean;
  /**
   * Updates the `enabled` field in the model of the button.
   * @param model The button this controller is associated with.
   */
  updateEnabled: <TModel extends UnsafeButtonModel | undefined = undefined>(model: TModel) => void;
  /**
   * Does nothing by default. Can invoke custom handler.
   * @param model The button this controller is associated with.
   */
  updateVisible: <TModel extends UnsafeButtonModel | undefined = undefined>(model: TModel) => void;
  getPrices: <TModel extends UnsafeButtonModel | undefined = undefined>(
    model: TModel,
  ) => Array<Price>;
  getName: <TModel extends UnsafeButtonModel | undefined = undefined>(model: TModel) => string;
  getDescription: <TModel extends UnsafeButtonModel | undefined = undefined>(
    model: TModel,
  ) => string;
  /** @deprecated */
  adjustPrice: <TModel extends UnsafeButtonModel | undefined = undefined>(
    model: TModel,
    ratio: number,
  ) => void;
  /** @deprecated */
  rejustPrice: <TModel extends UnsafeButtonModel | undefined = undefined>(
    model: TModel,
    ratio: number,
  ) => void;
  payPrice: <TModel extends UnsafeButtonModel | undefined = undefined>(model: TModel) => void;
  payPriceForUndoRefund: <TModel extends UnsafeButtonModel | undefined = undefined>(
    model: TModel,
  ) => void;
  clickHandler: <TModel extends UnsafeButtonModel | undefined = undefined>(
    model: TModel,
    event: Event,
  ) => void;
  buyItem: <TModel extends UnsafeButtonModel | undefined = undefined>(
    model: TModel,
    event?: Maybe<Event>,
  ) => UnsafeBuyItemResult;
  refund: <TModel extends UnsafeButtonModel | undefined = undefined>(model: TModel) => void;
};

export type Button<
  TModel extends UnsafeButtonModel,
  TController extends ButtonController | TransformBtnController,
  TId extends string | undefined = undefined,
  TOpts = UnsafeButtonOptions<TController, TId>,
> = Control & {
  model: TModel;
  controller: TController;
  game: GamePage;
  domNode: HTMLDivElement;
  container: unknown;
  tab: string | null;
  buttonTitle: string | null;
  opts: TOpts;
  new (opts: TOpts, game: GamePage): Button<TModel, TController, TId, TOpts>;
  setOpts: (opts: TOpts) => void;
  id: TId;

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
  TControllerOpts extends Record<string, unknown> | undefined = undefined,
> = ButtonController<TControllerOpts> & {
  new (game: GamePage): ButtonModernController;
  defaults: () => UnsafeButtonModernModelDefaults;
  getFlavor: <TModel extends UnsafeButtonModernModel<Record<string, unknown>>>(
    model: TModel,
  ) => string;
  getEffects: <TModel extends UnsafeButtonModernModel<Record<string, unknown>>>(
    model: TModel,
  ) => unknown;
  getTotalEffects: <TModel extends UnsafeButtonModernModel<Record<string, unknown>>>(
    model: TModel,
  ) => unknown;
  getNextEffectValue: <TModel extends UnsafeButtonModernModel<Record<string, unknown>>>(
    model: TModel,
    effectName: string,
  ) => unknown;
  createPriceLineModel: <TModel extends UnsafeButtonModernModel<Record<string, unknown>>>(
    model: TModel,
    price: Price,
  ) => UnsafePriceLineModel;
  _createPriceLineModel: (
    price: Price,
    simplePrices: boolean,
    indent?: number,
  ) => UnsafePriceLineModel;
  fetchExtendedModel: <TModel extends UnsafeButtonModernModel<Record<string, unknown>>>(
    model: TModel,
  ) => void;
  updateEffectModels: <TModel extends UnsafeButtonModernModel<Record<string, unknown>>>(
    model: TModel,
  ) => void;
  isPrecraftAvailable: <TModel extends UnsafeButtonModernModel<Record<string, unknown>>>(
    model: TModel,
  ) => boolean;
  precraft: <TModel extends UnsafeButtonModernModel<Record<string, unknown>>>(
    model: TModel,
  ) => void;
  _precraftRes: (price: Price) => void;
};

export type ButtonModern<
  TModel extends UnsafeButtonModernModel,
  TController extends ButtonModernController | TransformBtnController,
  TId extends string | undefined = undefined,
> = Button<TModel, TController, TId> & {
  afterRender: () => void;
  getTooltipHTML: () => string;
  attachTooltip: (htmlProvider: unknown) => void;
  updateTooltip: (container: unknown, tooltip: JQuery<HTMLElement>, htmlProvider: unknown) => void;
  renderLinks: () => void;
  updateLink: (buttonLink: unknown, modelLink: unknown) => void;
  getSelectedObject: () => TModel;
};

export type BuildingBtnController<
  TModel extends UnsafeBuildingBtnModel<unknown> = UnsafeBuildingBtnModel<unknown>,
> = ButtonModernController & {
  new (game: GamePage): BuildingBtnController;
  initModel: (options?: undefined) => TModel;
  fetchModel: (options: unknown) => TModel;
  getMetadata: (model: unknown) => BuildingMeta<UnsafeBuilding> | null;
  getEffects: (model: TModel) => TModel["effects"];
  getTotalEffects: (model: TModel) => TModel["totalEffectsCached"];
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
  sellInternal: (model: TModel, end: number, requireSellLink?: boolean) => void;
  decrementValue: (model: TModel, amt?: number) => void;
  updateVisible: (model: TModel) => void;
  handleTogglableOnOffClick: (model: TModel) => void;
  handleToggleAutomationLinkClick: (model: TModel) => void;
};

export type BuildingBtn<
  TModel extends UnsafeBuildingBtnModel | UnsafePolicyBtnModel,
  TController extends ButtonModernController,
  TId extends string | undefined = undefined,
> = ButtonModern<TModel, TController, TId> & {
  sellHref: null;
  toggleHref: null;
  renderLinks: () => void;
  sell: (event: Event) => void;
  update: () => void;
};

export type BuildingStackableBtnController<
  TModel extends UnsafeBuildingBtnModel<unknown> = UnsafeBuildingBtnModel<unknown>,
> = BuildingBtnController<TModel> & {
  new (game: GamePage): BuildingStackableBtnController;
  defaults: () => UnsafeBuildingStackableBtnModelDefaults;
  getName: (model: unknown) => string;
  getPrices: (model: unknown) => Array<Price>;
  updateEnabled: (model: unknown) => void;
  buyItem: (model: unknown, event: Maybe<Event>, buyType: unknown) => UnsafeBuyItemResult;
  buyItemAll: (model: unknown, event: Maybe<Event>, callback: unknown) => UnsafeBuyItemResult;
  _buyItem_step2: (
    model: unknown,
    event: Event,
    buyType: unknown,
  ) => UnsafeBuyItemResult | UnsafeBuyItemResultDeferred;
  build: (model: TModel, maxBld: number) => void;
  incrementValue: (model: unknown) => void;
};

export type BuildingStackableBtn<
  TModel extends UnsafeBuildingBtnModel,
  TController extends ButtonModernController,
  TId extends AllBuildings | undefined = undefined,
> = BuildingBtn<TModel, TController, TId> & {
  onClick: (event: unknown) => void;
};

export type BuildingNotStackableBtnController<
  TModel extends UnsafeBuildingBtnModel<unknown> = UnsafeBuildingBtnModel<unknown>,
> = BuildingBtnController<TModel> & {
  new (game: GamePage): BuildingNotStackableBtnController<TModel>;
  getDescription: (model: TModel) => string;
  getName: (model: TModel) => string;
  getPrices: (model: TModel) => Array<Price>;
  updateEnabled: (model: TModel) => void;
  buyItem: (model: TModel, event?: undefined, callback?: undefined) => UnsafeBuyItemResult;
  onPurchase: (model: TModel) => void;
};

export type BuildingResearchBtn<
  TModel extends UnsafeBuildingBtnModel | UnsafePolicyBtnModel,
  TController extends ButtonModernController,
  TId extends string | undefined = undefined,
> = BuildingBtn<TModel, TController, TId>;

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
  handler: ((btn: unknown) => void) | null;
  prices: Array<Price> | null;
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

export type UnsafeButtonOptions<TController, TId extends string | undefined = undefined> = {
  controller: TController;
  id: TId;
};

export type UnsafeButtonModel<
  TModelOptions extends Record<string, unknown> | undefined | unknown = unknown,
> = UnsafeButtonModelDefaults & {
  options: TModelOptions;
};

export type UnsafeButtonModernModel<
  TModelOptions extends Record<string, unknown> | undefined | unknown = unknown,
> = UnsafeButtonModernModelDefaults & UnsafeButtonModel<TModelOptions>;

export type UnsafeBuildingBtnModel<
  TModelOptions extends Record<string, unknown> | undefined | unknown = unknown,
  TMetadata extends UnsafeBuildingBtnModel<TModelOptions> | Record<string, unknown> = Record<
    string,
    unknown
  >,
> = UnsafeButtonModernModel<TModelOptions> & {
  metadata: TMetadata;
};

export type UnsafeBuildingStackableBtnModel<
  TModelOptions extends Record<string, unknown> | undefined | unknown = unknown,
  TMetadata extends
    | UnsafeBuildingStackableBtnModel<TModelOptions>
    | Record<string, unknown> = Record<string, unknown>,
> = UnsafeBuildingStackableBtnModelDefaults & UnsafeBuildingBtnModel<TModelOptions, TMetadata>;

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
  hasResources: boolean;
  displayValue: string;
  indent: number;
  eta: number;
  hasLimitIssue: boolean;
};
