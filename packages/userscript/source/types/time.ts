import { BuildButton, GameTab, Price } from ".";

export type TimeTab = GameTab & {
  cfPanel: BuildButton; // Chronoforge
  vsPanel: BuildButton; // Void space
};

export type ChronoForgeUpgrades =
  | "blastFurnace"
  | "ressourceRetrieval"
  | "temporalAccelerator"
  | "temporalBattery"
  | "temporalImpedance"
  | "timeBoiler";

export type VoidSpaceUpgrades =
  | "cryochambers"
  | "usedCryochambers"
  | "voidHoover"
  | "voidRift"
  | "chronocontrol"
  | "voidResonator";

export type AbstractTimeUpgradeInfo = {
  /**
   * An internationalized label for this time upgrade.
   */
  label: string;
  prices: Array<Price>;

  unlocked: boolean;
  val: number;
};

export type ChronoForgeUpgradeInfo = AbstractTimeUpgradeInfo & {
  /**
   * An internationalized description for this space building.
   */
  description: string;

  effects: {
    temporalFluxMax?: number;
  };

  name: ChronoForgeUpgrades;
  priceRatio: number;
};

export type VoidSpaceUpgradeInfo = AbstractTimeUpgradeInfo & {
  breakIronWill: true;

  /**
   * An internationalized description for this space building.
   */
  description: string;

  effects: {
    maxKittens?: number;
  };
  flavor: string;
  limitBuild: 0;
  name: VoidSpaceUpgrades;
  priceRatio: number;
  upgrades: {
    voidSpace: Array<"cryochambers">;
  };
  val: number;
};
