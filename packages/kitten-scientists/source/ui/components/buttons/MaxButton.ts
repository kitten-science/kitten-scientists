import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { InvalidOperationError } from "@oliversalzburg/js-utils/errors/InvalidOperationError.js";
import { KittenScientists } from "../../../KittenScientists.js";
import { SettingMax } from "../../../settings/Settings.js";
import { Button, ButtonOptions } from "../Button.js";
import styles from "./MaxButton.module.css";

export type MaxButtonOptions = ButtonOptions & {
  readonly onRefresh: (subject: MaxButton) => void;
};

export class MaxButton extends Button {
  readonly setting: SettingMax;

  constructor(host: KittenScientists, setting: SettingMax, options?: Partial<MaxButtonOptions>) {
    super(host, "", null, {
      ...options,
      classes: [styles.maxButton, ...(options?.classes ?? [])],
      onClick: undefined,
    });

    if (isNil(options?.onClick)) {
      throw new InvalidOperationError("Missing click handler on MaxButton.");
    }

    this.element.on("click", () => {
      options.onClick?.(this);
    });
    this.setting = setting;
  }
}
