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

  readonly children = new Set<UiComponent>();

  constructor(host: UserScript) {
    super();
    this._host = host;
  }

  refreshUi() {
    for (const child of this.children) {
      child.refreshUi();
    }
  }

  addChild(child: UiComponent) {
    this.children.add(child);
    this.element.append(child.element);
  }
  addChildren(children: Iterable<UiComponent>) {
    for (const child of children) {
      this.addChild(child);
    }
  }
}
