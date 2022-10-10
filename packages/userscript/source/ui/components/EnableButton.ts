import { UserScript } from "../../UserScript";
import { UiComponent } from "./UiComponent";

/**
 * A button that is intended to enable something when clicked.
 */
export class EnableButton extends UiComponent {
  readonly element: JQuery<HTMLElement>;

  /**
   * Constructs a `EnableButton`.
   *
   * @param host A reference to the host.
   */
  constructor(host: UserScript) {
    super(host);

    const element = $("<div/>")
      .html(
        '<svg style="width: 15px; height: 15px;" viewBox="0 0 48 48"><path fill="currentColor" d="M20.95 31.95 35.4 17.5l-2.15-2.15-12.3 12.3L15 21.7l-2.15 2.15ZM9 42q-1.2 0-2.1-.9Q6 40.2 6 39V9q0-1.2.9-2.1Q7.8 6 9 6h30q1.2 0 2.1.9.9.9.9 2.1v30q0 1.2-.9 2.1-.9.9-2.1.9Zm0-3h30V9H9v30ZM9 9v30V9Z" /></svg>'
      )
      .prop("title", host.engine.i18n("ui.enable.all"))
      .addClass("ks-icon-button");

    this.element = element;
  }

  refreshUi() {
    /* intentionally left blank */
  }
}
