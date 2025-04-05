import type { KittenScientists } from "../../KittenScientists.js";
import { cl } from "../../tools/Log.js";

export type UiComponentInterface = EventTarget & {
  readonly children: Iterable<UiComponentInterface>;
  get element(): JQuery;
  refreshUi(): void;
  refresh(force?: boolean): void;
};

export type UiComponentOptions = {
  readonly children?: Array<UiComponentInterface>;
  readonly onClick?: (event?: MouseEvent) => void | Promise<void>;
  readonly onRefresh?: () => void;
};

export abstract class UiComponent extends EventTarget implements UiComponentInterface {
  /**
   * A reference to the host itself.
   */
  readonly host: KittenScientists;
  readonly parent: UiComponent | null;

  readonly options: UiComponentOptions | undefined;

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
  constructor(parent: UiComponent | { host: KittenScientists }, options?: UiComponentOptions) {
    super();
    this.host = parent.host;
    this.parent = parent instanceof UiComponent ? parent : null;
    this.options = options;
  }

  click() {
    return this.options?.onClick?.call(this);
  }

  private _needsRefresh = false;
  refresh(force = false) {
    if (force && !this._needsRefresh) {
      return;
    }

    this.options?.onRefresh?.call(this);

    for (const child of this.children) {
      child.refresh(force);
    }

    this._needsRefresh = !force;
  }

  refreshUi() {
    this.options?.onRefresh?.call(this);
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
