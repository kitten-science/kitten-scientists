import { Icons } from "../../../images/Icons.js";
import { UserScript } from "../../../UserScript.js";
import { IconButton } from "../IconButton.js";

/**
 * A button that is intended to initiate an import action.
 */
export class ImportButton extends IconButton {
  /**
   * Constructs a `ImportButton`.
   *
   * @param host A reference to the host.
   * @param title The `title` of the button.
   */
  constructor(host: UserScript, title = "Import") {
    super(host, Icons.Import, title);
  }
}
