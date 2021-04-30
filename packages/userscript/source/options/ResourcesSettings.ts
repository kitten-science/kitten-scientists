import { Resource, ResourceCraftable } from "../types";

export type ResourcesSettingsItem = {
  consume?: number;
  $consume?: JQuery<HTMLElement>;

  enabled: boolean;
  $enabled?: JQuery<HTMLElement>;

  stock: number;
  $stock?: JQuery<HTMLElement>;
};
export type ResourceSettings = {
  [item in Resource]?: ResourcesSettingsItem;
};
