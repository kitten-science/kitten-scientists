import { roundTo } from "@oliversalzburg/js-utils/math/core.js";
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

  /**
   * Turns a string like 52.7 into the number 52.7
   * @param value - String representation of an absolute value.
   * @returns A number between 0 and Infinity, where Infinity is represented as -1.
   */
  static parseAbsolute(value: string | null): number | null {
    if (value === null || value === "") {
      return null;
    }

    const hasSuffix = /[KMGTP]$/i.test(value);
    const baseValue = value.substring(0, value.length - (hasSuffix ? 1 : 0));

    let numericValue =
      value.includes("e") || hasSuffix ? parseFloat(baseValue) : parseInt(baseValue);
    if (hasSuffix) {
      const suffix = value.substring(value.length - 1).toUpperCase();
      numericValue = numericValue * Math.pow(1000, ["", "K", "M", "G", "T", "P"].indexOf(suffix));
    }
    if (numericValue === Number.POSITIVE_INFINITY || numericValue < 0) {
      numericValue = -1;
    }

    return numericValue;
  }

  /**
   * Turns a string like 52.7 into the number 0.527
   * @param value - String representation of a percentage.
   * @returns A number between 0 and 1 representing the described percentage.
   */
  static parsePercentage(value: string): number {
    const cleanedValue = value.trim().replace(/%$/, "");
    return Math.max(0, Math.min(1, parseFloat(cleanedValue) / 100));
  }

  protected _renderLimit(value: number): string {
    return UiComponent.renderAbsolute(value, this._host);
  }

  /**
   * Turns a number into a game-native string representation.
   * Infinity, either by actual value or by -1 representation, is rendered as a symbol.
   * @param value - The number to render as a string.
   * @param host - The host instance which we can use to let the game render values for us.
   * @returns A string representing the given number.
   */
  static renderAbsolute(value: number, host: KittenScientists) {
    if (value < 0 || value === Number.POSITIVE_INFINITY) {
      return "∞";
    }

    return host.game.getDisplayValueExt(value);
  }

  /**
   * Turns a number like 0.527 into a string like 52.7
   * @param value - The number to render as a string.
   * @returns A string representing the given percentage.
   */
  static renderPercentage(value: number): string {
    return roundTo(100 * value, 3).toString();
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
