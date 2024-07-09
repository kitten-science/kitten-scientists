import { Icons } from "../../../images/Icons.js";
import { KittenScientists } from "../../../KittenScientists.js";
import { IconButton } from "../IconButton.js";

/**
 * A button that is intended to initiate a delete action.
 */
export class DeleteButton extends IconButton {
  /**
   * Constructs a `DeleteButton`.
   *
   * @param host A reference to the host.
   * @param title The `title` of the button.
   */
  constructor(host: KittenScientists, title = "Delete") {
    super(host, Icons.Delete, title);
  }
}
