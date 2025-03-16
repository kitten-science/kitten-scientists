import type { AnyFunction } from "@oliversalzburg/js-utils/core.js";
import type { GamePage } from "./game.js";
import type { TabId } from "./index.js";

export type IReactAware = {
  component: null;
  container: null;
  new (component: unknown, game: GamePage): IReactAware;
  game: GamePage;
  render: (container?: HTMLElement) => HTMLElement;
  update: () => void;
  destroy: () => void;
};

export type UISystem = {
  game: GamePage | null;
  setGame: (game: GamePage) => void;
  render: () => void;
  update: () => void;
  updateOptions: () => void;
  unlockScheme: (name: unknown) => void;
  relockSchemes: () => void;
  notifyLogEvent: (logmsg: unknown) => void;
  confirm: (title: unknown, msg: unknown, callbackOk: unknown, callbackCancel: unknown) => void;
  openPopupPage: (pageName: unknown) => void;
  pulse: (node: unknown) => void;
  displayAutosave: () => void;
  resetConsole: () => void;
  renderFilters: () => void;
  renderConsoleLog: () => void;
  saveExport: (encodedData: unknown) => void;
  observeCallback: () => void;
  observeClear: () => void;
  updateCalendar: () => void;
  updateLanguage: () => void;
  updateNotation: () => void;
  load: () => void;
  save: () => void;
  isEffectMultiplierEnabled: () => boolean;
  checkForUpdates: () => void;
};

export type DesktopUI = UISystem & {
  containerId: null;
  toolbar: null;
  calenderDivTooltip: null;
  calendarSignSpanTooltip: null;
  fontSize: number | null;
  /**
   * current selected game tab
   */
  activeTabId: TabId;
  keyStates: {
    shiftKey: boolean;
    ctrlKey: boolean;
    altKey: boolean;
  };
  isDisplayOver: boolean;
  isCenter: boolean;
  defaultSchemes: [
    "black",
    "bluish",
    "dark",
    "default",
    "grassy",
    "grayish",
    "greenish",
    "sleek",
    "spooky",
    "tombstone",
    "wood",
  ];
  allSchemes: ["default"];
  dirtyComponents: [];
  new (containerId: unknown): DesktopUI;
  setGame(game: GamePage): void;
  game?: GamePage;
  render: () => void;
  update: () => void;
  updateTabs: () => void;
  updateFastHunt: () => void;
  updateFastPraise: () => void;
  updateCalendar: () => void;
  updateUndoButton: () => void;
  updateAdvisors: () => void;
  updateLanguage: () => void;
  applyLanguage: () => void;
  updateNotation: () => void;
  updateOptions: () => void;
  unlockScheme: (name: string) => void;
  relockSchemes: () => void;
  displayAutosave: () => void;
  getFontSize: () => number | null;
  zoomUp: () => void;
  zoomDown: () => void;
  updateFontSize: () => void;
  loadLog: () => void;
  loadQueue: () => void;
  resetConsole: () => void;
  renderFilters: () => void;
  onLoad: () => void;
  updateIndexHTMLLanguage: () => void;
  _createFilter: (filter: unknown, fId: string, filtersDiv: HTMLDivElement) => void;
  logMessagesToFade: number;
  renderConsoleLog: () => void;
  notifyLogEvent: () => void;
  saveExport: (encodedData: string, rawData: unknown) => void;
  confirm: (
    title: string,
    msg: string,
    callbackOk: AnyFunction,
    callbackCancel: AnyFunction,
  ) => void;
  showDialog: (id: string) => void;
  displayAppDialog: () => void;
  load: () => void;
  save: () => void;
  updateCenter: () => void;
  toggleCenter: () => void;
  isEffectMultiplierEnabled: () => boolean;
  checkForUpdates: () => void;
};
