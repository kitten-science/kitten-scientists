import { mustExist } from "@oliversalzburg/js-utils/data/nil.js";
import type { KittenScientists } from "../../KittenScientists.js";
import { cl } from "../../tools/Log.js";

export type UiComponentInterface = {
  readonly children: Iterable<UiComponentInterface>;
  parent: UiComponentInterface | null;
  get element(): JQuery<HTMLElement>;
  requestRefresh(withChildren?: boolean, depth?: number, trace?: boolean): void;
  refresh(force?: boolean, depth?: number): void;
};

export type UiComponentOptions = {
  length?: never;
  readonly onRefresh?: () => void;
  readonly onRefreshRequest?: () => void;
};

export abstract class UiComponent<TElement extends HTMLElement = HTMLElement>
  implements UiComponentInterface
{
  private static nextComponentId = 0;
  readonly componentId: number;

  /**
   * A reference to the host itself.
   */
  readonly host: KittenScientists;
  parent: UiComponentInterface | null;

  readonly options: UiComponentOptions | undefined;

  /**
   * The main DOM element for this component, in a JQuery wrapper.
   */
  protected _element: JQuery<TElement> | undefined;

  protected set element(value: JQuery<TElement>) {
    this._element = value;
    this._element[0].id = `KS${Object.getPrototypeOf(this).constructor.name}#${this.componentId}`;
  }
  get element(): JQuery<TElement> {
    return mustExist(this._element);
  }

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
    this.componentId = UiComponent.nextComponentId++;

    this.host = parent.host;
    this.options = options;
    this.parent = parent instanceof UiComponent ? parent : null;
    this._needsRefresh = false;
  }

  abstract toString(): string;

  protected _needsRefresh;
  requestRefresh(withChildren = false, depth = 0, trace = false) {
    if (trace) {
      console.debug(
        ...cl(
          depth < 0 ? "⤒".repeat(depth * -1) : " ".repeat(depth),
          this.toString(),
          "requestRefresh()",
        ),
      );
    }

    this.options?.onRefreshRequest?.call(this);

    if (this.parent !== this && !withChildren) {
      this.parent?.requestRefresh(false, depth - 1, trace);
    }

    if (this._needsRefresh) {
      if (trace) {
        console.debug(
          ...cl(
            depth < 0 ? "⤒".repeat(depth * -1) : " ".repeat(depth),
            this.toString(),
            "requestRefresh() <already pending>",
          ),
        );
      }
    }

    this._needsRefresh = true;

    if (withChildren) {
      if (trace) {
        console.debug(
          ...cl(
            depth < 0 ? "⤒".repeat(depth * -1) : " ".repeat(depth),
            this.toString(),
            "requestRefresh()",
            `+ ${this.children.size} children`,
          ),
        );
      }
      for (const child of this.children) {
        child.requestRefresh(true, depth + 1, trace);
      }
    } else {
      if (trace) {
        console.debug(
          ...cl(
            depth < 0 ? "⤒".repeat(depth * -1) : " ".repeat(depth),
            this.toString(),
            "requestRefresh()",
            "<queued>",
          ),
        );
      }
    }
  }

  refresh(force = false, depth = 0) {
    if (!force && !this._needsRefresh) {
      if (depth === 0) {
        console.debug(...cl(this.toString(), "refresh() received and ignored."));
      }
      return;
    }

    // WARNING: Enable this section only during refresh logic debugging!
    //          When this was implemented, a full refresh logged 16K messages.
    //          Even when these are filtered from the JS console, there are
    //          noticeable performance issues. DO NOT ENABLE THIS UNLESS YOU NEED TO.
    /*
    if (!force) {
      console.debug(
        ...cl(
          depth < 0 ? "⤒".repeat(depth * -1) : " ".repeat(depth),
          this.toString(),
          "refresh",
          typeof this.options?.onRefresh !== "undefined" ? "with onRefresh()" : "",
        ),
      );
    }
    */

    this.options?.onRefresh?.call(this);
    for (const child of this.children) {
      child.refresh(force, depth + 1);
    }

    this._needsRefresh = false;
  }

  addChild(child: UiComponentInterface): this {
    child.parent = this;
    this.children.add(child);
    this.element.append(child.element);
    return this;
  }
  addChildren(children?: Iterable<UiComponentInterface>): this {
    for (const child of children ?? []) {
      this.addChild(child);
    }
    return this;
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
