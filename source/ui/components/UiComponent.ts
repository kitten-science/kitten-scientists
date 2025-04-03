import type { KittenScientists } from "../../KittenScientists.js";
import { cl } from "../../tools/Log.js";

export type UiComponentInterface = EventTarget & {
  get element(): JQuery;
  refreshUi(): void;
};

export type UiComponentOptions<TChild extends UiComponentInterface = UiComponentInterface> = {
  readonly children: Array<TChild>;
  readonly onClick: (subject: UiComponent) => void;
  readonly onRefresh: (subject: UiComponent) => void;
};

export abstract class UiComponent<TOptions extends UiComponentOptions = UiComponentOptions>
  extends EventTarget
  implements UiComponentInterface
{
  /**
   * A reference to the host itself.
   */
  protected readonly _host: KittenScientists;

  protected readonly _options: Partial<TOptions>;

  /**
   * The main DOM element for this component, in a JQuery wrapper.
   */
  abstract readonly element: JQuery;

  readonly children = new Set<TOptions["children"][0]>();

  protected readonly _onClick: TOptions["onClick"] | undefined;
  protected readonly _onRefresh: TOptions["onRefresh"] | undefined;

  /**
   * Constructs the base `UiComponent`.
   * Subclasses MUST add children from options when `this.element` is constructed.
   *
   * @param host A reference to the host.
   * @param options The options for this component.
   */
  constructor(host: KittenScientists, options?: Partial<TOptions>) {
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
        console.error(...cl("Error while refreshing child component!", error));
      }
    }
  }

  addChild(child: TOptions["children"][0]) {
    this.children.add(child);
    this.element.append(child.element);
  }
  addChildren(children?: Iterable<TOptions["children"][0]>) {
    for (const child of children ?? []) {
      this.addChild(child);
    }
  }

  removeChild(child: TOptions["children"][0]) {
    if (!this.children.has(child)) {
      return;
    }

    child.element.remove();
    this.children.delete(child);
  }
  removeChildren(children: Iterable<TOptions["children"][0]>) {
    for (const child of children) {
      this.removeChild(child);
    }
  }
}
