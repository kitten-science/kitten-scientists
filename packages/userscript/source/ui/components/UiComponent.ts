import { UserScript } from "../../UserScript";

export abstract class UiComponent {
  /**
   * A reference to the host itself.
   */
  readonly host: UserScript;

  /**
   * The main DOM element for this component, in a JQuery wrapper.
   */
  abstract readonly element: JQuery<HTMLElement>;

  constructor(host: UserScript) {
    this.host = host;
  }

  abstract refreshUi(): void;
}
