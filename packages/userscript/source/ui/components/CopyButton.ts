import { UserScript } from "../../UserScript";
import { IconButton } from "./IconButton";

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
    super(
      host,
      "M9 43.95q-1.2 0-2.1-.9-.9-.9-.9-2.1V10.8h3v30.15h23.7v3Zm6-6q-1.2 0-2.1-.9-.9-.9-.9-2.1v-28q0-1.2.9-2.1.9-.9 2.1-.9h22q1.2 0 2.1.9.9.9.9 2.1v28q0 1.2-.9 2.1-.9.9-2.1.9Zm0-3h22v-28H15v28Zm0 0v-28 28Z",
      title
    );
  }
}
