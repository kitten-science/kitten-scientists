import { Resource } from "../types";
import { SettingToggle } from "./SettingsSection";

export type ResourcesSettingsItem = SettingToggle & {
  consume?: number;
  $consume?: JQuery<HTMLElement>;

  stock: number;
  $stock?: JQuery<HTMLElement>;
};
export type ResourceSettings = {
  [item in Resource]?: ResourcesSettingsItem;
};
