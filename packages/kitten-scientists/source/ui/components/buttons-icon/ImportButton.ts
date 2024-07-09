import { Icons } from "../../../images/Icons.js";
import { KittenScientists } from "../../../KittenScientists.js";
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
  constructor(host: KittenScientists, title = "Import") {
    super(host, Icons.Import, title);
  }
}
