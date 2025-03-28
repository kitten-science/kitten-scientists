import type { AnyFunction } from "@oliversalzburg/js-utils/core.js";
import type {
  BuildingNotStackableBtnController,
  ButtonModernController,
  Panel,
  TabManager,
  UnsafeBuildingBtnModel,
  UnsafeButtonModel,
} from "./core.js";
import type { GamePage } from "./game.js";
import type { Perk, Price, Unlocks, UnsafeBuyItemResult } from "./index.js";

export type PrestigeManager = TabManager<Array<UnsafePerk>> & {
  perks: Array<UnsafePerk>;
  game: GamePage;
  new (game: GamePage): PrestigeManager;
  resetState: () => void;
  save: (saveData: unknown) => void;
  load: (saveData: unknown) => void;
  update: () => void;
  getPerk: (name: string) => UnsafePerk;
  getSpentParagon: () => number;
  getParagonRatio: () => number;
  getBurnedParagonRatio: () => number;
  getParagonProductionRatio: () => number;
  getParagonStorageRatio: () => number;
  unlockAll: () => void;
};

export type PrestigeBtnController = BuildingNotStackableBtnController & {
  getMetadata: <TButtonModel extends UnsafeBuildingBtnModel>(model: TButtonModel) => UnsafePerk;
  buyItem: (model: unknown, event: unknown) => UnsafeBuyItemResult;
  updateVisible: <TButtonModel extends UnsafeBuildingBtnModel>(model: TButtonModel) => void;
};

export type BurnParagonBtnController = ButtonModernController & {
  updateVisible: <TButtonModel extends UnsafeButtonModel>(model: TButtonModel) => void;
};

export type TurnHGOffButtonController = ButtonModernController & {
  updateVisible: <TButtonModel extends UnsafeButtonModel>(model: TButtonModel) => void;
};

export type PrestigePanel = Panel & {
  game: null;
  new (): PrestigePanel;
  render: (container?: HTMLElement) => void;
};

export type UnsafePerk = {
  name: Perk;
  label: string;
  description: string;
  prices: Array<Price>;
  unlocked: boolean;
  defaultUnlocked: boolean;
  researched: boolean;
  unlocks: Partial<Unlocks>;
  effects: Record<string, number>;
};

export type UnsafeBurnParagonButtonOptions = {
  name: string;
  description: string;
  handler: AnyFunction;
  controller: BurnParagonBtnController;
};

export type UnsafeTurnHGOffButtonOptions = {
  name: string;
  description: string;
  handler: AnyFunction;
  controller: TurnHGOffButtonController;
};

export type UnsafePrestigeButtonOptions = {
  id: Perk;
  controller: PrestigeBtnController;
};
