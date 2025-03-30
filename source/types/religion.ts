import type { AnyFunction } from "@oliversalzburg/js-utils/core.js";
import type {
  BuildingStackableBtn,
  BuildingStackableBtnController,
  ButtonModern,
  ButtonModernController,
  IChildrenAware,
  IGameAware,
  Panel,
  Tab,
  TabManager,
  UnsafeBuildingBtnModel,
  UnsafeBuildingStackableBtnModel,
  UnsafeBuildingStackableBtnModelDefaults,
  UnsafeButtonModel,
  UnsafeButtonModernModel,
  UnsafeButtonModernModelDefaults,
  UnsafeButtonOptions,
} from "./core.js";
import type { GamePage } from "./game.js";
import type {
  Building,
  BuildingEffect,
  BuyItemResultReason,
  Link,
  Pact,
  Price,
  ReligionUpgrade,
  Resource,
  TranscendenceUpgrade,
  Unlocks,
  UnsafeBuyItemResult,
  Upgrade,
  ZigguratUpgrade,
} from "./index.js";

export type ReligionManager = TabManager & {
  game: GamePage;
  pactsManager: PactsManager;
  /**
   * your TT level!
   */
  transcendenceTier: number;
  /**
   * an amount of faith temporarily moved to a praised pool (aka worship)
   */
  faith: number;
  /**
   * an amount of converted faith obtained through the faith reset (aka eupyphany)
   */
  faithRatio: number;
  tcratio: number;
  corruption: number;
  alicornCounter: number;
  /**
   * the amount of currently active HG buildings (typically refils during reset)
   */
  activeHolyGenocide: number;
  new (game: GamePage): ReligionManager;
  resetState: () => void;
  save: (saveData: unknown) => void;
  load: (saveData: unknown) => void;
  getCorruptionPerTickProduction: (pretendExistNecrocorn?: boolean | undefined) => number;
  getCorruptionPerTickConsumption: () => number;
  getCorruptionDeficitPerTick: () => number;
  getCorruptionPerTick: (pretendExistNecrocorn?: boolean | undefined) => number;
  update: () => void;
  fastforward: (daysOffset: number) => void;
  corruptNecrocorns: () => number;
  necrocornsNaiveFastForward: (daysOffset: number, times: number) => void;
  gesSiphoningAlicornConsumptionPerDay: () => void;
  necrocornFastForward: (days: number, times: number) => void;
  triggerOrderOfTheVoid: (numberOfTicks: number) => void;
  zigguratUpgrades: Array<UnsafeZigguratUpgrade>;
  religionUpgrades: Array<UnsafeReligionUpgrade>;
  transcendenceUpgrades: Array<UnsafeTranscendenceUpgrade>;
  necrocornDeficitPunishment: () => void;
  effectsBase: {
    kittensKarmaPerMinneliaRatio: number;
    pactNecrocornConsumption: number;
  };
  getZU: (name: ZigguratUpgrade) => Required<UnsafeZigguratUpgrade>;
  getRU: (name: ReligionUpgrade) => Required<UnsafeReligionUpgrade>;
  getTU: (name: TranscendenceUpgrade) => Required<UnsafeTranscendenceUpgrade>;
  getPact: (name: Pact) => UnsafePact;
  getSolarRevolutionRatio: () => number;
  getApocryphaBonus: () => number;
  getHGScalingBonus: () => number;
  turnHGOff: () => void;
  praise: () => void;
  getApocryphaResetBonus: (bonusRatio: number) => number;
  resetFaith: (bonusRatio: number, withConfirmation: boolean) => void;
  _resetFaithInternal: (bonusRatio: number) => void;
  transcend: () => void;
  _getTranscendTotalPrice: (tier: number) => number;
  _getTranscendNextPrice: () => void;
  unlockAll: () => void;
  undo: (data: UnsafeReligionUndo) => void;
};

export type ZigguratBtnController = BuildingStackableBtnController<
  UnsafeZigguratBtnModel<UnsafeZigguratButtonOptions>
> & {
  defaults: () => UnsafeZigguratBtnModelDefaults;
  getMetadata: (model: UnsafeZigguratBtnModel) => UnsafeZigguratUpgrade;
  getName: (model: UnsafeZigguratBtnModel) => string;
  getPrices: (model: UnsafeZigguratBtnModel) => Array<Price>;
};

export type ReligionBtnController = BuildingStackableBtnController<
  UnsafeReligionBtnModel<UnsafeReligionButtonOptions>
> & {
  defaults: () => UnsafeReligionBtnModelDefaults;
  getMetadata: (model: UnsafeReligionBtnModel) => UnsafeReligionUpgrade;
  hasSellLink: (model: UnsafeReligionBtnModel) => boolean;
  getPrices: (model: unknown) => Array<Price>;
  updateVisible: () => void;
};

export type TranscendenceBtnController<
  TModel extends UnsafeTranscendenceBtnModel | unknown = unknown,
> = BuildingStackableBtnController<TModel> & {
  defaults: () => UnsafeTranscendenceBtnModelDefaults;
  getMetadata: (model: UnsafeTranscendenceBtnModel) => UnsafeTranscendenceUpgrade;
};

export type PraiseBtnController = ButtonModernController & {
  getName: (model: UnsafeButtonModernModel) => string;
};

export type ResetFaithBtnController = ButtonModernController & {
  getName: (model: UnsafeButtonModernModel) => string;
  updateVisible: (model: UnsafeButtonModernModel) => string;
};

export type TranscendBtnController = ButtonModernController & {
  getName: (model: UnsafeButtonModernModel) => string;
  updateEnabled: (model: UnsafeButtonModernModel) => string;
  updateVisible: (model: UnsafeButtonModernModel) => string;
};

export type TransformBtnController<
  TModel extends UnsafeTransformBtnModel | undefined = UnsafeTransformBtnModel,
  TControllerOpts extends Record<string, unknown> | undefined = Record<string, unknown>,
> = ButtonModernController<TModel, TControllerOpts> & {
  new (
    game: GamePage,
    controllerOpts?: TControllerOpts,
  ): TransformBtnController<TModel, TControllerOpts>;

  defaults: () => UnsafeTransformBtnModelDefaults;
  fetchModel: (options: unknown) => UnsafeTransformBtnModel;
  _newLink: (model: UnsafeTransformBtnModel, divider: number) => Link;
  buyItem: (model: UnsafeTransformBtnModel, event: Event) => UnsafeBuyItemResult;
  /**
   * Calculates the max number of transformations the player can afford to do.
   * If the resource has a storage cap (such as during a Unicorn Tears Challenge),
   * it won't give the option to go farther than 1 transformation above that cap.
   */
  _canAfford: (model: UnsafeTransformBtnModel, divider: number) => boolean;
  transform: (
    model: UnsafeTransformBtnModel,
    divider: number,
    event: unknown,
    callback: (itemBought: boolean, reason: BuyItemResultReason) => void,
  ) => Link;
  _transform: (model: UnsafeTransformBtnModel, amt: number) => boolean;
};

export type AllMultiLinkBtnOptions =
  | UnsafeSacrificeButtonOptions
  | UnsafeSacrificeAlicornsButtonOptions
  | UnsafeRefineTCButtonOptions;

export type MultiLinkBtn<TOpts extends AllMultiLinkBtnOptions> = ButtonModern<TOpts> & {
  all?: Link;
  half?: Link;
  fifth?: Link;
  renderLinks: () => void;
  update: () => void;
};

export type RefineTearsBtnController = ButtonModernController & {
  defaults: () => UnsafeRefineTearsBtnModelDefaults;
  fetchModel: (options: unknown) => UnsafeRefineTearsBtnModel;
  _newLink: (model: UnsafeRefineTearsBtnModel, count: number) => Link;
  _canAfford: (model: UnsafeRefineTearsBtnModel, count: unknown) => boolean;
  buyItem: (model: UnsafeRefineTearsBtnModel, event: Event, count: number) => UnsafeBuyItemResult;
  refine: () => void;
};

export type CryptotheologyWGT = IChildrenAware<
  BuildingStackableBtn<UnsafeTranscendenceButtonOptions>
> &
  IGameAware & {
    new (game: GamePage): CryptotheologyWGT;
    render: (container?: HTMLElement) => void;
    update: () => void;
  };

export type CryptotheologyPanel = Panel<CryptotheologyWGT> & {
  visible: boolean;
};

export type PactsWGT = IChildrenAware<BuildingStackableBtn<UnsafePactsButtonOptions>> &
  IGameAware & {
    new (game: GamePage): PactsWGT;
    render: (container?: HTMLElement) => void;
    update: () => void;
  };

export type PactsPanel = Panel<PactsWGT> & {
  visible: boolean;
};

export type PactsBtnController<TModel extends UnsafePactsBtnModel | unknown = unknown> =
  BuildingStackableBtnController<TModel> & {
    defaults: () => UnsafePactsBtnModelDefaults;
    getMetadata: (model: UnsafePactsBtnModel) => UnsafePact;
    updateEnabled: (model: UnsafePactsBtnModel) => void;
    shouldBeBough: (model: UnsafePactsBtnModel, game: GamePage) => boolean;
    buyItem: (
      model: UnsafePactsBtnModel,
      event: Event,
    ) => UnsafeBuyItemResult | ReturnType<BuildingStackableBtnController<TModel>["buyItem"]>;
    build: (model: UnsafePactsBtnModel, maxBld: number) => number;
  };

export type RefineBtn = ButtonModern<UnsafeRefineTearsButtonOptions> & {
  renderLinks: () => void;
  update: () => void;
};

export type PactsManager = {
  game: GamePage;
  necrocornDeficit: number;
  fractureNecrocornDeficit: number;
  pacts: Array<UnsafePact>;
  necrocornDeficitPunishment: () => void;
  new (game: GamePage): PactsManager;
  resetState: () => void;
  getPactsTextSum: () => string;
  getPactsTextDeficit: () => string;
  getNecrocornDeficitConsumptionModifier: () => number;
  getSiphonedCorruption: (days: number) => number;
  necrocornConsumptionDays: (days: number) => void;
  pactsMilleniumKarmaKittens: (millenium: number) => number;
};

export type ReligionTab = Tab<CryptotheologyPanel | PactsPanel> & {
  /**
   * Sacrifice unicorns.
   */
  sacrificeBtn: MultiLinkBtn<UnsafeSacrificeButtonOptions> | null;
  /**
   * Sacrifice alicorns.
   */
  sacrificeAlicornsBtn: MultiLinkBtn<UnsafeSacrificeAlicornsButtonOptions> | null;

  /**
   * Ziggurat upgrade buttons.
   */
  zgUpgradeButtons: Array<BuildingStackableBtn<UnsafeZigguratButtonOptions>>;
  /**
   * Religion upgrade (Order of the sun) buttons.
   */
  rUpgradeButtons: Array<BuildingStackableBtn<UnsafeReligionButtonOptions>>;
  /**
   * Religion upgrade (Order of the sun) buttons.
   */
  pactUpgradeButtons: Array<unknown>;

  ctPanel: CryptotheologyPanel;
  ptPanel: PactsPanel;
  render: (container?: HTMLElement) => void;
  update: () => void;

  /**
   * Refine tears.
   */
  refineBtn?: RefineBtn;

  /**
   * Refine time crystals.
   */
  refineTCBtn?: MultiLinkBtn<UnsafeRefineTCButtonOptions>;
  praiseBtn?: ButtonModern<UnsafePraiseButtonOptions>;
  adoreBtn?: ButtonModern<UnsafeResetFaithButtonOptions>;
  transcendBtn?: ButtonModern<UnsafeTranscendButtonOptions>;
};

export type UnsafeReligionUpgrade = {
  name: ReligionUpgrade;
  label: string;
  /**
   * An internationalized description for this religion upgrade.
   */
  description: string;
  prices: Array<Price>;
  faith: number;
  effects?: Partial<Record<BuildingEffect, number>>;
  calculateEffects: (self: UnsafeReligionUpgrade, game: GamePage) => void;
  noStackable: boolean;
  priceRatio: number;
  unlocked?: boolean;
  researched?: boolean;

  /**
   * This flag is set by KS itself to "hide" a given build from being
   * processed in the BulkManager. This is likely not ideal and will
   * be refactored later.
   */
  rHidden?: boolean;

  val?: number;
  on?: number;
  isAutomationEnabled?: boolean | null;
  lackResConvert?: boolean;
  toggleable?: boolean;
};

export type UnsafeZigguratUpgrade = {
  name: ZigguratUpgrade;
  label: string;
  /**
   * An internationalized description for this religion upgrade.
   */
  description: string;
  prices: Array<Price>;
  priceRatio: number;
  effects?: Partial<Record<BuildingEffect, number>>;
  calculateEffects: (self: UnsafeZigguratUpgrade, game: GamePage) => void;
  unlocked: boolean;
  defaultUnlocked: boolean;
  unlocks?: Partial<Unlocks>;

  /**
   * This flag is set by KS itself to "hide" a given build from being
   * processed in the BulkManager. This is likely not ideal and will
   * be refactored later.
   */
  rHidden?: boolean;

  val?: number;
  on?: number;
  noStackable?: boolean;
  isAutomationEnabled?: boolean | null;
  lackResConvert?: boolean;
  toggleable?: boolean;
};

export type UnsafeTranscendenceUpgrade = {
  name: TranscendenceUpgrade;
  label: string;
  /**
   * An internationalized description for this religion upgrade.
   */
  description: string;
  prices: Array<Price>;
  priceRatio: number;
  effects?: Partial<Record<BuildingEffect, number>>;
  calculateEffects?: (self: UnsafeTranscendenceUpgrade, game: GamePage) => void;
  upgrades?: Partial<Unlocks>;
  unlocked: boolean;
  flavor: string;
  tier: number;

  /**
   * This flag is set by KS itself to "hide" a given build from being
   * processed in the BulkManager. This is likely not ideal and will
   * be refactored later.
   */
  rHidden?: boolean;

  val?: number;
  on?: number;
  noStackable?: boolean;
  isAutomationEnabled?: boolean | null;
  lackResConvert?: boolean;
  toggleable?: boolean;
};

export type UnsafePact = {
  name: Pact;
  label: string;
  description: string;
  prices: Array<Price>;
  unlocks: Partial<Unlocks>;
  priceRatio: number;
  effects?: Partial<Record<BuildingEffect, number>>;
  unlocked: boolean;
  calculateEffects: (self: UnsafePact, game: GamePage) => void;
};

export type UnsafeReligionUndo = {
  action: "refine";
  resTo: Resource;
  resFrom: Resource;
  valTo: number;
  valFrom: number;
};

export type UnsafePraiseButtonOptions = {
  name: string;
  description: string;
  handler: AnyFunction;
  controller: PraiseBtnController;
};

export type UnsafeResetFaithButtonOptions = {
  name: string;
  description: string;
  handler: AnyFunction;
  controller: ResetFaithBtnController;
};

export type UnsafeTranscendButtonOptions = {
  name: string;
  description: string;
  handler: AnyFunction;
  controller: TranscendBtnController;
};

export type UnsafeTranscendenceButtonOptions = {
  id: TranscendenceUpgrade;
  name: string;
  description: string;
  controller: TranscendenceBtnController<UnsafeTranscendenceBtnModel>;
};

export type UnsafePactsButtonOptions = {
  id: Pact;
  name: string;
  description: string;
  controller: PactsBtnController<UnsafePactsBtnModel>;
};

export type UnsafeZigguratButtonOptions = {
  id: ZigguratUpgrade;
  name: string;
  description: string;
  prices: Array<Price>;
  controller: ZigguratBtnController;
  handler: AnyFunction;
};

export type UnsafeReligionButtonOptions = {
  id: ReligionUpgrade;
  name: string;
  description: string;
  prices: Array<Price>;
  controller: ReligionBtnController;
  handler: AnyFunction;
};

export type UnsafeRefineTearsButtonOptions = {
  name: string;
  description: string;
  prices: Array<Price>;
  controller: RefineTearsBtnController;
};

export type UnsafeSacrificeButtonOptions = {
  name: string;
  description: string;
  prices: Array<Price>;
  controller: TransformBtnController;
};

export type UnsafeSacrificeAlicornsButtonOptions = {
  name: string;
  description: string;
  prices: Array<Price>;
  controller: TransformBtnController;
};

export type UnsafeRefineTCButtonOptions = {
  name: string;
  description: string;
  prices: Array<Price>;
  controller: TransformBtnController;
};

export type UnsafeZigguratBtnModelDefaults = {
  tooltipName: boolean;
} & UnsafeBuildingStackableBtnModelDefaults;

export type UnsafeZigguratBtnModel<
  TModelOptions extends UnsafeZigguratButtonOptions | unknown = unknown,
> = UnsafeZigguratBtnModelDefaults & UnsafeBuildingStackableBtnModel<TModelOptions>;

export type UnsafeReligionBtnModelDefaults = {
  tooltipName: boolean;
} & UnsafeBuildingStackableBtnModelDefaults;

export type UnsafeReligionBtnModel<
  TModelOptions extends UnsafeReligionButtonOptions | unknown = unknown,
> = UnsafeReligionBtnModelDefaults & UnsafeBuildingStackableBtnModel<TModelOptions>;

export type UnsafeTranscendenceBtnModelDefaults = {
  tooltipName: boolean;
} & UnsafeBuildingStackableBtnModelDefaults;

export type UnsafeTranscendenceBtnModel<
  TModelOptions extends UnsafeTranscendenceButtonOptions | unknown = unknown,
> = UnsafeTranscendenceBtnModelDefaults & UnsafeBuildingStackableBtnModel<TModelOptions>;

export type UnsafeTransformBtnModelDefaults = {
  hasResourceHover: boolean;
  simplePrices: boolean;
} & UnsafeButtonModernModelDefaults;

export type UnsafeTransformBtnModel<
  TModelOptions extends Record<string, unknown> | undefined = Record<string, unknown>,
> = {
  fifthLink: Link;
  halfLink: Link;
  allLink: Link;
} & UnsafeTransformBtnModelDefaults &
  UnsafeButtonModernModel<TModelOptions>;

export type UnsafeRefineTearsBtnModelDefaults = {
  hasResourceHover: boolean;
} & UnsafeButtonModernModelDefaults;

export type UnsafeRefineTearsBtnModel<
  TModelOptions extends Record<string, unknown> | undefined = Record<string, unknown>,
> = {
  fiveLink: Link;
  twentyFiveLink: Link;
  hundredLink: Link;
} & UnsafeRefineTearsBtnModelDefaults &
  UnsafeButtonModernModel<TModelOptions>;

export type UnsafePactsBtnModelDefaults = {
  tooltipName: boolean;
} & UnsafeBuildingStackableBtnModelDefaults;

export type UnsafePactsBtnModel<
  TModelOptions extends Record<string, unknown> | undefined = Record<string, unknown>,
> = UnsafePactsBtnModelDefaults & UnsafeBuildingStackableBtnModel<TModelOptions>;
