import { GameTab, Panel, Price } from ".";

export enum TimeItemVariant {
  Chronoforge = "chrono",
  VoidSpace = "void",
}

export type TimeTab = GameTab & {
  /**
   * Chronoforge panel.
   */
  cfPanel: Panel;

  /**
   * Void space panel
   */
  vsPanel: Panel;
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
  priceRatio: number;
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
  upgrades: {
    voidSpace: Array<"cryochambers">;
  };
  val: number;
};
