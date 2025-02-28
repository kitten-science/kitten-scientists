import { cerror } from "../../tools/Log.js";
export class UiComponent extends EventTarget {
  /**
   * A reference to the host itself.
   */
  _host;
  _options;
  children = new Set();
  _onClick;
  _onRefresh;
  /**
   * Constructs the base `UiComponent`.
   * Subclasses MUST add children from options when `this.element` is constructed.
   *
   * @param host A reference to the host.
   * @param options The options for this component.
   */
  constructor(host, options) {
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
  addChild(child) {
    this.children.add(child);
    this.element.append(child.element);
  }
  addChildren(children) {
    for (const child of children ?? []) {
      this.addChild(child);
    }
  }
  removeChild(child) {
    if (!this.children.has(child)) {
      return;
    }
    child.element.remove();
    this.children.delete(child);
  }
  removeChildren(children) {
    for (const child of children) {
      this.removeChild(child);
    }
  }
}
//# sourceMappingURL=UiComponent.js.map
