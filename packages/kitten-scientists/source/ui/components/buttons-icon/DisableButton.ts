import { Icons } from "../../../images/Icons.js";
import { UserScript } from "../../../UserScript.js";
import { IconButton } from "../IconButton.js";

/**
 * A button that is intended to disable something when clicked.
 */
export class DisableButton extends IconButton {
  /**
   * Constructs a `DisableButton`.
   *
   * @param host A reference to the host.
   */
  constructor(host: UserScript) {
    super(host, Icons.CheckboxUnCheck, host.engine.i18n("ui.disable.all"));
  }
}
