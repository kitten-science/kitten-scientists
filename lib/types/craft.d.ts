import type { Price, Resource, ResourceCraftable } from "./index.js";
export type ResourceInfo = {
  calculatePerDay?: boolean;
  calculatePerYear?: boolean;
  color?: string;
  craftable?: boolean;
  description?: string;
  maxValue: number;
  name: Resource;
  tag?: string;
  title: string;
  type: "common" | "uncommon";
  unlocked: boolean;
  value: number;
};
export type CraftableInfo = {
  name: ResourceCraftable;
  label: string;
  description: string;
  prices: Array<Price>;
  ignoreBonuses?: boolean;
  progressHandicap: number;
  tier: number;
  unlocked?: boolean;
};
//# sourceMappingURL=craft.d.ts.map
