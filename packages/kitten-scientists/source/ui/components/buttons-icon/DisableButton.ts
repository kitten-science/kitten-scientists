import { Icons } from "../../../images/Icons";
import { UserScript } from "../../../UserScript";
import { IconButton } from "../IconButton";

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
