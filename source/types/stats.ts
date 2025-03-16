import type { Tab, TabManager } from "./core.js";
import type { GamePage } from "./game.js";
import type { Stat } from "./index.js";

export type StatsManager = TabManager & {
  game: GamePage;
  stats: Array<UnsafeStat>;
  statsCurrent: Array<UnsafeStat>;
  statGroups: Array<{ group: Array<UnsafeStat>; title: string }>;
  new (game: GamePage): StatsManager;
  resetState: () => void;
  save: (saveData: unknown) => void;
  load: (saveData: unknown) => void;
  getStat: (name: Stat) => UnsafeStat;
  getStatCurrent: (name: Stat) => UnsafeStat;
  resetStatsCurrent: () => void;
  unlockAll: () => void;
};

export type StatsTab = Tab & {
  container: HTMLElement | null;
  new (tabName: unknown): StatsTab;
  render: (content?: HTMLElement) => void;
  update: () => void;
};

export type UnsafeStat = {
  name: Stat;
  title: string;
  val: number;
  unlocked: boolean;
  defaultUnlocked?: boolean;
  calculate?: (game: GamePage) => number;
};
