import { UserScript } from "../../UserScript";
import { UiComponent } from "./UiComponent";

/**
 * A button that is intended to initiate an import action.
 */
export class ImportButton extends UiComponent {
  readonly element: JQuery<HTMLElement>;

  /**
   * Constructs a `ImportButton`.
   *
   * @param host A reference to the host.
   */
  constructor(host: UserScript) {
    super(host);

    const element = $("<div/>", {
      html: '<svg style="width: 15px; height: 15px;" viewBox="0 0 48 48"><path fill="currentColor" d="M22.5 40V21.45l-6 6-2.15-2.15L24 15.65l9.65 9.65-2.15 2.15-6-6V40ZM8 18.15V11q0-1.2.9-2.1Q9.8 8 11 8h26q1.2 0 2.1.9.9.9.9 2.1v7.15h-3V11H11v7.15Z"/></svg>',
      title: "Import",
    }).addClass("ks-icon-button");

    this.element = element;
  }
}
