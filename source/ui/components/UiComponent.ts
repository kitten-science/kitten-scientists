import type { KittenScientists } from "../../KittenScientists.js";
import { cl } from "../../tools/Log.js";

export type UiComponentInterface = EventTarget & {
  readonly children: Iterable<UiComponentInterface>;
  get element(): JQuery;
  refreshUi(): void;
};

export type UiComponentOptions = {
  readonly children?: Array<UiComponentInterface>;
  readonly onClick?: (event?: MouseEvent) => void;
  readonly onRefresh?: () => void;
};

export abstract class UiComponent extends EventTarget implements UiComponentInterface {
  /**
   * A reference to the host itself.
   */
  protected readonly _host: KittenScientists;

  protected readonly _options: UiComponentOptions | undefined;

  /**
   * The main DOM element for this component, in a JQuery wrapper.
   */
  abstract readonly element: JQuery;

  /**
   * NOTE: It is intentional that all children are of the most fundamental base type.
   * If a more specifically typed reference for a child is required, it should be stored
   * on construction.
   * The 'children' set is intended only for inter-component orchestration.
   */
  readonly children = new Set<UiComponentInterface>();

  /**
   * Constructs the base `UiComponent`.
   * Subclasses MUST add children from options when `this.element` is constructed.
   *
   * @param host A reference to the host.
   * @param options The options for this component.
   */
  constructor(host: KittenScientists, options?: UiComponentOptions) {
    super();
    this._host = host;
    this._options = options;
  }

  click() {
    this._options?.onClick?.call(this);
  }

  refreshUi() {
    this._options?.onRefresh?.call(this);
    for (const child of this.children) {
      try {
        child.refreshUi();
      } catch (error) {
        console.error(...cl("Error while refreshing child component!", error));
      }
    }
  }

  addChild(child: UiComponentInterface) {
    this.children.add(child);
    this.element.append(child.element);
  }
  addChildren(children?: Iterable<UiComponentInterface>) {
    for (const child of children ?? []) {
      this.addChild(child);
    }
  }

  removeChild(child: UiComponentInterface) {
    if (!this.children.has(child)) {
      return;
    }

    child.element.remove();
    this.children.delete(child);
  }
  removeChildren(children: Iterable<UiComponentInterface>) {
    for (const child of children) {
      this.removeChild(child);
    }
  }
}
