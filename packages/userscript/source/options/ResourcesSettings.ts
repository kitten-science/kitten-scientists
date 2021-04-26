import { Resource } from "../types";

export type ResourcesSettingsItem = { consume?: number; enabled: boolean; stock: number };
export type ResourceSettings = {
  [item in Resource]?: ResourcesSettingsItem;
};
