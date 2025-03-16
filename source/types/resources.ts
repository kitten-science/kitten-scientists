import type { TabManager } from "./core.js";
import type { GamePage } from "./game.js";
import type { BuildingEffect, Price, Resource } from "./index.js";
import type { Village } from "./village.js";

export type ResourceManager = TabManager & {
  resourceData: Array<UnsafeResource>;
  resources: Array<UnsafeResource>;
  village: Village;
  game: GamePage;
  energyProd: number;
  energyWinterProd: number;
  energyCons: number;
  isLocked: boolean;
  /**
   * Whether to show stuff like flux, gflops, & pseudo-resources
   */
  showHiddenResources: boolean;
  /**
   * Array of names of pseudo-resources to mark as hidden
   */
  hiddenPseudoResources: Array<unknown>;
  new (game: GamePage): ResourceManager;
  resourceMap: Record<Resource, UnsafeResource & { value: number; unlocked: boolean }>;
  get: (name: Resource) => Required<ResourceManager["resourceMap"][Resource]>;
  getPseudoResources: () => Array<UnsafeResource>;
  createResource: (name: Resource) => UnsafeResource;
  addRes: (
    res: UnsafeResource,
    addedValue: number,
    allowDuringParadoxes: boolean,
    preventLimitCheck: boolean,
  ) => number;
  addResPerTick: (name: Resource, value: number) => ReturnType<ResourceManager["addRes"]>;
  addResEvent: (name: Resource, value: number) => ReturnType<ResourceManager["addRes"]>;
  getAmtDependsOnStock: (from: Array<{ res: Resource; amt: number }>, amt: number) => number;
  update: () => void;
  updateMaxValue: (res: UnsafeResource) => void;
  updateMaxValueByName: (resName: Resource) => void;
  getEnergyProductionRatio: () => number;
  getEnergyConsumptionRatio: () => number;
  fastforward: (daysOffset: number) => Partial<Record<Resource, number>>;
  enforceLimits: (limits: Partial<Record<Resource, number>>) => void;
  resConsHackForResTable: () => void;
  addBarnWarehouseRatio: <TEffects extends Partial<Record<BuildingEffect, number>>>(
    effects: TEffects,
  ) => TEffects;
  addResMaxRatios: (res: UnsafeResource, maxValue: number) => number;
  setVillage: (village: unknown) => void;
  reset: () => void;
  resetState: () => void;
  save: (saveData: unknown) => void;
  load: (saveData: unknown) => void;
  hasRes: (prices: Array<Price>, amt?: number) => boolean;
  isStorageLimited: (prices: Array<Price>) => boolean;
  payPrices: (prices: Array<Price>) => void;
  maxAll: () => void;
  getEnergyDelta: () => number;
  getVoidQuantity: () => number;
  getVoidQuantityStatistically: () => number;
  setDisplayAll: () => void;
  setResourceIsHidden: (resName: Resource, hide: boolean) => void;
  toggleLock: () => void;
  isNormalCraftableResource: (res: UnsafeResource) => boolean;
};

export type UnsafeResource = {
  name: Resource;
  title: string;
  type: "common" | "uncommon" | "rare" | "exotic";
  craftable?: boolean;
  visible: boolean;
  calculatePerTick: boolean;
  aiCanDestroy: boolean;
  color?: string;
  tag?: "baseMetal" | "metallurgist" | "chemist";
  isNotRefundable?: boolean;
  transient?: boolean;
  calculateOnYear?: boolean;
  calculatePerTickAndDay?: boolean;
  isRefundable?: (game: GamePage) => boolean;
  persists?: boolean;
  maxValue?: number;
  unlocked?: boolean;
  value?: number;
  isHidden?: boolean;
  isHiddenFromCrafting?: boolean;
};
