import type {
  BuildingNotStackableBtnController,
  BuildingResearchBtn,
  Panel,
  Tab,
  TabManager,
  UnsafeButtonModernModel,
  UnsafeButtonModernModelDefaults,
} from "./core.js";
import type { Game } from "./game.js";
import type {
  BuildingEffect,
  Job,
  Policy,
  Price,
  Race,
  Technology,
  Unlocks,
  UnsafeBuyItemResult,
  UnsafeBuyItemResultDeferred,
} from "./index.js";
import type { PrestigePanel } from "./prestige.js";

export type ScienceManager = TabManager & {
  game: Game;
  hideResearched: boolean;
  policyToggleBlocked: boolean;
  policyToggleResearched: boolean;
  techs: Array<UnsafeTech>;
  policies: Array<UnsafePolicy>;
  metaCache: Record<string, unknown>;
  effectsBase: {
    environmentHappinessBonusModifier: number;
    environmentUnhappinessModifier: number;
  };
  new (game: Game): ScienceManager;
  get: (techName: Technology) => UnsafeTech;
  getPolicy: (name: Policy) => UnsafePolicy;
  checkRelation: (race: Race, embassyNeeded: number) => boolean;
  unlockRelations: () => void;
  getPrices: (tech: UnsafeTech) => Array<Price>;
  resetState: () => void;
  save: (saveData: unknown) => void;
  load: (saveData: unknown) => void;
  unlockAll: () => void;
};

export type PolicyBtnController = BuildingNotStackableBtnController & {
  new (game: Game): PolicyBtnController;
  defaults: () => UnsafePolicyBtnModelDefaults;
  getMetadata: (model: UnsafePolicyBtnModel) => UnsafePolicy;
  getName: (model: UnsafePolicyBtnModel) => string;
  getPrices: (model: UnsafePolicyBtnModel) => Array<Price>;
  updateVisible: (model: UnsafePolicyBtnModel) => void;
  updateEnabled: (model: UnsafePolicyBtnModel) => void;
  shouldBeBought: (model: UnsafePolicyBtnModel, game: Game) => boolean;
  buyItem: (
    model: UnsafePolicyBtnModel,
    event: unknown,
  ) => UnsafeBuyItemResult | UnsafeBuyItemResultDeferred;
  _buyItem_step2: (model: UnsafePolicyBtnModel) => void;
  onPurchase: (model: UnsafePolicyBtnModel) => void;
};

export type PolicyPanel = Panel & {
  toggleResearchedSpan: HTMLSpanElement | null;
  toggleBlockedSpan: HTMLSpanElement | null;
  render: (container: unknown) => void;
  update: () => void;
};

export type TechButtonController = BuildingNotStackableBtnController & {
  new (game: Game): TechButtonController;
  defaults: () => UnsafeTechButtonModelDefaults;
  getMetadata: (model: UnsafeTechButtonModel) => UnsafeTech;
  getPrices: (model: UnsafeTechButtonModel) => Array<Price>;
  updateVisible: (model: UnsafeTechButtonModel) => void;
};

export type Library = Tab & {
  metaphysicsPanel: PrestigePanel | null;
  render: (tabContainer: HTMLElement) => void;
  buttons?: Array<unknown>;
  tdTop?: HTMLTableCellElement;
  policyPanel?: PolicyPanel;
  detailedPollutionInfo?: HTMLSpanElement;
  update: () => void;
  new (tabName: unknown, game: Game): Library;
  createTechBtn: (tech: UnsafeTech) => BuildingResearchBtn;
};

export type UnsafePolicy = {
  blocked: boolean;
  blocks: Array<Policy>;
  calculateEffects: (self: unknown, game: Game) => void;
  description: string;
  effects: Partial<Record<BuildingEffect, number>>;
  label: string;
  name: Policy;
  prices: Array<Price>;
  requiredLeaderJob?: Job;
  /**
   * Has this policy already been researched?
   */
  researched: boolean;
  unlocked: boolean;
  unlocks: { policies: Array<Policy> };
};

export type UnsafeTech = {
  description: string;
  effectDesc: string;
  flavor: string;
  label: string;
  name: Technology;
  prices: Array<Price>;
  researched: boolean;
  unlocked: boolean;
  unlocks?: Partial<Unlocks>;
};

export type UnsafePolicyBtnModelDefaults = {
  tooltipName: boolean;
  simplePrices: boolean;
} & UnsafeButtonModernModelDefaults;

export type UnsafePolicyBtnModel<
  TModelOptions extends Record<string, unknown> | undefined = undefined,
> = UnsafePolicyBtnModelDefaults & UnsafeButtonModernModel<TModelOptions>;

export type UnsafeTechButtonModelDefaults = {
  tooltipName: boolean;
  simplePrices: boolean;
} & UnsafeButtonModernModelDefaults;

export type UnsafeTechButtonModel<
  TModelOptions extends Record<string, unknown> | undefined = undefined,
> = UnsafeTechButtonModelDefaults & UnsafeButtonModernModel<TModelOptions>;
