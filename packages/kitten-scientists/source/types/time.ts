import { BuildingEffects, GameTab, Panel, Price } from "./index.js";

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

export const ChronoForgeUpgrades = [
  "blastFurnace",
  "ressourceRetrieval",
  "temporalAccelerator",
  "temporalBattery",
  "temporalImpedance",
  "temporalPress",
  "timeBoiler",
] as const;
export type ChronoForgeUpgrade = (typeof ChronoForgeUpgrades)[number];

export const VoidSpaceUpgrades = [
  "cryochambers",
  "usedCryochambers",
  "voidHoover",
  "voidRift",
  "chronocontrol",
  "voidResonator",
] as const;
export type VoidSpaceUpgrade = (typeof VoidSpaceUpgrades)[number];

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
  effects: Partial<BuildingEffects>;
  heat?: number;
  isAutomationEnabled?: boolean;
  on?: number;

  name: ChronoForgeUpgrade;
};

export type VoidSpaceUpgradeInfo = AbstractTimeUpgradeInfo & {
  breakIronWill: boolean;

  effects: Partial<BuildingEffects>;
  flavor: string;
  limitBuild: 0;
  name: VoidSpaceUpgrade;
  fixPrices?: Array<Price>;
  upgrades?: {
    voidSpace: Array<"cryochambers">;
  };
  val: number;
};
