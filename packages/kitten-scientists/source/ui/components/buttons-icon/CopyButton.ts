import { Icons } from "../../../images/Icons.js";
import { UserScript } from "../../../UserScript.js";
import { IconButton } from "../IconButton.js";

/**
 * A button that is intended to initiate a copy action.
 */
export class CopyButton extends IconButton {
  /**
   * Constructs a `CopyButton`.
   *
   * @param host A reference to the host.
   * @param title The `title` of the button.
   */
  constructor(host: UserScript, title = "Copy to clipboard") {
    super(host, Icons.Copy, title);
  }
}
