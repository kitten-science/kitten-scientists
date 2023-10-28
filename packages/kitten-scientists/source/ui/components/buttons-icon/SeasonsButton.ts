import { Icons } from "../../../images/Icons.js";
import { UserScript } from "../../../UserScript.js";
import { IconButton } from "../IconButton.js";

/**
 * A button that is intended to give access to a season selection.
 */
export class SeasonsButton extends IconButton {
  /**
   * Constructs a `SeasonsButton`.
   *
   * @param host A reference to the host.
   */
  constructor(host: UserScript) {
    super(host, Icons.Seasons, host.engine.i18n("trade.seasons"));
  }
}
