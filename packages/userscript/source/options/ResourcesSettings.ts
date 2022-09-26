import { Resource } from "../types";
import { Setting } from "./Settings";

export class ResourcesSettingsItem extends Setting {
  consume?: number;
  $consume?: JQuery<HTMLElement>;

  stock = 0;
  $stock?: JQuery<HTMLElement>;

  constructor(enabled: boolean, consume: number | undefined, stock: number) {
    super(enabled);
    this.consume = consume;
    this.stock = stock;
  }
}

export type ResourceSettings = {
  [item in Resource]?: ResourcesSettingsItem;
};
