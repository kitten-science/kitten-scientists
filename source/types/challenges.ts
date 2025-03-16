import type {
  BuildingBtnController,
  Panel,
  Tab,
  TabManager,
  UnsafeBuildingBtnModel,
} from "./core.js";
import type { Game } from "./game.js";
import type {
  Building,
  Challenge,
  Price,
  Resource,
  UnsafeBuyItemResult,
  ZiggurathUpgrade,
} from "./index.js";
import type { ChronoForgeUpgrade } from "./time.js";
import type { Upgrade } from "./workshop.js";

export type ChallengesManager = TabManager & {
  game: Game;
  new (game: Game): ChallengesManager;
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
  game: Game;
  reserveResources: null;
  reserveKittens: null;
  reserveCryochambers: number;
  new (game: Game): ReserveMan;
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
  TModelMetadata extends Record<string, unknown> = Record<string, unknown>,
  TModel extends UnsafeChallengeBtnModel<TModelMetadata> = UnsafeChallengeBtnModel<TModelMetadata>,
> = BuildingBtnController<TModelMetadata, TModel> & {
  initModel: (options: unknown) => TModel;
  getMetadata: <
    TModelMetadata extends Record<string, unknown> = Record<string, unknown>,
    TModel extends
      UnsafeChallengeBtnModel<TModelMetadata> = UnsafeChallengeBtnModel<TModelMetadata>,
  >(
    model: TModel,
  ) => UnsafeChallenge;
  getDescription: <
    TModelMetadata extends Record<string, unknown> = Record<string, unknown>,
    TModel extends
      UnsafeChallengeBtnModel<TModelMetadata> = UnsafeChallengeBtnModel<TModelMetadata>,
  >(
    model: TModel,
  ) => string;
  getName: <
    TModelMetadata extends Record<string, unknown> = Record<string, unknown>,
    TModel extends
      UnsafeChallengeBtnModel<TModelMetadata> = UnsafeChallengeBtnModel<TModelMetadata>,
  >(
    model: TModel,
  ) => string;
  getPrices: <
    TModelMetadata extends Record<string, unknown> = Record<string, unknown>,
    TModel extends
      UnsafeChallengeBtnModel<TModelMetadata> = UnsafeChallengeBtnModel<TModelMetadata>,
  >(
    model: TModel,
  ) => Array<Price>;
  buyItem: <
    TModelMetadata extends Record<string, unknown> = Record<string, unknown>,
    TModel extends
      UnsafeChallengeBtnModel<TModelMetadata> = UnsafeChallengeBtnModel<TModelMetadata>,
  >(
    model: TModel,
    event: unknown,
  ) => UnsafeBuyItemResult;
  togglePending: <
    TModelMetadata extends Record<string, unknown> = Record<string, unknown>,
    TModel extends
      UnsafeChallengeBtnModel<TModelMetadata> = UnsafeChallengeBtnModel<TModelMetadata>,
  >(
    model: TModel,
  ) => void;
  updateVisible: <
    TModelMetadata extends Record<string, unknown> = Record<string, unknown>,
    TModel extends
      UnsafeChallengeBtnModel<TModelMetadata> = UnsafeChallengeBtnModel<TModelMetadata>,
  >(
    model: TModel,
  ) => void;
  updateEnabled: <
    TModelMetadata extends Record<string, unknown> = Record<string, unknown>,
    TModel extends
      UnsafeChallengeBtnModel<TModelMetadata> = UnsafeChallengeBtnModel<TModelMetadata>,
  >(
    model: TModel,
  ) => void;
};

export type ChallengePanel = Panel & {
  game: null;
  resetMessage: HTMLSpanElement | null;
  new (): ChallengePanel;
  render: (container: unknown) => void;
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
  render: (container: unknown) => void;
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
  render: (container: unknown) => void;
  generateEffectsList: () => void;
  update: () => void;
};

export type ChallengesTab = Tab & {
  render: (container: HTMLElement) => void;
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
    chronoforge?: Array<ChronoForgeUpgrade>;
    zigguratUpgrades?: Array<ZiggurathUpgrade>;
    upgrades?: Array<Upgrade>;
  };
  effects?: Record<string, number>;
  stackOptions?: Record<string, { LDRLimit: number; noStack?: boolean; capMagnitude?: number }>;
  calculateEffects?: (self: UnsafeChallenge, game: unknown) => void;
  checkCompletionCondition?: (game: Game) => boolean;
  checkCompletionConditionOnReset?: (game: Game) => boolean;
  actionOnCompletion?: (game: Game) => void;
  reserveDelay?: boolean;
  unlocks?: {
    chronoforge?: Array<ChronoForgeUpgrade>;
  };
  leviEnergyToUnlock?: number;
  sumPricesWeighted?: (prices: Array<Price>) => number;
  _getResWeight?: (resName: Resource) => number;
  resWeights?: Record<Resource, number>;
  findRuins?: () => void;
};

export type UnsafeChallengeBtnModel<
  TModelOptions extends Record<string, unknown> | undefined = undefined,
  TMetadata extends Record<string, unknown> | undefined = undefined,
> = {
  multiplyEffects: boolean;
} & UnsafeBuildingBtnModel<TModelOptions, TMetadata>;
