import { Icons } from "../../../images/Icons";
import { UserScript } from "../../../UserScript";
import { IconButton } from "../IconButton";

/**
 * A button that is intended to reset something when clicked.
 */
export class ResetButton extends IconButton {
  /**
   * Constructs a `RefreshButton`.
   *
   * @param host A reference to the host.
   */
  constructor(host: UserScript) {
    super(host, Icons.Reset, host.engine.i18n("ui.reset"));
  }
}
