import type { IChildrenAware, IGameAware, TabManager } from "./core.js";
import type { GamePage } from "./game.js";

export type VoidManager = TabManager & {
  game: GamePage;
  faction: null;
  new (game: GamePage): VoidManager;
  save: (saveData: unknown) => void;
  load: (saveData: unknown) => void;
  update: () => void;
  resetState: () => void;
  voidUpgrades: Array<unknown>;
  getVU: (name: string) => unknown;
};

export type RorshachWgt = IChildrenAware &
  IGameAware & {
    new (game: unknown): RorshachWgt;
    render: (container?: HTMLElement) => void;
    update: () => void;
  };
