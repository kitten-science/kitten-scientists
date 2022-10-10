import { UserScript } from "../../UserScript";
import { UiComponent } from "./UiComponent";

/**
 * A button that is intended to disable something when clicked.
 */
export class DisableButton extends UiComponent {
  readonly element: JQuery<HTMLElement>;

  /**
   * Constructs a `DisableButton`.
   *
   * @param host A reference to the host.
   */
  constructor(host: UserScript) {
    super(host);

    const element = $("<div/>")
      .html(
        '<svg style="width: 15px; height: 15px;" viewBox="0 0 48 48"><path fill="currentColor" d="M9 42q-1.2 0-2.1-.9Q6 40.2 6 39V9q0-1.2.9-2.1Q7.8 6 9 6h30q1.2 0 2.1.9.9.9.9 2.1v30q0 1.2-.9 2.1-.9.9-2.1.9Zm0-3h30V9H9v30Z" /></svg>'
      )
      .prop("title", host.engine.i18n("ui.disable.all"))
      .addClass("ks-icon-button");

    this.element = element;
  }

  refreshUi() {
    /* intentionally left blank */
  }
}
