import { Resource, ResourceCraftable } from ".";

export type ResourceInfo = {
  craftable: boolean;
  maxValue: number;
  name: Resource;
  title: string;
  value: number;
};

export type CraftableInfo = { name: ResourceCraftable; unlocked: boolean };
