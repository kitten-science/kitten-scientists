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
  UnsafeBuildingStackableBtnModel,
  UnsafeButtonModernModel,
} from "./core.js";
import type { GamePage } from "./game.js";
import type {
  BuildingEffect,
  BuyItemResultReason,
  ChronoForgeUpgrade,
  Link,
  Price,
  QueueElementType,
  Unlocks,
  UnsafeBuyItemResult,
  UnsafeMeta,
  VoidSpaceUpgrade,
} from "./index.js";

export type TimeManager = TabManager<
  UnsafeMeta<UnsafeChronoForgeUpgrade> | UnsafeMeta<UnsafeVoidSpaceUpgrade>
> & {
  game: GamePage;
  /**
   * 0 is current function call, 1 is shatterInGroupCycles, 2 is shatterInCycles (deprecated)
   */
  testShatter: number;
  /*
   * Amount of years skipped by CF time jumps
   */
  flux: number;
  /**
   * should not be visible to player other than on time tab
   */
  heat: number;
  isAccelerated: boolean;
  timestamp: null;
  queue: Manager;
  new (game: GamePage): TimeManager;
  save: (saveData: unknown) => void;
  _forceChronoFurnaceStop: (cfuSave: Array<unknown>) => void;
  load: (saveData: unknown) => void;
  gainTemporalFlux: (timestamp: number) => void;
  resetState: () => void;
  update: () => void;
  updateQueue: () => void;
  applyRedshift: (daysOffset: number, ignoreCalendar: boolean) => number;
  calculateRedshift: () => void;
  chronoforgeUpgrades: Array<UnsafeChronoForgeUpgrade>;
  voidspaceUpgrades: Array<UnsafeVoidSpaceUpgrade>;
  effectsBase: {
    heatPerTick: number;
    heatMax: number;
    temporalFluxMax: number;
  };
  getCFU: (id: ChronoForgeUpgrade) => Required<UnsafeChronoForgeUpgrade>;
  getVSU: (id: VoidSpaceUpgrade) => Required<UnsafeVoidSpaceUpgrade>;
  shatter: (amt: number) => void;
  shatterInCycles: (amt: number) => void;
  shatterInGroupCycles: (amt: number) => void;
  compareShatterTime: (
    shatters: number,
    times: number,
    ignoreOldFunction: boolean,
    ignoreShatterInCycles: boolean,
    ignoreGroupCycles: boolean,
  ) => void;
  unlockAll: () => void;
};

export type AccelerateTimeBtnController = ButtonModernController & {
  fetchModel: (options: unknown) => ReturnType<ButtonModernController["fetchModel"]> & {
    toggle: { title: string; tooltip: string; cssClass: string; handler: () => void };
  };
  buyItem: (model: unknown, event: unknown) => UnsafeBuyItemResult;
};

export type AccelerateTimeBtn = ButtonModern<UnsafeAccelerateTimeButtonOptions> & {
  renderLinks: () => void;
  toggle?: Link;
  update: () => void;
};

export type TimeControlWgt = IChildrenAware<AccelerateTimeBtn> &
  IGameAware & {
    new (game: GamePage): TimeControlWgt;
    render: (container?: HTMLElement) => void;
    update: () => void;
  };

export type ShatterTCBtnController = ButtonModernController<UnsafeShatterTCBtnModel> & {
  defaults: () => ReturnType<ButtonModernController["defaults"]> & { hasResourceHover: boolean };
  fetchModel: (options: unknown) => UnsafeShatterTCBtnModel;
  _newLink: (model: UnsafeShatterTCBtnModel) => Link;
  getName: (model: UnsafeShatterTCBtnModel) => string;
  getPrices: (model: UnsafeShatterTCBtnModel) => Array<Price>;
  getPricesMultiple: (
    model: UnsafeShatterTCBtnModel,
    amt: number,
  ) => {
    void: number;
    timeCrystal: number;
  };
  buyItem: (model: UnsafeShatterTCBtnModel, event: unknown) => UnsafeBuyItemResult;
  doShatterAmt: (model: UnsafeShatterTCBtnModel, amt: number) => void;
  doShatter: (model: unknown, amt: number) => void;
  updateVisible: (model: UnsafeShatterTCBtnModel) => void;
};

export type ShatterTCBtn = ButtonModern<{
  name: string;
  description: string;
  prices: Array<Price>;
  controller: ShatterTCBtnController;
}> & {
  renderLinks: () => void;
  tenEras?: Link;
  previousCycle?: Link;
  nextCycle?: Link;
  custom?: Link;
  update: () => void;
};

export type ChronoforgeBtnController<
  TModel extends
    UnsafeBuildingStackableBtnModel<UnsafeChronoforgeUpgradeButtonOptions> = UnsafeBuildingStackableBtnModel<UnsafeChronoforgeUpgradeButtonOptions>,
> = BuildingStackableBtnController<TModel> & {
  getMetadata: (model: TModel) => UnsafeChronoForgeUpgrade;
  getName: (model: TModel) => string;
  handleToggleAutomationLinkClick: (model: TModel) => void;
};

export type ChronoforgeWgt = IChildrenAware<
  ShatterTCBtn | BuildingStackableBtn<UnsafeChronoforgeUpgradeButtonOptions>
> &
  IGameAware & {
    new (game: GamePage): ChronoforgeWgt;
    render: (container?: HTMLElement) => void;
    update: () => void;
  };

export type VoidSpaceBtnController<
  TModel extends
    UnsafeBuildingStackableBtnModel<UnsafeVoidSpaceUpgradeButtonOptions> = UnsafeBuildingStackableBtnModel<UnsafeVoidSpaceUpgradeButtonOptions>,
> = BuildingStackableBtnController<TModel> & {
  getMetadata: (model: TModel) => UnsafeVoidSpaceUpgrade;
  getName: (model: TModel) => string;
  getPrices: (model: TModel) => Array<Price>;
};

export type FixCryochamberBtnController = ButtonModernController<UnsafeFixCryochamberBtnModel> & {
  defaults: () => UnsafeFixCryochamberBtnModel;
  buyItem: (model: UnsafeFixCryochamberBtnModel, event: Event) => UnsafeBuyItemResult;
  doFixCryochamber: (model: UnsafeFixCryochamberBtnModel) => boolean;
  updateVisible: (model: UnsafeFixCryochamberBtnModel) => void;
  getDescription: (model: unknown) => string;
  getPrices: (model: UnsafeFixCryochamberBtnModel) => Array<Price>;
};

export type VoidSpaceWgt = IChildrenAware<
  | ButtonModern<UnsafeFixCryochamberButtonOptions>
  | BuildingStackableBtn<UnsafeVoidSpaceUpgradeButtonOptions>
> &
  IGameAware & {
    new (game: GamePage): VoidSpaceWgt;
    render: (container?: HTMLElement) => void;
    update: () => void;
  };

export type ResetWgt = IChildrenAware<
  ButtonModern<{
    name: string;
    description: string;
    prices: Array<Price>;
    handler: AnyFunction;
    controller: ButtonModernController;
  }>
> &
  IGameAware & {
    new (game: GamePage): ResetWgt;
    render: (container?: HTMLElement) => void;
    update: () => void;
  };

export type TimeTab = Tab<
  Panel<TimeControlWgt> | Panel<ResetWgt> | Panel<ChronoforgeWgt> | Panel<VoidSpaceWgt>
> & {
  container: null;
  new (tabName: unknown): TimeTab;
  resetPanel: Panel;
  /**
   * Chronoforge panel.
   */
  cfPanel: Panel<ChronoforgeWgt>;
  /**
   * Void space panel
   */
  vsPanel: Panel<VoidSpaceWgt>;
  render: (content?: HTMLElement) => void;
  update: () => void;
};

export type Manager = {
  game: GamePage;
  alphabeticalSort: boolean;
  queueItems: Array<unknown>;
  toggleAlphabeticalSort: () => void;
  getFirstItemEtaDay: () => [number, boolean];
  updateQueueSourcesArr: () => void;
  queueLabels: Record<string, string>;
  queueSourcesArr: Array<{ name: string; label: string }>;
  queueSourcesDefault: Record<string, boolean>;
  queueSources: Record<string, unknown>;
  queueNonStackable: Array<string>;
  unlockQueueSource: () => void;
  cap: number;
  baseCap: number;
  new (game: GamePage): Manager;
  resetState: () => void;
  calculateCap: () => number;
  queueLength: () => number;
  addToQueue: (name: string, type: unknown, label: string, shiftKey: boolean) => void;
  remove: (index: number, amt: number) => boolean;
  pushBack: (index: number) => boolean;
  pushFront: (index: number) => boolean;
  getQueueOptions: (type: unknown) => unknown;
  getQueueOptionsAlphabetical: (type: unknown) => unknown;
  getQueueOptionsUnsorted: (type: unknown) => unknown;
  dropLastItem: () => void;
  listDrop: (event: unknown) => void;
  getQueueElementModel: (el: unknown) => unknown;
  getQueueElementControllerAndModel: (el: { name: unknown; type: QueueElementType }) => {
    controller: ButtonModernController;
    model: UnsafeButtonModernModel;
  };
  update: () => void;
  _isReasonToSkipItem: (reason: BuyItemResultReason) => boolean;
  onDeltagrade: (itemName: string) => void;
};
export type QueueTab = Tab & {};

export type UnsafeChronoForgeUpgrade = {
  name: ChronoForgeUpgrade;
  /**
   * An internationalized label for this time upgrade.
   */
  label: string;
  /**
   * An internationalized description for this space building.
   */
  description: string;
  prices: Array<Price>;
  effects: Partial<Record<BuildingEffect, number>>;
  priceRatio: number;
  unlocked: boolean;
  heat?: number;
  action?: (self: UnsafeChronoForgeUpgrade, game: GamePage) => void;
  unlocks?: Partial<Unlocks>;
  calculateEffects?: (self: UnsafeChronoForgeUpgrade, game: GamePage) => void;
  updateEffects?: (self: UnsafeChronoForgeUpgrade, game: unknown) => void;

  /**
   * This flag is set by KS itself to "hide" a given build from being
   * processed in the BulkManager. This is likely not ideal and will
   * be refactored later.
   */
  tHidden?: boolean;

  val?: number;
  on?: number;
  noStackable?: boolean;
  isAutomationEnabled?: boolean | null;
  lackResConvert?: boolean;
  toggleable?: boolean;
};

export type UnsafeVoidSpaceUpgrade = {
  name: VoidSpaceUpgrade;
  /**
   * An internationalized label for this time upgrade.
   */
  label: string;
  /**
   * An internationalized description for this space building.
   */
  description: string;
  prices: Array<Price>;
  priceRatio: number;
  limitBuild?: 0;
  breakIronWill?: boolean;
  fixPrices?: Array<Price>;
  unlocked: boolean;
  flavor?: string;
  effects: Partial<Record<BuildingEffect, number>>;
  upgrades?: {
    voidSpace: Array<"cryochambers">;
  };
  unlockScheme?: { name: "arctic" | "dune" | "fluid" | "space" | "vessel"; threshold: number };

  /**
   * This flag is set by KS itself to "hide" a given build from being
   * processed in the BulkManager. This is likely not ideal and will
   * be refactored later.
   */
  tHidden?: boolean;

  val?: number;
  on?: number;
  noStackable?: boolean;
  isAutomationEnabled?: boolean | null;
  lackResConvert?: boolean;
  toggleable?: boolean;
};

export type UnsafeFixCryochamberButtonOptions = {
  name: string;
  description: string;
  controller: FixCryochamberBtnController;
};

export type UnsafeResetButtonOptions = {
  name: string;
  description: string;
  prices: Array<Price>;
  handler: AnyFunction;
  controller: ButtonModernController;
};

export type UnsafeShatterTCButtonOptions = {
  name: string;
  description: string;
  prices: Array<Price>;
  controller: ShatterTCBtnController;
};

export type UnsafeChronoforgeUpgradeButtonOptions = {
  id: ChronoForgeUpgrade;
  controller: ChronoforgeBtnController;
};

export type UnsafeVoidSpaceUpgradeButtonOptions = {
  id: VoidSpaceUpgrade;
  controller: VoidSpaceBtnController;
};

export type UnsafeAccelerateTimeButtonOptions = {
  name: string;
  description: string;
  prices: Array<Price>;
  controller: AccelerateTimeBtnController;
};

export type UnsafeShatterTCBtnModel = UnsafeButtonModernModel & {
  nextCycleLink: Link;
  previousCycleLink: Link;
  tenErasLink: Link;
  customLink?: Link;
};

export type UnsafeFixCryochamberBtnModel = UnsafeButtonModernModel<{
  name: string;
  description: string;
}> & {
  hasResourceHover: boolean;
};
