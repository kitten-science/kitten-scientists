import type { BuildingEffects, GameTab, Panel, Price } from "./index.js";
export declare enum TimeItemVariant {
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
export declare const ChronoForgeUpgrades: readonly [
  "blastFurnace",
  "ressourceRetrieval",
  "temporalAccelerator",
  "temporalBattery",
  "temporalImpedance",
  "temporalPress",
  "timeBoiler",
];
export type ChronoForgeUpgrade = (typeof ChronoForgeUpgrades)[number];
export declare const VoidSpaceUpgrades: readonly [
  "cryochambers",
  "usedCryochambers",
  "voidHoover",
  "voidRift",
  "chronocontrol",
  "voidResonator",
];
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
//# sourceMappingURL=time.d.ts.map
