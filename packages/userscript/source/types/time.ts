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
   * An internationalized description for this space building.
   */
  description: string;

  /**
   * An internationalized label for this time upgrade.
   */
  label: string;
  prices: Array<Price>;
  priceRatio: number;
  unlocked: boolean;
  val: number;

  /**
   * This flag is set by KS itself to "hide" a given build from being
   * processed in the BulkManager. This is likely not ideal and will
   * be refactored later.
   */
  tHidden?: boolean;
};

export type ChronoForgeUpgradeInfo = AbstractTimeUpgradeInfo & {
  effects: {
    heatMax?: number;
    heatPerTick?: number;
    temporalFluxMax?: number;
  };
  heat?: number;
  isAutomationEnabled?: boolean;
  on?: number;

  name: ChronoForgeUpgrades;
};

export type VoidSpaceUpgradeInfo = AbstractTimeUpgradeInfo & {
  breakIronWill: true;

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
