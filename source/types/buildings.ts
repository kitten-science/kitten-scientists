import type { AnyFunction } from "@oliversalzburg/js-utils/core.js";
import type {
  BuildingStackableBtn,
  BuildingStackableBtnController,
  ButtonModern,
  ButtonModernController,
  Tab,
  TabManager,
  UnsafeBuildingBtnModel,
  UnsafeLinkResult,
} from "./core.js";
import type { Game } from "./game.js";
import type { Building, BuildingEffect, Price, UnsafeBuyItemResult } from "./index.js";

export type Metadata<TMeta extends Record<string, unknown> = Record<string, unknown>> = {
  meta: TMeta;
  new (meta: TMeta): Metadata;
  getMeta(): TMeta;
  get<TAttr extends keyof TMeta>(attr: TAttr): TMeta[TAttr];
  set<TAttr extends keyof TMeta>(attr: TAttr, val: TMeta[TAttr]): void;
};

export type BuildingMeta<TMetaCache extends Record<string, unknown> = Record<string, unknown>> =
  Metadata<TMetaCache> & {
    _metaCache: TMetaCache;
    _metaCacheStage: number;

    getMeta(): TMetaCache;
    get<TAttr extends keyof TMetaCache>(attr: TAttr): TMetaCache[TAttr];
    set<TAttr extends keyof TMetaCache>(attr: TAttr, val: TMetaCache[TAttr]): void;
  };

export type BuildingsManager = TabManager & {
  buildingGroups: Array<{
    name: string;
    title: string;
    buildings: Array<Building>;
  }>;
  buildingsData: Array<UnsafeBuildingMeta>;
  cacheCathPollutionPerTick: () => void;
  calculatePollutionEffects: () => void;
  cathPollution: number;
  cathPollutionFastForward: (ticks: number, simplified: boolean) => void;
  cathPollutionPerTick: number;
  devAddStorage: () => void;
  effectsBase: Record<
    | "catnipMax"
    | "woodMax"
    | "mineralsMax"
    | "coalMax"
    | "ironMax"
    | "titaniumMax"
    | "goldMax"
    | "oilMax"
    | "uraniumMax"
    | "unobtainiumMax"
    | "antimatterMax"
    | "manpowerMax"
    | "scienceMax"
    | "cultureMax"
    | "faithMax"
    | "hutFakeBought"
    | "logHouseFakeBought"
    | "mansionFakeBought",
    number
  >;
  fastforward: (daysOffset: number) => void;
  game: Game;
  gatherCatnip: () => void;
  /** @deprecated Use `getBuildingExt()` instead. */
  get: (name: Building) => BuildingMeta;
  getAutoProductionRatio: () => number;
  getBuildingExt: (name: Building) => UnsafeBuildingExt;
  getCleanEnergy: () => number;
  getCleanEnergyProdRatio: () => number;
  getDetailedPollutionInfo: () => string;
  getEffect: (effectName: BuildingEffect) => number;
  /**
   * returns pollution value at which pollutionDissipationRatio will make pollutionPerTick equal to 0, or -1 if such value doesn't exits
   */
  getEquilibriumPollution: () => number;
  getPollutingEnergy: () => number;
  getPollutionLevel: () => number;
  getPollutionLevelBase: () => number;
  getPollutionRatio: () => number;
  getPriceRatio: (bld: Building) => number;
  getPriceRatioWithAccessor: (bld: Building) => number;
  getPrices: (bldName: Building, additionalBought: number) => Array<Price>;
  getPricesWithAccessor: (bldName: Building, additionalBought: number) => Array<Price>;
  getUndissipatedPollutionPerTick: () => number;
  gflopsFastForward: (ticks: number) => void;
  groupBuildings: boolean;
  isUnlockable: (building: Building) => boolean;
  isUnlocked: (building: Building) => boolean;
  load: (saveData: unknown) => void;
  meta: [{ meta: Array<BuildingMeta> }];
  metaCache: unknown;
  new (game: Game): BuildingsManager;
  pollutionEffects: Record<
    | "catnipPollutionRatio"
    | "pollutionHappines"
    | "solarRevolutionPollution"
    | "pollutionDissipationRatio"
    | "pollutionArrivalSlowdown",
    number
  >;
  refineCatnip: () => void;
  resetState: () => void;
  save: (saveData: unknown) => void;
  setEffectsCachedExisting: () => void;
  setEquilibriumPollution: () => void;
  twoRows: boolean;
  undo: (data: unknown) => void;
  update: () => void;
};

export type GatherCatnipButtonController = ButtonModernController & {
  new (game: Game): GatherCatnipButtonController;
  buyItem: (model: unknown, event: unknown) => UnsafeBuyItemResult;
};
export type RefineCatnipButtonController = ButtonModernController & {
  new (game: Game): RefineCatnipButtonController;
  fetchModel: <TModel extends UnsafeRefineCatnipButtonModel = UnsafeRefineCatnipButtonModel>(
    options: unknown,
  ) => TModel;
  handleX100Click: <TModel extends UnsafeRefineCatnipButtonModel = UnsafeRefineCatnipButtonModel>(
    model: TModel,
  ) => void;
};

export type RefineCatnipButton = ButtonModern<
  UnsafeRefineCatnipButtonModel,
  undefined,
  RefineCatnipButtonController
> & {
  new (game: Game): RefineCatnipButton;
  x100Href: UnsafeLinkResult;
  update: () => void;
};

export type BuildingBtnModernController<
  TModelMetadata extends Record<string, unknown> = Record<string, unknown>,
  TModel extends UnsafeBuildingBtnModel<TModelMetadata> = UnsafeBuildingBtnModel<TModelMetadata>,
> = BuildingStackableBtnController<TModelMetadata, TModel> & {
  getMetadata: (model: TModel) => TModelMetadata | null;
  getName: (model: TModel) => string;
  getPrices: (model: TModel) => Array<Price>;
  hasSellLink: (model: TModel) => boolean;
  build: (model: TModel, opts: unknown) => void;
  sell: (event: unknown, model: TModel) => void;
  decrementValue: (model: TModel) => void;
  incrementValue: (model: TModel) => void;
};

export type StagingBldBtnController = BuildingBtnModernController & {
  stageLinks: null;
  fetchModel: <
    TModelMetadata extends Record<string, unknown> = Record<string, unknown>,
    TModel extends UnsafeBuildingBtnModel<TModelMetadata> = UnsafeBuildingBtnModel<TModelMetadata>,
  >(
    options: unknown,
  ) => TModel;
  getEffects: <
    TModelMetadata extends Record<string, unknown> = Record<string, unknown>,
    TModel extends UnsafeBuildingBtnModel<TModelMetadata> = UnsafeBuildingBtnModel<TModelMetadata>,
  >(
    model: TModel,
  ) => unknown;
  getTotalEffects: <
    TModelMetadata extends Record<string, unknown> = Record<string, unknown>,
    TModel extends UnsafeBuildingBtnModel<TModelMetadata> = UnsafeBuildingBtnModel<TModelMetadata>,
  >(
    model: TModel,
  ) => unknown;
  getStageLinks: <
    TModelMetadata extends Record<string, unknown> = Record<string, unknown>,
    TModel extends UnsafeBuildingBtnModel<TModelMetadata> = UnsafeBuildingBtnModel<TModelMetadata>,
  >(
    model: TModel,
  ) => Array<UnsafeStageLink>;
  downgrade: <
    TModelMetadata extends Record<string, unknown> = Record<string, unknown>,
    TModel extends UnsafeBuildingBtnModel<TModelMetadata> = UnsafeBuildingBtnModel<TModelMetadata>,
  >(
    model: TModel,
  ) => void;
  upgrade: <
    TModelMetadata extends Record<string, unknown> = Record<string, unknown>,
    TModel extends UnsafeBuildingBtnModel<TModelMetadata> = UnsafeBuildingBtnModel<TModelMetadata>,
  >(
    model: TModel,
  ) => void;
  deltagrade: <
    TModelMetadata extends Record<string, unknown> = Record<string, unknown>,
    TModel extends UnsafeBuildingBtnModel<TModelMetadata> = UnsafeBuildingBtnModel<TModelMetadata>,
  >(
    model: TModel,
    delta: number,
  ) => void;
  getMetadataRaw: <
    TModelMetadata extends Record<string, unknown> = Record<string, unknown>,
    TModel extends UnsafeBuildingBtnModel<TModelMetadata> = UnsafeBuildingBtnModel<TModelMetadata>,
  >(
    model: TModel,
  ) => TModelMetadata;
};

export type StagingBldBtn<
  TModel extends UnsafeBuildingBtnModel<TModelOptions> | undefined = undefined,
  TModelOptions extends Record<string, unknown> | undefined = TModel extends Record<string, unknown>
    ? TModel["options"]
    : undefined,
  TController extends ButtonModernController | undefined = undefined,
  TId extends string | undefined = undefined,
> = BuildingStackableBtn<TModel, TModelOptions, TController, TId> & {
  stageLinks: Array<unknown>;
  renderLinks: () => void;
};

export type BuildingsModern = Tab<
  | ButtonModern
  | RefineCatnipButton
  | BuildingStackableBtn<
      UnsafeBuildingBtnModel<UnsafeBuildingMeta>,
      UnsafeBuildingMeta,
      BuildingBtnModernController
    >
  | StagingBldBtn<
      UnsafeBuildingBtnModel<UnsafeBuildingMeta>,
      UnsafeBuildingMeta,
      StagingBldBtnController
    >
> & {
  bldGroups: Array<unknown>;
  activeGroup: null;
  new (tabName: unknown): BuildingsModern;
  render: (content: unknown) => void;
  renderActiveGroup: (groupContainer: unknown) => void;
  addCoreBtns: (container: unknown) => void;
  update: () => void;
};

export type UnsafeBuildingExt = {
  meta: BuildingMeta & UnsafeBuildingMeta;
};

/**
 * Is not registered as an actual class in KG.
 * Values inferred from BuildingsManager.buildingsData
 */
export type UnsafeBuildingMeta = {
  calculateEffects?: (model: unknown, game: Game) => void;
  description?: string;
  effects?: Partial<Record<BuildingEffect, number>>;
  flavor?: string;
  label?: string;
  name: Building;
  noStackable?: boolean;
  on: number;
  priceRatio?: number;
  prices?: Array<Price>;
  stage?: number;
  stages?: Array<{
    calculateEffects?: (model: unknown, game: Game) => void;
    calculateEnergyProduction?: (game: Game, season: unknown) => void;
    description: string;
    effects?: Partial<Record<BuildingEffect, number>>;
    flavor?: string;
    label: string;
    priceRatio: number;
    prices: Array<Price>;
    stageUnlocked: boolean;
  }>;
  unlockRatio?: number;
  unlockable?: boolean;
  unlocked: boolean;

  /**
   * How many of these do you have?
   */
  val: number;
};

export type UnsafeRefineCatnipButtonModel<
  TController extends RefineCatnipButtonController | undefined = RefineCatnipButtonController,
> = {
  name: string;
  controller: TController;
  handler: (btn: unknown) => void;
  description: string;
  prices: Array<Price>;
  twoRow: boolean;
};

export type UnsafeStageLink = { title: string; handler: AnyFunction; enabled: boolean };
