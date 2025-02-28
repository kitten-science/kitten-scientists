import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { InvalidOperationError } from "@oliversalzburg/js-utils/errors/InvalidOperationError.js";
import { Button } from "../Button.js";
import styles from "./MaxButton.module.css";
export class MaxButton extends Button {
  setting;
  constructor(host, setting, options) {
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
//# sourceMappingURL=MaxButton.js.map
