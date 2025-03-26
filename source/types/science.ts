import type {
  BuildingNotStackableBtnController,
  BuildingResearchBtn,
  ButtonModernController,
  Panel,
  Tab,
  TabManager,
  UnsafeBuildingBtnModel,
  UnsafeButtonModernModel,
  UnsafeButtonModernModelDefaults,
} from "./core.js";
import type { GamePage } from "./game.js";
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
  game: GamePage;
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
  new (game: GamePage): ScienceManager;
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

export type PolicyBtnController = BuildingNotStackableBtnController<UnsafePolicyBtnModel> & {
  new (game: GamePage): PolicyBtnController;
  defaults: () => UnsafePolicyBtnModelDefaults;
  getMetadata: (model: UnsafePolicyBtnModel) => UnsafePolicy;
  getName: (model: UnsafePolicyBtnModel) => string;
  getPrices: (model: UnsafePolicyBtnModel) => Array<Price>;
  updateVisible: (model: UnsafePolicyBtnModel) => void;
  updateEnabled: (model: UnsafePolicyBtnModel) => void;
  shouldBeBought: (model: UnsafePolicyBtnModel, game: GamePage) => boolean;
  buyItem: (
    model: UnsafePolicyBtnModel,
    event?: undefined,
  ) => UnsafeBuyItemResult | UnsafeBuyItemResultDeferred;
  _buyItem_step2: (model: UnsafePolicyBtnModel) => void;
  onPurchase: (model: UnsafePolicyBtnModel) => void;
};

export type PolicyPanel = Panel<
  BuildingResearchBtn<
    {
      id: Policy;
      controller: PolicyBtnController;
    },
    PolicyBtnController,
    Policy
  >
> & {
  toggleResearchedSpan: HTMLSpanElement | null;
  toggleBlockedSpan: HTMLSpanElement | null;
  render: (container?: HTMLElement) => void;
  update: () => void;
};

export type TechButtonController = BuildingNotStackableBtnController<UnsafeTechButtonModel> & {
  new (game: GamePage): TechButtonController;
  defaults: () => UnsafeTechButtonModelDefaults;
  getMetadata: (model: UnsafeTechButtonModel) => UnsafeTech;
  getPrices: (model: UnsafeTechButtonModel) => Array<Price>;
  updateVisible: (model: UnsafeTechButtonModel) => void;
};

export type Library = Tab<
  unknown,
  BuildingResearchBtn<
    { id: Technology; controller: TechButtonController },
    TechButtonController,
    Technology
  >
> & {
  metaphysicsPanel: PrestigePanel | null;
  render: (tabContainer?: HTMLElement) => void;
  tdTop?: HTMLTableCellElement;
  policyPanel?: PolicyPanel;
  detailedPollutionInfo?: HTMLSpanElement;
  update: () => void;
  new (tabName: unknown, game: GamePage): Library;
  createTechBtn: (
    tech: UnsafeTech,
  ) => BuildingResearchBtn<
    { id: Technology; controller: TechButtonController },
    TechButtonController,
    Technology
  >;
};

export type UnsafePolicy = {
  blocked: boolean;
  blocks: Array<Policy>;
  calculateEffects: (self: unknown, game: GamePage) => void;
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
  unlocks: Partial<Unlocks>;
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
> = UnsafePolicyBtnModelDefaults & UnsafeBuildingBtnModel<TModelOptions>;

export type UnsafeTechButtonModelDefaults = {
  tooltipName: boolean;
  simplePrices: boolean;
} & UnsafeButtonModernModelDefaults;

export type UnsafeTechButtonModel<
  TModelOptions extends Record<string, unknown> | undefined = undefined,
> = UnsafeTechButtonModelDefaults & UnsafeBuildingBtnModel<TModelOptions>;
