import type { KittenScientists } from "../../KittenScientists.js";
export type UiComponentInterface = EventTarget & {
  get element(): JQuery;
  refreshUi(): void;
};
export type UiComponentOptions<TChild extends UiComponentInterface = UiComponentInterface> = {
  readonly children: Array<TChild>;
  readonly classes: Array<string>;
  readonly onClick: (subject: UiComponent) => void;
  readonly onRefresh: (subject: UiComponent) => void;
};
export declare abstract class UiComponent<TOptions extends UiComponentOptions = UiComponentOptions>
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
  readonly children: Set<TOptions["children"][0]>;
  protected readonly _onClick: TOptions["onClick"] | undefined;
  protected readonly _onRefresh: TOptions["onRefresh"] | undefined;
  /**
   * Constructs the base `UiComponent`.
   * Subclasses MUST add children from options when `this.element` is constructed.
   *
   * @param host A reference to the host.
   * @param options The options for this component.
   */
  constructor(host: KittenScientists, options?: Partial<TOptions>);
  click(): void;
  refreshUi(): void;
  addChild(child: TOptions["children"][0]): void;
  addChildren(children?: Iterable<TOptions["children"][0]>): void;
  removeChild(child: TOptions["children"][0]): void;
  removeChildren(children: Iterable<TOptions["children"][0]>): void;
}
//# sourceMappingURL=UiComponent.d.ts.map
