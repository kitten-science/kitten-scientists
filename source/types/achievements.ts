import type { Panel, Tab, TabManager } from "./core.js";
import type { GamePage } from "./game.js";

export type Achievements = TabManager & {
  game: GamePage;
  badgesUnlocked: boolean;
  achievements: Array<UnsafeAchievement>;
  badges: Array<UnsafeBadge>;
  new (game: GamePage): Achievements;
  get: (name: string) => UnsafeAchievement;
  getBadge: (name: string) => UnsafeBadge;
  unlockBadge: (name: string) => void;
  hasUnlocked: () => boolean;
  update: () => void;
  resetState: () => void;
  save: (saveData: unknown) => void;
  load: (saveData: unknown) => void;
  unlockAll: () => void;
};

export type AchievementsPanel = Panel & {
  game: null;
  refreshNextTick: boolean;
  new (): AchievementsPanel;
  render: (container?: HTMLElement) => void;
  update: () => void;
  generateStarText: (completedStars: number, uncompletedStars: number) => string;
  renderAchievementItem: (ach: UnsafeAchievement, container: unknown) => HTMLSpanElement;
  updateAchievementItem: (ach: UnsafeAchievement) => void;
};

export type BadgesPanel = Panel & {
  game: null;
  new (): BadgesPanel;
  render: (container?: HTMLElement) => void;
  update: () => void;
  generateBadgeCSSClass: (badge: UnsafeBadge) => string;
};

export type AchTab = Tab & {
  new (): AchTab;
  render: (container?: HTMLElement) => void;
  update: () => void;
};

export type UnsafeAchievement = {
  name: string;
  title: string;
  description: string;
  condition: () => boolean;
  starCondition?: () => boolean;
  hidden: boolean;
};

export type UnsafeBadge = {
  name: string;
  title: string;
  description: string;
  difficulty: "A" | "B" | "C" | "D" | "E" | "F" | "S" | "S+";
  condition?: () => boolean;
};
