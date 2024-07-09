import { Icons } from "../../../images/Icons.js";
import { KittenScientists } from "../../../KittenScientists.js";
import { IconButton } from "../IconButton.js";

/**
 * A button that is intended to reset something when clicked.
 */
export class ResetButton extends IconButton {
  /**
   * Constructs a `RefreshButton`.
   *
   * @param host A reference to the host.
   */
  constructor(host: KittenScientists) {
    super(host, Icons.Reset, host.engine.i18n("ui.reset"));
  }
}
