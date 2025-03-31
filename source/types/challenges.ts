import type { AnyFunction } from "@oliversalzburg/js-utils/core.js";
import type {
  BuildingBtnController,
  ButtonController,
  Panel,
  Tab,
  TabManager,
  UnsafeBuildingBtnModernModel,
} from "./core.js";
import type { GamePage } from "./game.js";
import type {
  Building,
  Challenge,
  Price,
  Resource,
  UnsafeBuyItemResult,
  UnsafeMeta,
  ZigguratUpgrade,
} from "./index.js";
import type { UnsafeChronoForgeUpgrade } from "./time.js";
import type { UnsafeUpgrade } from "./workshop.js";

export type ChallengesManager = TabManager<UnsafeMeta<UnsafeChallenge>> & {
  game: GamePage;
  new (game: GamePage): ChallengesManager;
  currentChallenge: null;
  challenges: Array<UnsafeChallenge>;
  resetState: () => void;
  resetStateStackable: (challenge: UnsafeChallenge) => void;
  save: (saveData: unknown) => void;
  load: (saveData: unknown) => void;
  update: () => void;
  getChallenge: (name: Challenge) => UnsafeChallenge;
  anyChallengeActive: () => boolean;
  isActive: (name: Challenge) => boolean;
  getCountPending: () => number;
  getCountCompletions: () => number;
  getCountUniqueCompletions: () => number;
  researchChallenge: (challenge: Challenge) => void;
  onRunReset: () => void;
  applyPending: (isIronWillPending: boolean) => void;
};

export type ReserveMan = {
  game: GamePage;
  reserveResources: null;
  reserveKittens: null;
  reserveCryochambers: number;
  new (game: GamePage): ReserveMan;
  resetState: () => void;
  calculateReserveResources: () => void;
  calculateReserveKittens: () => void;
  calculateReserves: (isIronWillPending: boolean) => void;
  addReserves: () => void;
  getSaveData: () => {
    reserveKittens: Array<unknown>;
    reserveResources: unknown;
    ironWillClaim: unknown;
    reserveCryochambers: number;
  };
  reservesExist: () => boolean;
};

export type ChallengeBtnController<
  TModel extends UnsafeChallengeBtnModel<UnsafeChallengeButtonOptions> | unknown = unknown,
> = BuildingBtnController<TModel> & {
  initModel: (options: unknown) => TModel;
  getMetadata: (model: TModel) => UnsafeChallenge;
  getDescription: (model: TModel) => string;
  getName: (model: TModel) => string;
  getPrices: (model: TModel) => Array<Price>;
  buyItem: (model: TModel, event: unknown) => UnsafeBuyItemResult;
  togglePending: (model: TModel) => void;
  updateVisible: (model: TModel) => void;
  updateEnabled: (model: TModel) => void;
};

export type ChallengePanel = Panel & {
  game: null;
  resetMessage: HTMLSpanElement | null;
  new (): ChallengePanel;
  render: (container?: HTMLElement) => void;
  update: () => void;
  updateResetMessage: () => void;
};

export type ReservesPanel = Panel & {
  statics: {
    maxKittensToDisplayIndividually: number;
  };
  reclaimReservesBtn: null;
  reclaimInstructionsText: null;
  new (): ReservesPanel;
  render: (container?: HTMLElement) => void;
  renderReservedResources: (panelContainer: unknown) => void;
  createSingleResourceRow: (
    resourceObj: unknown,
    resourceAmount: number,
    reservedResources: unknown,
    tableContainer: HTMLElement,
  ) => void;
  renderReservedKittens: (panelContainer: HTMLElement) => void;
  update: () => void;
};

export type ChallengeEffectsPanel = Panel & {
  challengeName: string;
  listElement: null;
  new (): ChallengeEffectsPanel;
  setChallengeName: (challengeName: string) => void;
  render: (container?: HTMLElement) => void;
  generateEffectsList: () => void;
  update: () => void;
};

export type ChallengesTab = Tab & {
  render: (container?: HTMLElement) => void;
  update: () => void;
};

export type UnsafeChallenge = {
  name: Challenge;
  label: string;
  description: string;
  effectDesc: string;
  flavor?: string;
  defaultUnlocked: boolean;
  upgrades?: {
    buildings?: Array<Building>;
    chronoforge?: Array<UnsafeChronoForgeUpgrade>;
    zigguratUpgrades?: Array<ZigguratUpgrade>;
    upgrades?: Array<UnsafeUpgrade>;
  };
  effects?: Record<string, number>;
  stackOptions?: Record<string, { LDRLimit: number; noStack?: boolean; capMagnitude?: number }>;
  calculateEffects?: (self: UnsafeChallenge, game: unknown) => void;
  checkCompletionCondition?: (game: GamePage) => boolean;
  checkCompletionConditionOnReset?: (game: GamePage) => boolean;
  actionOnCompletion?: (game: GamePage) => void;
  reserveDelay?: boolean;
  unlocks?: {
    chronoforge?: Array<UnsafeChronoForgeUpgrade>;
  };
  leviEnergyToUnlock?: number;
  sumPricesWeighted?: (prices: Array<Price>) => number;
  _getResWeight?: (resName: Resource) => number;
  resWeights?: Record<Resource, number>;
  findRuins?: () => void;

  val?: number;
  on?: number;
  noStackable?: boolean;
  isAutomationEnabled?: boolean | null;
  lackResConvert?: boolean;
  toggleable?: boolean;

  unlocked?: boolean;
  pending?: boolean;
  active?: boolean;
  researched?: boolean;
};

export type UnsafeReclaimReservesButtonOptions = {
  name: string;
  description: string;
  handler: AnyFunction;
  controller: ButtonController;
};

export type UnsafeApplyPendingButtonOptions = {
  name: string;
  description: string;
  handler: AnyFunction;
  controller: ButtonController;
};

export type UnsafeShowChallengeEffectsButtonOptions = {
  name: string;
  description: string;
  handler: AnyFunction;
  controller: ButtonController;
};

export type UnsafeChallengeButtonOptions = {
  id: Challenge;
  controller: ChallengeBtnController<UnsafeChallengeBtnModel<UnsafeChallengeButtonOptions>>;
};

export type UnsafeChallengeBtnModel<TModelOptions extends UnsafeChallengeButtonOptions> = {
  multiplyEffects: boolean;
} & UnsafeBuildingBtnModernModel<TModelOptions>;
