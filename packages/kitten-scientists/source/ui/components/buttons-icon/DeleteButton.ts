import { Icons } from "../../../images/Icons";
import { UserScript } from "../../../UserScript";
import { IconButton } from "../IconButton";

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
  constructor(host: UserScript, title = "Delete") {
    super(host, Icons.Delete, title);
  }
}
