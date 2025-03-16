import type { GamePage } from "./game.js";

export type Toolbar = {
  icons: Array<ToolbarEnergy | ToolbarHappiness | ToolbarMOTD>;
  game: GamePage;
  new (game: GamePage): Toolbar;
  addIcon: (icon: ToolbarIcon) => void;
  render: (container?: HTMLElement) => void;
  update: (forceUpdate: boolean) => void;
  attachToolbarTooltip: (container: HTMLElement, icon: ToolbarIcon) => void;
  updateTooltip: (container: unknown, tooltip: HTMLElement, htmlProvider: unknown) => void;
};

export type ToolbarIcon = {
  game: GamePage;
  container: HTMLSpanElement | null;
  new (game: GamePage): ToolbarIcon;
  render: (container?: HTMLElement) => HTMLSpanElement;
  update: () => void;
  getTooltip: () => string;
  onClick: () => void;
  getOpts: () => {
    needUpdate: true;
    hasTooltip: true;
  };
};

export type ToolbarHappiness = ToolbarIcon & {
  update: () => void;
  getTooltip: () => string;
};

export type ToolbarEnergy = ToolbarIcon & {
  update: () => void;
  getTooltip: () => string;
};
export type ToolbarMOTD = ToolbarIcon & {
  update: () => void;
  getTooltip: () => string;
};
