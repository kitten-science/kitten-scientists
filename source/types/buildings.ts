import type { AnyFunction } from "@oliversalzburg/js-utils/core.js";
import type {
  AllBuildingStackableBtnOptions,
  BuildingStackableBtn,
  BuildingStackableBtnController,
  ButtonModern,
  ButtonModernController,
  Tab,
  TabManager,
  UnsafeBuildingBtnModernModel,
  UnsafeButtonModernModel,
  UnsafeLinkResult,
} from "./core.js";
import type { GamePage } from "./game.js";
import type { Building, BuildingEffect, Price, UnsafeBuyItemResult } from "./index.js";

export type Metadata<TMeta extends Record<string, unknown> | unknown = unknown> = {
  meta: TMeta;
  new (meta: TMeta): Metadata<TMeta>;
  getMeta(): TMeta;
  get<TAttr extends keyof TMeta>(attr: TAttr): TMeta[TAttr];
  set<TAttr extends keyof TMeta>(attr: TAttr, val: TMeta[TAttr]): void;
};

export type BuildingMeta<
  TMeta extends UnsafeBuilding = UnsafeBuilding,
  TMetaCache = TMeta extends { stages: Array<infer S> } ? TMeta & S : TMeta,
> = Metadata<TMeta> & {
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
  buildingsData: Array<UnsafeBuilding>;
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
  game: GamePage;
  gatherCatnip: () => void;
  /** @deprecated Use `getBuildingExt()` instead. */
  get: (name: Building) => UnsafeBuilding;
  getAutoProductionRatio: () => number;
  getBuildingExt: (name: Building) => BuildingMeta<UnsafeBuilding>;
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
  meta: [{ meta: Array<UnsafeBuilding> }];
  metaCache: Record<Building, BuildingMeta<UnsafeBuilding>>;
  new (game: GamePage): BuildingsManager;
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
  new (game: GamePage): GatherCatnipButtonController;
  buyItem: (model: unknown, event: unknown) => UnsafeBuyItemResult;
};
export type RefineCatnipButtonController = ButtonModernController & {
  new (game: GamePage): RefineCatnipButtonController;
  fetchModel: <TModel extends UnsafeRefineCatnipButtonModel = UnsafeRefineCatnipButtonModel>(
    options: unknown,
  ) => TModel;
  handleX100Click: <TModel extends UnsafeRefineCatnipButtonModel = UnsafeRefineCatnipButtonModel>(
    model: TModel,
  ) => void;
};

export type RefineCatnipButton = ButtonModern<UnsafeRefineCatnipButtonOptions> & {
  new (game: GamePage): RefineCatnipButton;
  x100Href: UnsafeLinkResult;
  update: () => void;
};

export type BuildingBtnModernController<
  TModel extends UnsafeBuildingBtnModernModel<AllBuildingStackableBtnOptions> | unknown = unknown,
> = BuildingStackableBtnController<TModel> & {
  getMetadata: (model: TModel) => BuildingMeta<UnsafeBuilding> | null;
  getName: (model: TModel) => string;
  getPrices: (model: TModel) => Array<Price>;
  hasSellLink: (model: TModel) => boolean;
  build: (model: TModel) => void;
  sell: (event: unknown, model: TModel) => void;
  decrementValue: (model: TModel) => void;
  incrementValue: (model: { metadata: Metadata<TModel>; metaAccessor: unknown }) => void;
};

export type StagingBldBtnController<
  TModel extends UnsafeBuildingBtnModernModel<AllBuildingStackableBtnOptions> | unknown = unknown,
> = BuildingBtnModernController<TModel> & {
  stageLinks: null;
  fetchModel: (options: unknown) => TModel;
  getEffects: (model: TModel) => unknown;
  getTotalEffects: (model: TModel) => unknown;
  getStageLinks: (model: TModel) => Array<UnsafeStageLink>;
  downgrade: (model: TModel) => void;
  upgrade: (model: TModel) => void;
  deltagrade: (model: TModel, delta: number) => void;
  getMetadataRaw: (model: TModel) => BuildingMeta<UnsafeBuilding>;
};

export type StagingBldBtn<TOpts extends AllBuildingStackableBtnOptions | unknown = unknown> =
  BuildingStackableBtn<TOpts> & {
    stageLinks: Array<unknown>;
    renderLinks: () => void;
  };

export type BuildingsModern = Tab<
  | ButtonModern<UnsafeGatherCatnipButtonOptions>
  | RefineCatnipButton
  | StagingBldBtn<AllBuildingStackableBtnOptions>
  | BuildingStackableBtn<AllBuildingStackableBtnOptions>
> & {
  bldGroups: Array<unknown>;
  activeGroup: null;
  new (tabName: unknown): BuildingsModern;
  render: (content?: HTMLElement) => void;
  renderActiveGroup: (groupContainer: unknown) => void;
  addCoreBtns: (container: unknown) => void;
  update: () => void;
};

export type UnsafeBuilding = {
  calculateEffects?: (model: unknown, game: GamePage) => void;
  defaultUnlockable?: boolean;
  description?: string;
  effects?: Partial<Record<BuildingEffect, number>>;
  flavor?: string;
  jammed?: boolean;
  label?: string;
  name: Building;
  on: number;
  priceRatio?: number;
  prices?: Array<Price>;
  stage?: number;
  stages?: Array<{
    calculateEffects?: (model: unknown, game: GamePage) => void;
    calculateEnergyProduction?: (game: GamePage, season: unknown) => void;
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

  noStackable?: boolean;
  isAutomationEnabled?: boolean | null;
  lackResConvert?: boolean;
  toggleable?: boolean;
};

export type UnsafeGatherCatnipButtonOptions = {
  name: string;
  controller: GatherCatnipButtonController;
  description: string;
  twoRow: boolean;
};

export type UnsafeUnstagedBuildingButtonOptions<
  TModel extends UnsafeBuildingBtnModernModel<AllBuildingStackableBtnOptions> | unknown = unknown,
> = {
  name: string;
  description: string;
  building: Building;
  twoRow: boolean;
  controller: BuildingBtnModernController<TModel>;
};

export type UnsafeRefineCatnipButtonOptions = {
  name: string;
  controller: RefineCatnipButtonController;
  handler: AnyFunction;
  description: string;
  prices: Array<Price>;
  twoRow: boolean;
};

export type UnsafeStagingBldButtonOptions<
  TModel extends UnsafeBuildingBtnModernModel<AllBuildingStackableBtnOptions> | unknown = unknown,
> = {
  name: string;
  description: string;
  building: Building;
  twoRow: boolean;
  controller: StagingBldBtnController<TModel>;
};

export type UnsafeRefineCatnipButtonModel = UnsafeButtonModernModel<{
  name: string;
  controller: RefineCatnipButtonController;
  handler: (btn: unknown) => void;
  description: string;
  prices: Array<Price>;
  twoRow: boolean;
}>;

export type UnsafeStageLink = { title: string; handler: AnyFunction; enabled: boolean };
