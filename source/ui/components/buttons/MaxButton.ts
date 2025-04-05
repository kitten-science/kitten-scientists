import type { SettingMax } from "../../../settings/Settings.js";
import { Button, type ButtonOptions } from "../Button.js";
import type { UiComponent } from "../UiComponent.js";
import styles from "./MaxButton.module.css";

export type MaxButtonOptions = ThisType<MaxButton> & ButtonOptions;

export class MaxButton extends Button {
  declare readonly options: MaxButtonOptions;
  readonly setting: SettingMax;

  constructor(parent: UiComponent, setting: SettingMax, options: MaxButtonOptions) {
    super(parent, "", null, {
      ...options,
      classes: [styles.maxButton, ...(options?.classes ?? [])],
    });

    this.setting = setting;
  }

  toString(): string {
    return `[${MaxButton.name}#${this.componentId}]`;
  }
}
