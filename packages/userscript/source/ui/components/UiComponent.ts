import { UserScript } from "../../UserScript";

export abstract class UiComponent extends EventTarget {
  /**
   * A reference to the host itself.
   */
  protected readonly _host: UserScript;

  /**
   * The main DOM element for this component, in a JQuery wrapper.
   */
  abstract readonly element: JQuery<HTMLElement>;

  constructor(host: UserScript) {
    super();
    this._host = host;
  }

  abstract refreshUi(): void;
}
