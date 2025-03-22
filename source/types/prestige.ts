import type {
  BuildingNotStackableBtnController,
  ButtonModernController,
  Panel,
  TabManager,
  UnsafeBuildingBtnModel,
  UnsafeButtonModel,
} from "./core.js";
import type { Game } from "./game.js";
import type { Price, UnsafeBuyItemResult } from "./index.js";

export type PrestigeManager = TabManager & {
  perks: Array<UnsafePerk>;
  game: Game;
  new (game: Game): PrestigeManager;
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
  getMetadata: <TButtonModel extends UnsafeBuildingBtnModel<UnsafePerk>>(
    model: TButtonModel,
  ) => UnsafePerk;
  buyItem: (model: unknown, event: unknown) => UnsafeBuyItemResult;
  updateVisible: <TButtonModel extends UnsafeBuildingBtnModel<UnsafePerk>>(
    model: TButtonModel,
  ) => void;
};

export type BurnParagonBtnController = ButtonModernController & {
  updateVisible: <TButtonModel extends UnsafeButtonModel<undefined>>(model: TButtonModel) => void;
};

export type TurnHGOffButtonController = ButtonModernController & {
  updateVisible: <TButtonModel extends UnsafeButtonModel<undefined>>(model: TButtonModel) => void;
};

export type PrestigePanel = Panel & {
  game: null;
  new (): PrestigePanel;
  render: (container: unknown) => void;
};

export type UnsafePerk = {
  name: string;
  label: string;
  description: string;
  prices: Array<Price>;
  unlocked: boolean;
  defaultUnlocked: boolean;
  researched: boolean;
  unlocks: {
    perks: Array<string>;
  };
  effects: Record<string, number>;
};
