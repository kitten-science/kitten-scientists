import type { AnyFunction } from "@oliversalzburg/js-utils/core.js";
import type { KGSaveData } from "./_save.js";
import type { Achievements, AchTab } from "./achievements.js";
import type { BuildingsManager, BuildingsModern } from "./buildings.js";
import type { Calendar } from "./calendar.js";
import type { ChallengesManager, ChallengesTab } from "./challenges.js";
import type { Console, Tab } from "./core.js";
import type { Diplomacy, DiplomacyManager } from "./diplomacy.js";
import type {
  ColorScheme,
  Resource,
  ResourceCraftable,
  TabId,
  Unlock,
  Unlocks,
  UnlockTypeMap,
} from "./index.js";
import type { Math as KGMath } from "./math.js";
import type { PrestigeManager } from "./prestige.js";
import type { ReligionManager, ReligionTab } from "./religion.js";
import type { ResourceManager } from "./resources.js";
import type { Library, ScienceManager } from "./science.js";
import type { SpaceManager, SpaceTab } from "./space.js";
import type { StatsManager, StatsTab } from "./stats.js";
import type { QueueTab, TimeManager, TimeTab } from "./time.js";
import type { DesktopUI } from "./ui.js";
import type { Village, VillageManager } from "./village.js";
import type { VoidManager } from "./void.js";
import type { Workshop, WorkshopManager } from "./workshop.js";

export type Timer = {
  handlers: Array<unknown>;
  scheduledHandlers: Array<unknown>;
  ticksTotal: number;
  timestampStart: null;
  totalUpdateTime: null;
  addEvent: (handler: unknown, frequency: unknown) => void;
  update: () => void;
  scheduleEvent: (handler: unknown) => void;
  updateScheduledEvents: () => void;
  beforeUpdate: () => void;
  afterUpdate: () => void;
};

export type IDataStorageAware = {
  new (): IDataStorageAware;
};

export type Telemetry = IDataStorageAware & {
  guid: string;
  game: GamePage;
  buildRevision: null;
  version: null;
  errorCount: number;
  new (game: GamePage): Telemetry;
  generateGuid: () => string;
  save: (data: unknown) => void;
  load: (data: unknown) => void;
  logEvent: (eventType: unknown, payload: unknown) => void;
  logRouteChange: (name: string) => void;
};

export type Server = {
  showMotd: boolean;
  motdTitle: string | null;
  motdContent: string | null;
  game: GamePage | null;
  motdContentPrevious: string | null;
  motdFreshMessage: boolean;
  /**
   * KGNet user profile
   * Represents an active session, if not null, all XHR calls will be made
   * using session cookies
   */
  userProfile: null;
  chiral: null;
  /**
   * When was the last time save was uploaded to the cloud. (Unix timestamp)
   */
  lastBackup: null;
  /**
   * Current client snapshot of the save data
   * All operations with the cloud saves should return the save snapshot?
   */
  saveData: null;
  /**
   * If KS settings are detected in the save, this will be set to true.
   */
  isKSDetected: false;
  new (game: GamePage): Server;
  setUserProfile: (userProfile: unknown) => void;
  getServerUrl: () => string;
  refresh: () => void;
  _xhr: (url: string, method: string, data: unknown, handler: AnyFunction) => Promise<unknown>;
  syncUserProfile: () => void;
  syncSaveData: () => Promise<unknown>;
  pushSave: () => void;
  pushSaveMetadata: (guid: string, metadata: unknown) => Promise<unknown>;
  loadSave: (guid: string) => void;
  save: (saveData: unknown) => void;
  sendCommand: (command: unknown) => void;
  setChiral: (data: unknown) => void;
};

export type UndoChange = {
  _static: {
    DEFAULT_TTL: number;
  };
  ttl: number;
  events: null;
  new (): UndoChange;
  addEvent: (managerId: unknown, data: unknown) => void;
};

export type EffectsManager = {
  game: GamePage;
  new (game: GamePage): EffectsManager;
  effectMeta: (effectName: unknown) => unknown;
  statics: {
    effectMeta: unknown;
  };
};

export type GamePage = {
  id: string;
  tabs: Array<Tab>;
  resPool: ResourceManager;
  calendar: Calendar;
  village: VillageManager;
  console: Console;
  telemetry: Telemetry;
  server: Server;
  math: KGMath;
  /**
   * global cache
   */
  globalEffectsCached: Record<string, unknown>;
  /**
   * how much ticks are performed per second (5 ticks per second, 200 ms per tick)
   */
  ticksPerSecond: number;
  /**
   * I wonder why someone may need this
   */
  isPaused: boolean;
  isCMBREnabled: boolean;
  ticksBeforeSave: number;
  /**
   * in ticks
   */
  autosaveFrequency: number;
  /**
   * current building selected in the Building tab by a mouse cursor, should affect resource table rendering
   * TODO: move me to UI
   */
  selectedBuilding: null;
  setSelectedObject: (object: unknown) => void;
  clearSelectedObject: () => void;
  forceShowLimits: boolean;
  useWorkers: boolean;
  colorScheme: ColorScheme;
  unlockedSchemes: null;
  timer: Timer;
  /**
   * main timer loop
   */
  _mainTimer: null;
  /**
   * counter for karmic reincarnation
   */
  karmaKittens: number;
  karmaZebras: number;
  deadKittens: number;
  /**
   * true if player has no kittens or housing buildings
   */
  ironWill: boolean;
  saveVersion: number;
  //FINALLY
  opts: {
    disableCMBR: boolean;
    /**
     * Should `confirm()` calls be skipped in the game?
     */
    noConfirm: boolean;
    usePerSecondValues: boolean;
    notation: "si";
    forceHighPrecision: boolean;
    usePercentageResourceValues: boolean;
    showNonApplicableButtons: boolean;
    usePercentageConsumptionValues: boolean;
    highlightUnavailable: boolean;
    hideSell: boolean;
    hideDowngrade: boolean;
    hideBGImage: boolean;
    tooltipsInRightColumn: boolean;
    IWSmelter: boolean;
    enableRedshift: boolean;
    enableRedshiftGflops: boolean;
    batchSize: number;
    // Used only in KG Mobile, hence it's absence in the rest of the code
    useLegacyTwoInRowLayout: boolean;
    forceLZ: boolean;
    compressSaveFile: boolean;
    ksEnabled: boolean;
  };
  /**
   * timeout till resetting gather counter, see below
   */
  gatherTimeoutHandler: null;
  /**
   * how many clicks in a row was performed on a gather button
   */
  gatherClicks: number;
  /**
   * flag triggering Super Unethical Climax achievement
   */
  cheatMode: boolean;
  /**
   * flag triggering System Shock achievement
   */
  systemShockMode: boolean;
  /**
   * Flag for achievements
   */
  startedWithoutChronospheres: boolean;
  /**
   * how many ticks passed since the start of the game
   */
  ticks: number;
  /**
   * total time spent on update cycle in milliseconds, useful for debug/fps counter. 1 ticks per second have more calculations
   */
  totalUpdateTime: [number, number, number, number, number];
  totalUpdateTimeTicks: number;
  totalUpdateTimeCurrent: number;
  /**
   * fps breakdows of a render cycle
   */
  fps: null;
  /**
   * time of last pause
   */
  pauseTimestamp: number;
  /**
   * Stores the most recent date message to prevent header spam
   */
  lastDateMessage: null;
  effectsMgr: EffectsManager;
  managers: [
    WorkshopManager,
    DiplomacyManager,
    BuildingsManager,
    ScienceManager,
    Achievements,
    ReligionManager,
    SpaceManager,
    TimeManager,
    PrestigeManager,
    ChallengesManager,
    StatsManager,
    VoidManager,
    // We need this to inject our own manager into the collection.
    // Potentially very unsafe!
    {
      load: (saveData: Record<string, unknown>) => void;
      save: (saveData: Record<string, unknown>) => void;
      resetState: () => void;
    },
  ];
  workshop: WorkshopManager;
  diplomacy: DiplomacyManager;
  bld: BuildingsManager;
  science: ScienceManager;
  achievements: Achievements;
  religion: ReligionManager;
  space: SpaceManager;
  time: TimeManager;
  prestige: PrestigeManager;
  challenges: ChallengesManager;
  stats: StatsManager;
  void: VoidManager;
  /**
   * @deprecated Accessing the game's tabs should be avoided.
   * Try to use the game's managers directly, or create your own controller instances instead.
   */
  bldTab: BuildingsModern;
  /**
   * @deprecated Accessing the game's tabs should be avoided.
   * Try to use the game's managers directly, or create your own controller instances instead.
   */
  villageTab: Village;
  /**
   * @deprecated Accessing the game's tabs should be avoided.
   * Try to use the game's managers directly, or create your own controller instances instead.
   */
  libraryTab: Library;
  /**
   * @deprecated Accessing the game's tabs should be avoided.
   * Try to use the game's managers directly, or create your own controller instances instead.
   */
  workshopTab: Workshop;
  /**
   * @deprecated Accessing the game's tabs should be avoided.
   * Try to use the game's managers directly, or create your own controller instances instead.
   */
  diplomacyTab: Diplomacy;
  /**
   * @deprecated Accessing the game's tabs should be avoided.
   * Try to use the game's managers directly, or create your own controller instances instead.
   */
  religionTab: ReligionTab;
  /**
   * @deprecated Accessing the game's tabs should be avoided.
   * Try to use the game's managers directly, or create your own controller instances instead.
   */
  spaceTab: SpaceTab;
  /**
   * @deprecated Accessing the game's tabs should be avoided.
   * Try to use the game's managers directly, or create your own controller instances instead.
   */
  timeTab: TimeTab;
  /**
   * @deprecated Accessing the game's tabs should be avoided.
   * Try to use the game's managers directly, or create your own controller instances instead.
   */
  challengesTab: ChallengesTab;
  /**
   * @deprecated Accessing the game's tabs should be avoided.
   * Try to use the game's managers directly, or create your own controller instances instead.
   */
  achievementTab: AchTab;
  /**
   * @deprecated Accessing the game's tabs should be avoided.
   * Try to use the game's managers directly, or create your own controller instances instead.
   */
  statsTab: StatsTab;
  /**
   * @deprecated Accessing the game's tabs should be avoided.
   * Try to use the game's managers directly, or create your own controller instances instead.
   */
  queueTab: QueueTab;
  undoChange: UndoChange | null;
  /**
   * ui communication layer
   * Is actually potentially `null`, if the game was never fully initialized.
   * We don't include `null` in the type to avoid having to check it over and
   * over again during runtime.
   */
  ui: DesktopUI;
  dropBoxClient: null;
  /**
   * Whether the game is in developer mode or no
   */
  isLocalhost: boolean;
  devMode: boolean;
  mobileSaveOnPause: boolean;
  winterCatnipPerTick: number;
  featureFlags: Record<
    | "MAUSOLEUM_PACTS"
    | "QUEUE"
    | "QUEUE_REDSHIFT"
    | "SPACE_EXPL"
    | "UNICORN_TEARS_CHALLENGE"
    | "VILLAGE_MAP",
    UnsafeFeatureSelection
  >;
  /**
   * Should never be changed, override for KGM
   */
  isMobile: () => false;
  new (containerId: string): GamePage;
  getFeatureFlag: (flagId: unknown) => boolean;
  updateWinterCatnip: () => void;
  setDropboxClient: (dropBoxClient: unknown) => void;
  heartbeat: () => void;
  getEffectMeta: (effectName: unknown) => unknown;
  getEffect: (effectName: unknown) => number;
  updateCaches: () => void;
  /**
   * Calculate limited diminishing returns.
   */
  getLimitedDR: (effect: number, limit: number) => number;
  /**
   * Display a message in the console. Returns a <span> node of a text container.
   * Has significant performance impact, as it causes DOM operations.
   */
  msg: (
    message: string,
    type?: unknown,
    tag?: unknown,
    noBullet?: boolean,
  ) => { span: HTMLElement };
  clearLog: () => void;
  saveUI: () => void;
  resetState: () => void;
  _publish: (topic: string, arg: unknown) => void;
  reload: () => void;
  /**
   * Saves the game and returns the save game.
   */
  save(): KGSaveData;
  _prepareSaveData: <TSaveData>(saveData: TSaveData) => TSaveData;
  _saveDataToString: (saveData: unknown) => string;
  _wipe: () => void;
  wipe: () => void;
  closeOptions: () => void;
  toggleScheme: (themId: unknown) => void;
  togglePause: () => void;
  updateOptionsUI: () => void;
  /**
   * Returns a save data JSON from a base64 or utf16 compressed lz blob
   * Use this instead of LZString.decompressX
   */
  decompressLZData: (lzData: string) => string;
  compressLZData: (json: string, useUTF16?: boolean) => string;
  _parseLSSaveData: () => unknown;
  load: () => boolean | undefined;
  saveExport: () => void;
  saveImport: () => void;
  saveToFile: (withFullName: boolean) => void;
  saveExportDropbox: () => void;
  getDropboxAuthUrl: () => string;
  exportToDropbox: (lzdata: string, callback: AnyFunction) => void;
  saveImportDropbox: () => void;
  importFromDropbox: (callback: AnyFunction) => void;
  saveImportDropboxFileRead: (callback: AnyFunction) => void;
  saveImportDropboxText: (lzdata: string, callback: AnyFunction) => void;
  _loadSaveJson: (lzdata: string, callback: AnyFunction) => void;
  migrateSave: <TSave>(save: TSave) => TSave;
  setUI: (ui: DesktopUI) => void;
  render: () => void;
  calcResourcePerTick: (redName: Resource, season: unknown) => number;
  addGlobalModToStack: <TArray extends Array<unknown>>(array: TArray, resName: Resource) => TArray;
  getResourcePerTickStack: (
    resName: Resource,
    calcAutomatedEffect: unknown,
    season: unknown,
  ) => Array<{ name: string; type: string; value: number }> | undefined;
  getResourcePerDayStack: (
    resName: Resource,
  ) => Array<{ name: string; type: string; value: number }> | undefined;
  getResourceOnYearStack: (
    resName: Resource,
  ) => Array<{ name: string; type: string; value: number }> | undefined;
  getCMBRBonus: () => number;
  getCraftRatio: (tag: unknown) => number;
  /**
   * The resource craft ratio indicates how many items you receive
   * as the result of a single craft. This is subject to a variety
   * of bonus effects.
   *
   * @param name The resource to check.
   */
  getResCraftRatio: (name: ResourceCraftable) => number;
  /**
   * Update all tab managers, resources and UI controls
   */
  update: () => void;
  /**
   * How many ticks pass per second.
   * Subject to time acceleration.
   */
  getTicksPerSecondUI: () => number;
  timeAccelerationRatio: () => number;
  updateModel: () => void;
  huntAll: (event: Event) => void;
  praise: (event: Event) => void;
  updateResources: () => void;
  /**
   * Determine how much of the given resource is produced per tick.
   *
   * @param resName The resource to check.
   * @param withConversion Should resource convertions be taken into account?
   */
  getResourcePerTick: (resName: Resource, withConversion: boolean) => number;
  getResourcePerDay: (resName: Resource) => number;
  getResourceOnYearProduction: (resName: Resource) => number;
  /**
   * Determine how much of the resource, per tick, is subject to be converted
   * into another resource. For example, smelters convert wood and minerals.
   *
   * @param resName The resource to check.
   */
  getResourcePerTickConvertion: (resName: Resource) => number;
  craft: (name: Resource, amount: number) => void;
  craftAll: (name: Resource) => void;
  getRequiredResources: (bld: unknown) => unknown;
  attachResourceTooltip: (container: HTMLElement, resRef: unknown) => void;
  getDetailedResMap: (res: unknown) => string;
  processResourcePerTickStack: (
    resStack: unknown,
    res: unknown,
    depth: number,
    hasFixed: boolean,
  ) => string;
  getStackElemString: (stackElem: unknown, res: unknown) => string;
  /**
   * Outputs a formatted representation of time.  If the input is negative or NaN, treats it as zero instead.
   * @param secondsRaw Either a number or a string representing a number.
   * @return A string.  For the sake of consistency, all whitespace is trimmed from beginning & end.
   */
  toDisplaySeconds: (secondsRaw: number) => string;
  /**
   * The same as toDisplaySeconds, but converts ingame days into xYears xDays
   * Just for aestetical pleasness
   */
  toDisplayDays: (daysRaw: number) => string;
  toDisplayPercentage: (percentage: number, precision: number, precisionFixed: boolean) => string;
  postfixes: Array<{ limit: number; divisor: number; postfix: [string, string] }>;
  /**
   * Determines the display name & display value (formatting it as per second, or as a percentage, etc.) of a given effect.
   * @param effectName	The internal name of the effect.
   * @param effectValue	The value of the effect.
   * @param showIfZero	Boolean.  Determines whether we still show an effect with zero value, or if that effect remains hidden.
   * 					I added it just in case someone wants to use it in the future.
   * 					If the effect would be hidden for any other reason, then this flag doesn't do anything.
   * @return	null if the effect shouldn't be displayed (because it's hidden or because it's zero).
   * 			Otherwise, returns a table with the following keys:
   * 			displayEffectName = the localized title;
   * 			displayEffectValue = the value of the effect, formatted & localized properly
   */
  getEffectDisplayParams: (
    effectName: unknown,
    effectValue: number,
    showIfZero: boolean,
  ) => {
    displayEffectName: string;
    displayEffectValue: string;
  } | null;
  /**
   * Converts raw resource value (e.g. 12345.67890) to a formatted representation (i.e. 12.34K)
   * If 'prefix' flag is true, positive value will be prefixed with '+', e.g. ("+12.34K")
   */
  getDisplayValueExt: (
    value: number,
    prefix?: boolean,
    usePerTickHack?: boolean,
    precision?: number,
    postifx?: string,
  ) => string;
  /**
   * Formats float value to x.xx or x if value is integer
   */
  getDisplayValue: (floatVal: number, plusPrefix: boolean, precision: number) => string;
  fixFloatPointNumber: (number: number) => number;
  addTab: (tab: Tab) => void;
  isWebWorkerSupported: () => boolean;
  timestamp: () => number;
  start: () => void;
  frame: () => void;
  tick: () => void;
  restartFPSCounters: () => void;
  reset: () => void;
  resetAutomatic: () => void;
  discardParagon: () => void;
  doDiscardParagon: () => void;
  _getKarmaKittens: (kittens: number) => number;
  _getBonusZebras: () => number;
  getResetPrestige: () => {
    karmaKittens: number;
    paragonPoints: number;
  };
  _resetInternal: () => void;
  rand: (ratio: number) => number;
  updateKarma: () => void;
  /**
   * Calculate unlimited diminishing returns.
   */
  getUnlimitedDR: (value: number, stripe: number) => number;
  getInverseUnlimitedDR: (value: number, stripe: number) => number;
  getTab: (tabName: TabId) => Tab;
  calculateAllEffects: () => void;
  getUnlockByName: <TUnlock extends Unlock>(
    unlockId: unknown,
    type: TUnlock,
  ) => UnlockTypeMap[TUnlock];
  unlock: (list: Partial<Unlocks>) => void;
  upgrade: (list: Partial<Unlocks>) => void;
  toggleFilters: () => void;
  registerUndoChange: () => UndoChange;
  undo: () => void;
  checkEldermass: () => void;
  redeemGift: () => void;
  unlockAll: () => void;
  isEldermass: () => boolean;
  createRandomName: (lenConst: number, charPool?: string) => string;
  createRandomVarietyAndColor: (ch1: null | number, ch2: null | number) => [string, number];
};

export type UnsafeFeatureSelection = {
  beta: boolean;
  main: boolean;
  mobile: boolean;
};
