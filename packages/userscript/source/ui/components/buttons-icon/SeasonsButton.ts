import { Icons } from "../../../images/Icons";
import { UserScript } from "../../../UserScript";
import { IconButton } from "../IconButton";

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
