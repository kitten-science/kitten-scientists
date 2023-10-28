import { Resource, ResourceCraftable } from "./index.js";

export type ResourceInfo = {
  craftable: boolean;
  maxValue: number;
  name: Resource;
  title: string;
  unlocked: boolean;
  value: number;
};

export type CraftableInfo = { name: ResourceCraftable; tier: number; unlocked: boolean };
