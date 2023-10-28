import { cerror } from "../../tools/Log.js";
import { UserScript } from "../../UserScript.js";

export type UiComponentOptions<TChild extends UiComponent = UiComponent> = {
  readonly children: Array<TChild>;
  readonly onRefresh: <T extends UiComponent>(subject: T) => void;
};

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

  private readonly _onRefresh: UiComponentOptions["onRefresh"] | undefined;

  /**
   * Constructs the base `UiComponent`.
   * Subclasses MUST add children from options when `this.element` is constructed.
   *
   * @param host A reference to the host.
   * @param options The options for this component.
   */
  constructor(host: UserScript, options?: Partial<UiComponentOptions>) {
    super();
    this._host = host;
    this._onRefresh = options?.onRefresh;
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

  static promptLimit(text: string, defaultValue: string): number | null {
    const value = window.prompt(text, defaultValue);
    if (value === null || value === "") {
      return null;
    }

    const hasSuffix = /[KMGT]$/.test(value);
    const baseValue = value.substring(0, value.length - (hasSuffix ? 1 : 0));

    let numericValue =
      value.includes("e") || hasSuffix ? parseFloat(baseValue) : parseInt(baseValue);
    if (hasSuffix) {
      const suffix = value.substring(value.length - 1);
      numericValue = numericValue * Math.pow(1000, ["", "K", "M", "G", "T"].indexOf(suffix));
    }
    if (numericValue === Number.POSITIVE_INFINITY || numericValue < 0) {
      numericValue = -1;
    }

    return numericValue;
  }

  static promptPercentage(text: string, defaultValue: string): number | null {
    const value = window.prompt(text, defaultValue);
    if (value === null || value === "") {
      return null;
    }

    // Cap value between 0 and 1.
    return Math.max(0, Math.min(1, parseFloat(value)));
  }

  protected _renderLimit(value: number): string {
    return UiComponent.renderLimit(value, this._host);
  }

  static renderLimit(value: number, host: UserScript) {
    if (value < 0 || value === Number.POSITIVE_INFINITY) {
      return "∞";
    }

    return host.gamePage.getDisplayValueExt(value);
  }

  static renderPercentage(value: number): string {
    return value.toFixed(3);
  }

  static promptFloat(text: string, defaultValue: string): number | null {
    const value = window.prompt(text, defaultValue);
    if (value === null || value === "") {
      return null;
    }

    return parseFloat(value);
  }

  static renderFloat(value: number): string {
    return value.toFixed(3);
  }
}
