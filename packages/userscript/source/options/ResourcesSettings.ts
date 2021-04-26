import { ResourceCraftable } from "../types";

export type ResourcesSettingsItem = { consume?: number; enabled: boolean; stock: number };
export type ResourceSettings = {
  [item in ResourceCraftable]?: ResourcesSettingsItem;
};
