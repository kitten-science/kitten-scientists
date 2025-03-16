import type {
  BuildingStackableBtnController,
  ButtonModern,
  ButtonModernController,
  IChildrenAware,
  IGameAware,
  Panel,
  Tab,
  TabManager,
  UnsafeBuildingStackableBtnModel,
  UnsafeBuildingStackableBtnModelDefaults,
  UnsafeButtonModernModel,
  UnsafeButtonModernModelDefaults,
} from "./core.js";
import type { Game } from "./game.js";
import type {
  BuildingEffect,
  BuildingEffects,
  BuyItemResultReason,
  Link,
  Pact,
  Price,
  ReligionUpgrade,
  Resource,
  TranscendenceUpgrade,
  Unlocks,
  UnsafeBuyItemResult,
  ZiggurathUpgrade,
} from "./index.js";

export type ReligionManager = TabManager & {
  game: Game;
  pactsManager: null;
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
  corruption: number;
  alicornCounter: number;
  /**
   * the amount of currently active HG buildings (typically refils during reset)
   */
  activeHolyGenocide: number;
  new (game: Game): ReligionManager;
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
  zigguratUpgrades: Array<UnsafeZiggurathUpgrade>;
  religionUpgrades: Array<UnsafeReligionUpgrade>;
  transcendenceUpgrades: Array<UnsafeTranscendenceUpgrade>;
  necrocornDeficitPunishment: () => void;
  effectsBase: {
    kittensKarmaPerMinneliaRatio: number;
    pactNecrocornConsumption: number;
  };
  getZU: (name: ZiggurathUpgrade) => UnsafeZiggurathUpgrade;
  getRU: (name: ReligionUpgrade) => UnsafeReligionUpgrade;
  getTU: (name: TranscendenceUpgrade) => UnsafeTranscendenceUpgrade;
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

export type ZigguratBtnController = BuildingStackableBtnController & {
  defaults: () => UnsafeZigguratBtnModelDefaults;
  getMetadata: (model: UnsafeZigguratBtnModel) => UnsafeZiggurathUpgrade;
  getName: (model: UnsafeZigguratBtnModel) => string;
  getPrices: (model: UnsafeZigguratBtnModel) => Array<Price>;
};

export type ReligionBtnController = BuildingStackableBtnController & {
  defaults: () => UnsafeReligionBtnModelDefaults;
  getMetadata: (model: UnsafeReligionBtnModel) => UnsafeReligionUpgrade;
  hasSellLink: (model: UnsafeReligionBtnModel) => boolean;
  getPrices: (model: unknown) => Array<Price>;
  updateVisible: () => void;
};

export type TranscendenceBtnController = BuildingStackableBtnController & {
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

export type TransformBtnController = ButtonModernController & {
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

export type MultiLinkBtn = ButtonModern & {
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

export type CryptotheologyWGT = IChildrenAware &
  IGameAware & {
    new (game: Game): CryptotheologyWGT;
    render: (container: HTMLElement) => void;
    update: () => void;
  };

export type CryptotheologyPanel = Panel & {
  visible: boolean;
};

export type PactsWGT = IChildrenAware &
  IGameAware & {
    new (game: Game): PactsWGT;
    render: (container: HTMLElement) => void;
    update: () => void;
  };

export type PactsPanel = Panel & {
  visible: boolean;
};

export type PactsBtnController = BuildingStackableBtnController & {
  defaults: () => UnsafePactsBtnModelDefaults;
  getMetadata: (model: UnsafePactsBtnModel) => UnsafePact;
  updateEnabled: (model: UnsafePactsBtnModel) => void;
  shouldBeBough: (model: UnsafePactsBtnModel, game: Game) => boolean;
  buyItem: (
    model: UnsafePactsBtnModel,
    event: Event,
  ) => UnsafeBuyItemResult | ReturnType<BuildingStackableBtnController["buyItem"]>;
  build: (model: UnsafePactsBtnModel, maxBld: number) => number;
};

export type RefineBtn = ButtonModern & {
  renderLinks: () => void;
  update: () => void;
};

export type PactsManager = {
  game: Game;
  necrocornDeficit: number;
  fractureNecrocornDeficit: number;
  pacts: Array<UnsafePact>;
  necrocornDeficitPunishment: () => void;
  new (game: Game): PactsManager;
  resetState: () => void;
  getPactsTextSum: () => string;
  getPactsTextDeficit: () => string;
  getNecrocornDeficitConsumptionModifier: () => number;
  getSiphonedCorruption: (days: number) => number;
  necrocornConsumptionDays: (days: number) => void;
  pactsMilleniumKarmaKittens: (millenium: number) => number;
};

export type ReligionTab = Tab & {
  /**
   * Sacrifice unicorns.
   */
  sacrificeBtn: MultiLinkBtn | null;
  /**
   * Sacrifice alicorns.
   */
  sacrificeAlicornsBtn: MultiLinkBtn | null;

  /**
   * Ziggurath upgrade buttons.
   */
  zgUpgradeButtons: Array<unknown>;
  /**
   * Religion upgrade (Order of the sun) buttons.
   */
  rUpgradeButtons: Array<unknown>;
  /**
   * Religion upgrade (Order of the sun) buttons.
   */
  pactUpgradeButtons: Array<unknown>;

  ctPanel: CryptotheologyPanel;
  ptPanel: PactsPanel;
  render: (container: HTMLElement) => void;
  update: () => void;

  /**
   * Refine tears.
   */
  refineBtn?: RefineBtn;

  /**
   * Refine time crystals.
   */
  refineTCBtn?: MultiLinkBtn;
  praiseBtn?: ButtonModern;
  adoreBtn?: ButtonModern;
  transcendBtn?: ButtonModern;
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
  calculateEffects: (self: UnsafeReligionUpgrade, game: Game) => void;
  noStackable: boolean;
  priceRatio: number;
};

export type UnsafeZiggurathUpgrade = {
  name: ZiggurathUpgrade;
  label: string;
  /**
   * An internationalized description for this religion upgrade.
   */
  description: string;
  prices: Array<Price>;
  priceRatio: number;
  effects?: Partial<Record<BuildingEffect, number>>;
  calculateEffects: (self: ZiggurathUpgrade, game: Game) => void;
  unlocked: boolean;
  defaultUnlocked: boolean;
  unlocks?: Partial<Unlocks>;
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
  calculateEffects?: (self: unknown, game: Game) => void;
  upgrades?: Partial<Unlocks>;
  unlocked: boolean;
  flavor: string;
  tier: number;
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
  calculateEffects: (self: UnsafePact, game: Game) => void;
};

export type UnsafeReligionUndo = {
  action: "refine";
  resTo: Resource;
  resFrom: Resource;
  valTo: number;
  valFrom: number;
};

export type UnsafeZigguratBtnModelDefaults = {
  tooltipName: boolean;
} & UnsafeBuildingStackableBtnModelDefaults;

export type UnsafeZigguratBtnModel<
  TModelOptions extends Record<string, unknown> | undefined = undefined,
  TMetadata extends Record<string, unknown> | undefined = undefined,
> = UnsafeZigguratBtnModelDefaults & UnsafeBuildingStackableBtnModel<TModelOptions, TMetadata>;

export type UnsafeReligionBtnModelDefaults = {
  tooltipName: boolean;
} & UnsafeBuildingStackableBtnModelDefaults;

export type UnsafeReligionBtnModel<
  TModelOptions extends Record<string, unknown> | undefined = undefined,
  TMetadata extends Record<string, unknown> | undefined = undefined,
> = UnsafeReligionBtnModelDefaults & UnsafeBuildingStackableBtnModel<TModelOptions, TMetadata>;

export type UnsafeTranscendenceBtnModelDefaults = {
  tooltipName: boolean;
} & UnsafeBuildingStackableBtnModelDefaults;

export type UnsafeTranscendenceBtnModel<
  TModelOptions extends Record<string, unknown> | undefined = undefined,
  TMetadata extends Record<string, unknown> | undefined = undefined,
> = UnsafeTranscendenceBtnModelDefaults & UnsafeBuildingStackableBtnModel<TModelOptions, TMetadata>;

export type UnsafeTransformBtnModelDefaults = {
  hasResourceHover: boolean;
  simplePrices: boolean;
} & UnsafeButtonModernModelDefaults;

export type UnsafeTransformBtnModel<
  TModelOptions extends Record<string, unknown> | undefined = undefined,
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
  TModelOptions extends Record<string, unknown> | undefined = undefined,
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
  TModelOptions extends Record<string, unknown> | undefined = undefined,
  TMetadata extends Record<string, unknown> | undefined = undefined,
> = UnsafePactsBtnModelDefaults & UnsafeBuildingStackableBtnModel<TModelOptions, TMetadata>;
