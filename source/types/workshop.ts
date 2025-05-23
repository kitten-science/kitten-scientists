import type {
  AllBuildingBtnOptions,
  BuildingNotStackableBtnController,
  BuildingResearchBtn,
  ButtonModern,
  ButtonModernController,
  Tab,
  TabManager,
  UnsafeBuildingBtnModernModel,
  UnsafeButtonModernModel,
  UnsafeButtonModernModelDefaults,
} from "./core.js";
import type { GamePage } from "./game.js";
import type {
  BuildingEffect,
  Link,
  Price,
  ResourceCraftable,
  Unlocks,
  UnsafeBuyItemResult,
  UnsafeMeta,
  Upgrade,
  ZebraUpgrade,
} from "./index.js";
import type { VillageManager } from "./village.js";

export type WorkshopManager = TabManager<
  UnsafeMeta<UnsafeUpgrade> | UnsafeMeta<UnsafeZebraUpgrade>
> & {
  game: GamePage;
  hideResearched: boolean;
  upgrades: Array<UnsafeUpgrade>;
  crafts: Array<UnsafeCraft>;
  zebraUpgrades: Array<UnsafeUpgrade>;
  effectsBase: {
    oilMax: number;
    scienceMax: number;
    cultureMax: number;
    faithMax: number;
  };
  metaCache: Record<string, unknown>;
  new (game: GamePage): WorkshopManager;
  get: (upgradeName: Upgrade) => UnsafeUpgrade;
  getCraft: (craftName: ResourceCraftable) => UnsafeCraft;
  getZebraUpgrade: (zebraUpgradeName: Upgrade) => UnsafeUpgrade;
  resetState: () => void;
  save: (saveData: unknown) => void;
  load: (saveData: unknown) => void;
  getCraftPrice: (craft: UnsafeCraft) => Array<Price>;
  craft: (
    res: ResourceCraftable,
    amt: number,
    suppressUndo: boolean,
    forceAll: boolean,
    bypassResourceCheck: boolean,
  ) => boolean;
  getConsumptionEngineers: () => Record<string, unknown>;
  getEffectEngineer: (resName: ResourceCraftable, afterCraft: boolean) => number;
  undo: (data: unknown) => void;
  getCraftAllCount: (craftName: ResourceCraftable) => number;
  _getCraftAllCountInternal: (recipe: unknown, prices: Array<Price>) => number;
  craftAll: (craftName: ResourceCraftable) => void;
  clearEngineers: () => void;
  update: () => void;
  fastforward: (daysOffset: number) => void;
  craftByEngineers: (times: number) => void;
  unlock: (upgrade: UnsafeUpgrade) => void;
  unlockAll: () => void;
};

export type UpgradeButtonController<
  TModel extends UnsafeBuildingBtnModernModel<AllBuildingBtnOptions> | unknown = unknown,
> = BuildingNotStackableBtnController<TModel> & {
  defaults: () => UnsafeUpgradeButtonModelDefaults;
  getMetadata: (model: UnsafeUpgradeButtonModel) => UnsafeUpgrade;
  getPrices: (model: unknown) => Array<Price>;
  updateVisible: (model: UnsafeUpgradeButtonModel) => void;
  onPurchase: (model: UnsafeUpgradeButtonModel) => void;
};

export type CraftButtonController = ButtonModernController & {
  defaults: () => UnsafeCraftButtonModelDefaults;
  initModel: (options: unknown) => UnsafeCraftButtonModel;
  getCraft: (model: UnsafeCraftButtonModel) => UnsafeCraft;
  updateVisible: (model: UnsafeCraftButtonModel) => void;
  getName: (model: UnsafeCraftButtonModel) => string;
  getDescription: (model: UnsafeCraftButtonModel) => string;
  assignCraftJob: (model: UnsafeCraftButtonModel, value: number) => void;
  unassignCraftJob: (model: UnsafeCraftButtonModel, value: number) => void;
  fetchModel: (options: unknown) => UnsafeCraftButtonModel;
  buyItem: (model: UnsafeCraftButtonModel, event: unknown) => UnsafeBuyItemResult;
};

export type CraftButton = ButtonModern<UnsafeCraftButtonOptions> & {
  craftName: ResourceCraftable;
  new (opts: { craft: ResourceCraftable }, game: unknown): CraftButton;
  setEnabled: (enabled: unknown) => void;
  renderLinks: () => void;
};

export type ZebraUpgradeButtonController<
  TModel extends UnsafeZebraUpgradeButtonModel | unknown = unknown,
> = BuildingNotStackableBtnController<TModel> & {
  defaults: () => UnsafeZebraUpgradeButtonModelDefaults;
  getMetadata: (model: UnsafeZebraUpgradeButtonModel) => UnsafeUpgrade;
  getPrices: (model: unknown) => ReturnType<VillageManager["getEffectLeader"]>;
  updateVisible: (model: UnsafeZebraUpgradeButtonModel) => void;
};

export type Workshop = Tab<
  unknown,
  | BuildingResearchBtn<UnsafeUpgradeButtonOptions>
  | BuildingResearchBtn<UnsafeZebraUpgradeButtonOptions>
> & {
  tdTop: HTMLTableCellElement | null;
  craftBtns: Array<CraftButton>;
  resTd: HTMLTableCellElement | null;
  consumptionTd: HTMLTableCellElement | null;
  new (tabName: unknown, game: GamePage): Workshop;
  render: (tabContainer?: HTMLElement) => void;
  renderResources: (container: HTMLElement) => void;
  renderConsumption: (container: HTMLElement) => void;
  createBtn: (upgrade: UnsafeUpgrade) => BuildingResearchBtn<UnsafeUpgradeButtonOptions>;
  createZebraUpgradeBtn: (
    upgrade: UnsafeUpgrade,
  ) => BuildingResearchBtn<UnsafeZebraUpgradeButtonOptions>;
  update: () => void;
  updateTab: () => void;
};

export type UnsafeUpgrade = {
  name: Upgrade;
  label: string;
  description: string;
  effects?: Partial<Record<BuildingEffect, number>>;
  prices: Array<Price>;
  unlocks?: Partial<Unlocks>;
  upgrades?: Partial<Unlocks>;

  researched?: boolean;
  unlocked?: boolean;
};

export type UnsafeZebraUpgrade = {
  name: ZebraUpgrade;
  label: string;
  description: string;
  effects?: Partial<Record<BuildingEffect, number>>;
  prices: Array<Price>;
  unlocks?: Partial<Unlocks>;
  upgrades?: Partial<Unlocks>;

  researched?: boolean;
  unlocked?: boolean;
};

export type UnsafeCraft = {
  name: ResourceCraftable;
  label: string;
  description: string;
  prices: Array<Price>;
  ignoreBonuses?: boolean;
  progressHandicap: number;
  tier: number;
  unlocked?: boolean;
};

export type UnsafeUpgradeButtonOptions = {
  id: Upgrade;
  controller: UpgradeButtonController<UnsafeBuildingBtnModernModel<AllBuildingBtnOptions>>;
};

export type UnsafeZebraUpgradeButtonOptions = {
  id: Upgrade;
  controller: ZebraUpgradeButtonController<UnsafeZebraUpgradeButtonModel>;
};

export type UnsafeCraftButtonOptions = {
  name: string;
  description: string;
  craft: ResourceCraftable;
  prices: Array<Price>;
  controller: CraftButtonController;
};

export type UnsafeUpgradeButtonModelDefaults = {
  tooltipName: boolean;
  simplePrices: boolean;
} & UnsafeButtonModernModelDefaults;

export type UnsafeUpgradeButtonModel<
  TModelOptions extends Record<string, unknown> | undefined = undefined,
> = UnsafeUpgradeButtonModelDefaults & UnsafeButtonModernModel<TModelOptions> & {};

export type UnsafeCraftButtonModelDefaults = {
  tooltipName: boolean;
  simplePrices: boolean;
} & UnsafeButtonModernModelDefaults;

export type UnsafeCraftButtonModel<
  TModelOptions extends Record<string, unknown> | undefined = undefined,
> = UnsafeCraftButtonModelDefaults &
  UnsafeButtonModernModel<TModelOptions> & {
    craft: UnsafeCraft;
    assignCraftLinks?: Array<Link>;
    unassignCraftLinks?: Array<Link>;
  };

export type UnsafeZebraUpgradeButtonModelDefaults = {
  tooltipName: boolean;
  simplePrices: boolean;
} & UnsafeButtonModernModelDefaults;

export type UnsafeZebraUpgradeButtonModel<
  TModelOptions extends Record<string, unknown> | undefined = undefined,
> = UnsafeZebraUpgradeButtonModelDefaults & UnsafeBuildingBtnModernModel<TModelOptions> & {};
