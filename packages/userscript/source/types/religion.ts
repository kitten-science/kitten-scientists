import {
  BuildButton,
  ButtonModernModel,
  GamePage,
  GameTab,
  Price,
  TransformBtnController,
} from ".";

export type ReligionTab = GameTab & {
  /**
   * Refine tears.
   */
  refineBtn: BuildButton;

  /**
   * Refine time crystals.
   */
  refineTCBtn: BuildButton;

  /**
   * Religion upgrade (Order of the sun) buttons.
   */
  rUpgradeButtons: Array<BuildButton<ReligionUpgrades>>;

  /**
   * Sacrifice unicorns.
   */
  sacrificeBtn: BuildButton<string, ButtonModernModel, TransformBtnController>;

  /**
   * Ziggurath upgrade buttons.
   */
  zgUpgradeButtons: Array<BuildButton<ZiggurathUpgrades>>;
};

export enum UnicornItemVariant {
  Cryptotheology = "c",
  OrderOfTheSun = "s",
  Ziggurat = "z",
  UnicornPasture = "zp",
}

export type ReligionUpgrades =
  | "apocripha"
  | "basilica"
  | "goldenSpire"
  | "scholasticism"
  | "solarchant"
  | "solarRevolution"
  | "stainedGlass"
  | "sunAltar"
  | "templars"
  | "transcendence";
export type TranscendenceUpgrades =
  | "blackCore"
  | "blackLibrary"
  | "blackNexus"
  | "blackObelisk"
  | "blackRadiance"
  | "blazar"
  | "darkNova"
  | "holyGenocide"
  | "singularity";
export type ZiggurathUpgrades =
  | "blackPyramid"
  | "ivoryCitadel"
  | "ivoryTower"
  | "marker"
  | "skyPalace"
  | "sunspire"
  | "unicornPasture"
  | "unicornGraveyard"
  | "unicornNecropolis"
  | "unicornTomb"
  | "unicornUtopia";

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
  unlocked: boolean;

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
};

export type ReligionUpgradeInfo = AbstractReligionUpgradeInfo & {
  calculateEffects: (self: unknown, game: GamePage) => void;
  /**
   * An internationalized description for this religion upgrade.
   */
  description: string;

  effects: {
    faithRatioReligion?: number;
  };

  faith: number;

  name: ReligionUpgrades;
  noStackable: boolean;
  on: boolean;
  priceRatio: number;
};

export type ZiggurathUpgradeInfo = AbstractReligionUpgradeInfo & {
  calculateEffects: (self: unknown, game: GamePage) => void;
  defaultUnlocked: boolean;

  /**
   * An internationalized description for this space building.
   */
  description: string;

  effects: {
    riftChance?: number;
    unicornsRatioReligion?: number;
  };

  name: ZiggurathUpgrades;
  priceRatio: number;

  unlocks: {
    zigguratUpgrades: Array<"ivoryTower">;
  };
};

export type TranscendenceUpgradeInfo = AbstractReligionUpgradeInfo & {
  calculateEffects: (self: unknown, game: GamePage) => void;

  /**
   * An internationalized description for this space building.
   */
  description: string;

  effects: {
    solarRevolutionLimit?: number;
  };

  flavor: string;

  name: TranscendenceUpgrades;
  priceRatio?: number;
  tier: number;
  unlocks: {
    zigguratUpgrades: Array<"ivoryTower">;
  };
};
