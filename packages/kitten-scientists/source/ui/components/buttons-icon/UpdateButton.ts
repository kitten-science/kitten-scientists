import { Icons } from "../../../images/Icons.js";
import { UserScript } from "../../../UserScript.js";
import { IconButton } from "../IconButton.js";

/**
 * A button that is intended to initiate an update action.
 */
export class UpdateButton extends IconButton {
  /**
   * Constructs a `UpdateButton`.
   *
   * @param host A reference to the host.
   * @param title The `title` of the button.
   */
  constructor(host: UserScript, title = "Update") {
    super(host, Icons.Sync, title);
  }
}
