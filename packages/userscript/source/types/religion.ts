import { BuildButton, GamePage, GameTab, Price } from ".";

export type ReligionTab = GameTab & {
  rUpgradeButtons: Array<BuildButton<ReligionUpgrades>>;
  zgUpgradeButtons: Array<BuildButton<ZiggurathUpgrades>>;
};

export enum UnicornItemVariant {
  Cryptotheology = "c",
  OrderOfTheSun = "s",
  Ziggurat = "z",
  Unknown_zp = "zp",
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
  | "unicornGraveyard"
  | "unicornNecropolis"
  | "unicornTomb"
  | "unicornUtopia";

export type AbstractReligionUpgradeInfo = {
  /**
   * An internationalized label for this religion upgrade.
   */
  label: string;
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
  prices: Array<Price>;
  unlocked: boolean;
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
  priceRatio: number;
  prices: Array<Price>;
  tier: number;
  unlocked: boolean;
  unlocks: {
    zigguratUpgrades: Array<"ivoryTower">;
  };
};
