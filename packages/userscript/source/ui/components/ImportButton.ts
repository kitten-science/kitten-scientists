import { UserScript } from "../../UserScript";
import { IconButton } from "./IconButton";

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
    super(
      host,
      "M22.5 40V21.45l-6 6-2.15-2.15L24 15.65l9.65 9.65-2.15 2.15-6-6V40ZM8 18.15V11q0-1.2.9-2.1Q9.8 8 11 8h26q1.2 0 2.1.9.9.9.9 2.1v7.15h-3V11H11v7.15Z",
      title
    );
  }
}
