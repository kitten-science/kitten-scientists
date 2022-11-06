import { UserScript } from "../../UserScript";
import { IconButton } from "./IconButton";

/**
 * A button that is intended to disable something when clicked.
 */
export class DisableButton extends IconButton {
  /**
   * Constructs a `DisableButton`.
   *
   * @param host A reference to the host.
   */
  constructor(host: UserScript) {
    super(
      host,
      "M9 42q-1.2 0-2.1-.9Q6 40.2 6 39V9q0-1.2.9-2.1Q7.8 6 9 6h30q1.2 0 2.1.9.9.9.9 2.1v30q0 1.2-.9 2.1-.9.9-2.1.9Zm0-3h30V9H9v30Z",
      host.engine.i18n("ui.disable.all")
    );
  }
}
