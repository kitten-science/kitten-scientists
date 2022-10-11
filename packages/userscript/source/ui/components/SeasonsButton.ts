import { UserScript } from "../../UserScript";
import { UiComponent } from "./UiComponent";

/**
 * A button that is intended to give access to a season selection.
 */
export class SeasonsButton extends UiComponent {
  readonly element: JQuery<HTMLElement>;

  /**
   * Constructs a `SeasonsButton`.
   *
   * @param host A reference to the host.
   */
  constructor(host: UserScript) {
    super(host);

    const element = $("<div/>", {
      html: '<svg style="width: 15px; height: 15px;" viewBox="0 0 48 48"><path fill="currentColor" d="M15.3 28.3q-.85 0-1.425-.575-.575-.575-.575-1.425 0-.85.575-1.425.575-.575 1.425-.575.85 0 1.425.575.575.575.575 1.425 0 .85-.575 1.425-.575.575-1.425.575Zm8.85 0q-.85 0-1.425-.575-.575-.575-.575-1.425 0-.85.575-1.425.575-.575 1.425-.575.85 0 1.425.575.575.575.575 1.425 0 .85-.575 1.425-.575.575-1.425.575Zm8.5 0q-.85 0-1.425-.575-.575-.575-.575-1.425 0-.85.575-1.425.575-.575 1.425-.575.85 0 1.425.575.575.575.575 1.425 0 .85-.575 1.425-.575.575-1.425.575ZM9 44q-1.2 0-2.1-.9Q6 42.2 6 41V10q0-1.2.9-2.1Q7.8 7 9 7h3.25V4h3.25v3h17V4h3.25v3H39q1.2 0 2.1.9.9.9.9 2.1v31q0 1.2-.9 2.1-.9.9-2.1.9Zm0-3h30V19.5H9V41Zm0-24.5h30V10H9Zm0 0V10v6.5Z"/></svg>',
      title: this._host.engine.i18n("trade.seasons"),
    }).addClass("ks-icon-button");

    this.element = element;
  }

  refreshUi() {
    /* intentionally left blank */
  }
}
