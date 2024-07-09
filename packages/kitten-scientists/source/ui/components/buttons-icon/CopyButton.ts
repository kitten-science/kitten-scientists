import { Icons } from "../../../images/Icons.js";
import { KittenScientists } from "../../../KittenScientists.js";
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
  constructor(host: KittenScientists, title = "Copy to clipboard") {
    super(host, Icons.Copy, title);
  }
}
