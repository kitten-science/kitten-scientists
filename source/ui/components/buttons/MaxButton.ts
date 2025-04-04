import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { InvalidOperationError } from "@oliversalzburg/js-utils/errors/InvalidOperationError.js";
import type { KittenScientists } from "../../../KittenScientists.js";
import type { SettingMax } from "../../../settings/Settings.js";
import { Button, type ButtonOptions } from "../Button.js";
import styles from "./MaxButton.module.css";

export type MaxButtonOptions = ButtonOptions & {
  readonly onRefresh?: (subject: MaxButton) => void;
};

export class MaxButton extends Button {
  declare readonly _options: MaxButtonOptions;
  readonly setting: SettingMax;

  constructor(host: KittenScientists, setting: SettingMax, options?: MaxButtonOptions) {
    super(host, "", null, {
      ...options,
      classes: [styles.maxButton, ...(options?.classes ?? [])],
    });

    if (isNil(options?.onClick)) {
      throw new InvalidOperationError("Missing click handler on MaxButton.");
    }

    this.setting = setting;
  }
}
