import { KittenScientists } from "../../KittenScientists.js";
import { cerror } from "../../tools/Log.js";

export type UiComponentOptions<TChild extends UiComponent = UiComponent> = {
  readonly children: Array<TChild>;
  readonly classes: Array<string>;
  readonly onClick: (subject: UiComponent) => void;
  readonly onRefresh: (subject: UiComponent) => void;
};

export abstract class UiComponent extends EventTarget {
  /**
   * A reference to the host itself.
   */
  protected readonly _host: KittenScientists;

  protected readonly _options: Partial<UiComponentOptions>;

  /**
   * The main DOM element for this component, in a JQuery wrapper.
   */
  abstract readonly element: JQuery;

  readonly children = new Set<UiComponent>();

  protected readonly _onClick: UiComponentOptions["onClick"] | undefined;
  protected readonly _onRefresh: UiComponentOptions["onRefresh"] | undefined;

  /**
   * Constructs the base `UiComponent`.
   * Subclasses MUST add children from options when `this.element` is constructed.
   *
   * @param host A reference to the host.
   * @param options The options for this component.
   */
  constructor(host: KittenScientists, options?: Partial<UiComponentOptions>) {
    super();
    this._host = host;
    this._options = options ?? {};
    this._onClick = options?.onClick;
    this._onRefresh = options?.onRefresh;
  }

  click() {
    this._onClick?.(this);
  }

  refreshUi() {
    this._onRefresh?.(this);
    for (const child of this.children) {
      try {
        child.refreshUi();
      } catch (error) {
        cerror("Error while refreshing child component!", error);
      }
    }
  }

  addChild(child: UiComponent) {
    this.children.add(child);
    this.element.append(child.element);
  }
  addChildren(children?: Iterable<UiComponent>) {
    for (const child of children ?? []) {
      this.addChild(child);
    }
  }

  removeChild(child: UiComponent) {
    if (!this.children.has(child)) {
      return;
    }

    child.element.remove();
    this.children.delete(child);
  }
  removeChildren(children: Iterable<UiComponent>) {
    for (const child of children) {
      this.removeChild(child);
    }
  }
}
