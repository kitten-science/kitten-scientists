import type {
  BuildButton,
  BuildingEffects,
  ButtonModernModel,
  Game,
  GameTab,
  Price,
  RefineTearsBtnController,
  TransformBtnController,
  Unlocks,
} from "./index.js";

export type ReligionTab = GameTab & {
  /**
   * Refine tears.
   */
  refineBtn?: BuildButton<string, ButtonModernModel, RefineTearsBtnController> | null;

  /**
   * Refine time crystals.
   */
  refineTCBtn?: BuildButton<string, ButtonModernModel, TransformBtnController> | null;

  /**
   * Religion upgrade (Order of the sun) buttons.
   */
  rUpgradeButtons: Array<BuildButton<ReligionUpgrade>>;

  /**
   * Sacrifice alicorns.
   */
  sacrificeAlicornsBtn: BuildButton<string, ButtonModernModel, TransformBtnController> | null;

  /**
   * Sacrifice unicorns.
   */
  sacrificeBtn: BuildButton<string, ButtonModernModel, TransformBtnController> | null;

  /**
   * Ziggurath upgrade buttons.
   */
  zgUpgradeButtons: Array<BuildButton<ZiggurathUpgrade>>;
};

export enum UnicornItemVariant {
  Cryptotheology = "c",
  OrderOfTheSun = "s",
  Ziggurat = "z",
  UnicornPasture = "zp",
}

export const ReligionUpgrades = [
  "apocripha",
  "basilica",
  "goldenSpire",
  "scholasticism",
  "solarRevolution",
  "solarchant",
  "stainedGlass",
  "sunAltar",
  "templars",
  "transcendence",
] as const;
export type ReligionUpgrade = (typeof ReligionUpgrades)[number];

export const TranscendenceUpgrades = [
  "blackCore",
  "blackLibrary",
  "blackNexus",
  "blackObelisk",
  "blackRadiance",
  "blazar",
  "darkNova",
  "holyGenocide",
  "mausoleum",
  "singularity",
] as const;
export type TranscendenceUpgrade = (typeof TranscendenceUpgrades)[number];

export const ZiggurathUpgrades = [
  "blackPyramid",
  "ivoryCitadel",
  "ivoryTower",
  "marker",
  "skyPalace",
  "sunspire",
  "unicornGraveyard",
  "unicornNecropolis",
  "unicornTomb",
  "unicornUtopia",
] as const;
export type ZiggurathUpgrade = (typeof ZiggurathUpgrades)[number];

export type AbstractReligionUpgradeInfo = {
  /**
   * An internationalized label for this religion upgrade.
   */
  label: string;

  /**
   * The costs of this upgrade.
   */
  prices: Array<Price>;

  /**
   * Has this upgrade been unlocked?
   */
  unlocked?: boolean;

  /**
   * How many of these do you have?
   */
  val: number;

  /**
   * This flag is set by KS itself to "hide" a given build from being
   * processed in the BulkManager. This is likely not ideal and will
   * be refactored later.
   */
  rHidden?: boolean;

  unlocks?: Partial<Unlocks>;
};

export type ReligionUpgradeInfo = AbstractReligionUpgradeInfo & {
  calculateEffects: (self: unknown, game: Game) => void;
  /**
   * An internationalized description for this religion upgrade.
   */
  description: string;

  effects: Partial<BuildingEffects>;

  faith: number;

  name: ReligionUpgrade;
  noStackable: boolean;
  on: boolean;
  priceRatio: number;
};

export type ZiggurathUpgradeInfo = AbstractReligionUpgradeInfo & {
  calculateEffects: (self: unknown, game: Game) => void;
  defaultUnlocked: boolean;

  /**
   * An internationalized description for this space building.
   */
  description: string;

  effects: Partial<BuildingEffects>;

  name: ZiggurathUpgrade;
  priceRatio: number;
};

export type TranscendenceUpgradeInfo = AbstractReligionUpgradeInfo & {
  calculateEffects: (self: unknown, game: Game) => void;

  /**
   * An internationalized description for this space building.
   */
  description: string;

  effects: Partial<BuildingEffects>;

  flavor: string;

  name: TranscendenceUpgrade;
  priceRatio?: number;
  tier: number;
};
