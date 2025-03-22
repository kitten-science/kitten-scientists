import type { Maybe } from "@oliversalzburg/js-utils/data/nil.js";
import type { Game } from "./game.js";
import type { Price, UnsafeBuyItemResult, UnsafeBuyItemResultDeferred } from "./index.js";

// biome-ignore lint/complexity/noBannedTypes: It's a common base class in the game that should be correctly represented.
export type Control = {
  /* intentionally left blank. exists for clarity */
};

export type TabManager = Control & {
  effectsCachedExisting: Record<string, unknown>;
  meta: Array<unknown>;
  panelData: Record<string, unknown>;
  new (): TabManager;
  registerPanel: (id: string, panel: unknown) => void;
  registerMeta: (
    type: "research" | "stackable" | null,
    meta: unknown,
    provider: { getEffect: (metaElem: unknown, effectName: string) => number },
  ) => void;
  setEffectsCachedExisting: () => void;
  updateEffectCached: () => void;
  updateMetaEffectCached: (metadata: Array<unknown>) => void;
  _hasLimitedDiminishingReturn: (name: string) => boolean;
  getMetaEffect: (name: string, metadata: unknown) => number;
  getMeta: (name: string, metadata: unknown) => unknown;
  loadMetadata: (meta: unknown, saveMeta: unknown, metaId: string) => void;
  filterMetadata: (meta: unknown, fields: Array<unknown>) => Array<unknown>;
  resetStateStackable: (bld: unknown) => void;
  resetStateResearch: () => void;
};

export type Console = {
  static: {
    filters: Record<string, { title: string; enabled: boolean; unlocked: boolean }>;
  };

  new (game: Game): Console;
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
  game: Game;
  controllerOpts: TControllerOpts;

  new (game: Game, controllerOpts?: TControllerOpts): ButtonController<TControllerOpts>;

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
  fetchExtendedModel: <
    TModel extends UnsafeButtonModel<TModelOptions> | undefined = undefined,
    TModelOptions extends Record<string, unknown> | undefined = TModel extends Record<
      string,
      unknown
    >
      ? TModel["options"]
      : undefined,
  >(
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
  hasResources: <
    TModel extends UnsafeButtonModel<TModelOptions> | undefined = undefined,
    TModelOptions extends Record<string, unknown> | undefined = TModel extends Record<
      string,
      unknown
    >
      ? TModel["options"]
      : undefined,
  >(
    model: TModel,
    prices?: Array<Price>,
  ) => boolean;
  /**
   * Updates the `enabled` field in the model of the button.
   * @param model The button this controller is associated with.
   */
  updateEnabled: <
    TModel extends UnsafeButtonModel<TModelOptions> | undefined = undefined,
    TModelOptions extends Record<string, unknown> | undefined = TModel extends Record<
      string,
      unknown
    >
      ? TModel["options"]
      : undefined,
  >(
    model: TModel,
  ) => void;
  /**
   * Does nothing by default. Can invoke custom handler.
   * @param model The button this controller is associated with.
   */
  updateVisible: <
    TModel extends UnsafeButtonModel<TModelOptions> | undefined = undefined,
    TModelOptions extends Record<string, unknown> | undefined = TModel extends Record<
      string,
      unknown
    >
      ? TModel["options"]
      : undefined,
  >(
    model: TModel,
  ) => void;
  getPrices: <
    TModel extends UnsafeButtonModel<TModelOptions> | undefined = undefined,
    TModelOptions extends Record<string, unknown> | undefined = TModel extends Record<
      string,
      unknown
    >
      ? TModel["options"]
      : undefined,
  >(
    model: TModel,
  ) => Array<Price>;
  getName: <
    TModel extends UnsafeButtonModel<TModelOptions> | undefined = undefined,
    TModelOptions extends Record<string, unknown> | undefined = TModel extends Record<
      string,
      unknown
    >
      ? TModel["options"]
      : undefined,
  >(
    model: TModel,
  ) => string;
  getDescription: <
    TModel extends UnsafeButtonModel<TModelOptions> | undefined = undefined,
    TModelOptions extends Record<string, unknown> | undefined = TModel extends Record<
      string,
      unknown
    >
      ? TModel["options"]
      : undefined,
  >(
    model: TModel,
  ) => string;
  /** @deprecated */
  adjustPrice: <
    TModel extends UnsafeButtonModel<TModelOptions> | undefined = undefined,
    TModelOptions extends Record<string, unknown> | undefined = TModel extends Record<
      string,
      unknown
    >
      ? TModel["options"]
      : undefined,
  >(
    model: TModel,
    ratio: number,
  ) => void;
  /** @deprecated */
  rejustPrice: <
    TModel extends UnsafeButtonModel<TModelOptions> | undefined = undefined,
    TModelOptions extends Record<string, unknown> | undefined = TModel extends Record<
      string,
      unknown
    >
      ? TModel["options"]
      : undefined,
  >(
    model: TModel,
    ratio: number,
  ) => void;
  payPrice: <
    TModel extends UnsafeButtonModel<TModelOptions> | undefined = undefined,
    TModelOptions extends Record<string, unknown> | undefined = TModel extends Record<
      string,
      unknown
    >
      ? TModel["options"]
      : undefined,
  >(
    model: TModel,
  ) => void;
  payPriceForUndoRefund: <
    TModel extends UnsafeButtonModel<TModelOptions> | undefined = undefined,
    TModelOptions extends Record<string, unknown> | undefined = TModel extends Record<
      string,
      unknown
    >
      ? TModel["options"]
      : undefined,
  >(
    model: TModel,
  ) => void;
  clickHandler: <
    TModel extends UnsafeButtonModel<TModelOptions> | undefined = undefined,
    TModelOptions extends Record<string, unknown> | undefined = TModel extends Record<
      string,
      unknown
    >
      ? TModel["options"]
      : undefined,
  >(
    model: TModel,
    event: Event,
  ) => void;
  buyItem: <
    TModel extends UnsafeButtonModel<TModelOptions> | undefined = undefined,
    TModelOptions extends Record<string, unknown> | undefined = TModel extends Record<
      string,
      unknown
    >
      ? TModel["options"]
      : undefined,
  >(
    model: TModel,
    event?: Event | null,
  ) => void;
  refund: <
    TModel extends UnsafeButtonModel<TModelOptions> | undefined = undefined,
    TModelOptions extends Record<string, unknown> | undefined = TModel extends Record<
      string,
      unknown
    >
      ? TModel["options"]
      : undefined,
  >(
    model: TModel,
  ) => void;
};

export type Button<
  TModel extends UnsafeButtonModel<TModelOptions> | undefined = undefined,
  TModelOptions extends Record<string, unknown> | undefined = TModel extends Record<string, unknown>
    ? TModel["options"]
    : undefined,
  TController extends ButtonController | undefined = undefined,
  TId extends string | undefined = undefined,
  TOpts = UnsafeButtonOptions<TController, TId>,
> = Control & {
  model: TModel | null;
  controller: TController;
  game: Game;

  domNode: HTMLDivElement;
  container: unknown;

  tab: string | null;

  buttonTitle: string | null;

  /** @deprecated screw this */
  opts: TOpts;
  new (opts: TOpts, game: Game): Button<TModel, TModelOptions, TController, TId, TOpts>;
  setOpts: (opts: TOpts) => void;

  init: () => void;
  updateVisible: () => void;
  updateEnabled: () => void;
  update: () => void;

  render: (btnContainer: unknown) => void;
  animate: () => void;
  onClick: (event: MouseEvent) => void;
  onKeyPress: (event: KeyboardEvent) => void;
  afterRender: () => void;

  addLink: (linkModel: UnsafeLinkModel) => UnsafeLinkResult;
  addLinkList: (links: Array<UnsafeLinkModel>) => Record<string, UnsafeLinkResult>;
};

export type ButtonModernController<
  TControllerOpts extends Record<string, unknown> | undefined = undefined,
> = ButtonController<TControllerOpts> & {
  new (game: Game): ButtonModernController;
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
  TModel extends UnsafeButtonModernModel<TModelOptions> | undefined = undefined,
  TModelOptions extends Record<string, unknown> | undefined = TModel extends Record<string, unknown>
    ? TModel["options"]
    : undefined,
  TController extends ButtonModernController | undefined = undefined,
  TId extends string | undefined = undefined,
> = Button<TModel, TModelOptions, TController, TId> & {
  afterRender: () => void;
  getTooltipHTML: () => string;
  attachTooltip: (htmlProvider: unknown) => void;
  updateTooltip: (container: unknown, tooltip: JQuery<HTMLElement>, htmlProvider: unknown) => void;
  renderLinks: () => void;
  updateLink: (buttonLink: unknown, modelLink: unknown) => void;
  getSelectedObject: () => TModel;
};

export type BuildingBtnController<
  TModelMetadata extends Record<string, unknown> = Record<string, unknown>,
  TModel extends UnsafeBuildingBtnModel<TModelMetadata> = UnsafeBuildingBtnModel<TModelMetadata>,
> = ButtonModernController & {
  new (game: Game): BuildingBtnController;
  initModel: (options: unknown) => TModel;
  fetchModel: (options: unknown) => TModel;
  getMetadata: (model: unknown) => TModelMetadata | null;
  getEffects: (model: TModel) => TModelMetadata["effects"];
  getTotalEffects: (model: TModel) => TModelMetadata["totalEffectsCached"];
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
  TModel extends UnsafeBuildingBtnModel<TModelOptions> | undefined = undefined,
  TModelOptions extends Record<string, unknown> | undefined = TModel extends Record<string, unknown>
    ? TModel["options"]
    : undefined,
  TController extends ButtonModernController | undefined = undefined,
  TId extends string | undefined = undefined,
> = ButtonModern<TModel, TModelOptions, TController, TId> & {
  sellHref: null;
  toggleHref: null;
  renderLinks: () => void;
  sell: (event: Event) => void;
  update: () => void;
};

export type BuildingStackableBtnController<
  TModelMetadata extends Record<string, unknown> = Record<string, unknown>,
  TModel extends UnsafeBuildingBtnModel<TModelMetadata> = UnsafeBuildingBtnModel<TModelMetadata>,
> = BuildingBtnController<TModelMetadata, TModel> & {
  new (game: Game): BuildingStackableBtnController;
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
  build: (model: unknown, maxBld: number) => void;
  incrementValue: (model: unknown) => void;
};

export type BuildingStackableBtn<
  TModel extends UnsafeBuildingBtnModel<TModelOptions> | undefined = undefined,
  TModelOptions extends Record<string, unknown> | undefined = TModel extends Record<string, unknown>
    ? TModel["options"]
    : undefined,
  TController extends ButtonModernController | undefined = undefined,
  TId extends string | undefined = undefined,
> = BuildingBtn<TModel, TModelOptions, TController, TId> & {
  onClick: (event: unknown) => void;
};

export type BuildingNotStackableBtnController = BuildingBtnController & {
  new (game: Game): BuildingNotStackableBtnController;
  getDescription: (model: unknown) => string;
  getName: (model: unknown) => string;
  getPrices: (model: unknown) => Array<Price>;
  updateEnabled: (model: unknown) => void;
  buyItem: (model: unknown, event: unknown, callback: unknown) => UnsafeBuyItemResult;
  onPurchase: (model: unknown) => void;
};

export type BuildingResearchBtn<
  TModel extends UnsafeBuildingBtnModel<TModelOptions> | undefined = undefined,
  TModelOptions extends Record<string, unknown> | undefined = TModel extends Record<string, unknown>
    ? TModel["options"]
    : undefined,
  TController extends ButtonModernController | undefined = undefined,
  TId extends string | undefined = undefined,
> = BuildingBtn<TModel, TModelOptions, TController, TId>;

export type Spacer = {
  title: string;
  new (title: string): Spacer;
  render: (container: unknown) => void;
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
  game: Game | null;
  setGame: (game: Game) => void;
};

export type IChildrenAware<TChildren = unknown> = {
  children: Array<TChildren>;
  addChild: (child: unknown) => void;
  render: (container: unknown) => void;
  update: () => void;
};

export type Panel = ContentRowRenderer &
  IChildrenAware & {
    game: Game | null;
    collapsed: boolean;
    visible: boolean;
    name: string;
    panelDiv: null;
    toggle: null;
    contentDiv: null;
    new (name: string, tabManager: TabManager): Panel;
    render: (container: unknown) => void;
    onKeyPress: (event: Event) => void;
    collapse: (isCollapsed: boolean) => void;
    onToggle: (isCollapsed: unknown) => void;
    setVisible: (visible: boolean) => void;
    update: () => void;
    setGame: (game: Game) => void;
  };

export type Tab<TChildren = unknown> = ContentRowRenderer &
  IChildrenAware<TChildren> & {
    game: Game | null;
    buttons: null;
    tabId: null;
    tabName: null;
    domNode: null;
    visible: boolean;
    new (opts: unknown, game: Game): Tab;
    render: (tabContainer: unknown) => void;
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
  TModelOptions extends Record<string, unknown> | undefined = undefined,
> = UnsafeButtonModelDefaults & {
  options: TModelOptions;
};

export type UnsafeButtonModernModel<
  TModelOptions extends Record<string, unknown> | undefined = undefined,
> = UnsafeButtonModernModelDefaults & UnsafeButtonModel<TModelOptions>;

export type UnsafeBuildingBtnModel<
  TModelOptions extends Record<string, unknown> | undefined = undefined,
  TMetadata extends Record<string, unknown> | undefined = undefined,
> = {
  metadata: TMetadata;
} & UnsafeButtonModernModel<TModelOptions>;

export type UnsafeBuildingStackableBtnModel<
  TModelOptions extends Record<string, unknown> | undefined = undefined,
  TMetadata extends Record<string, unknown> | undefined = undefined,
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
