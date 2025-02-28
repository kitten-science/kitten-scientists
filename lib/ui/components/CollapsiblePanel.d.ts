import type { KittenScientists } from "../../KittenScientists.js";
import type { LabelListItem } from "./LabelListItem.js";
import { UiComponent, type UiComponentOptions } from "./UiComponent.js";
import { ExpandoButton } from "./buttons/ExpandoButton.js";
export type PanelOptions<TChild extends UiComponent = UiComponent> = UiComponentOptions<TChild> & {
  /**
   * Should the main child be expanded right away?
   */
  readonly initiallyExpanded: boolean;
};
/**
 * A `Panel` is a section of the UI that can be expanded and collapsed
 * through an expando button.
 * The panel also has a head element, which is extended to create the panel
 * behavior.
 */
export declare class CollapsiblePanel<
  TOptions extends PanelOptions = PanelOptions,
  THead extends LabelListItem = LabelListItem,
> extends UiComponent<TOptions> {
  protected readonly container: UiComponent;
  readonly element: JQuery;
  protected readonly _expando: ExpandoButton;
  protected readonly _head: THead;
  protected _mainChildVisible: boolean;
  protected readonly parent: CollapsiblePanel | undefined;
  get expando(): ExpandoButton;
  get isExpanded(): boolean;
  /**
   * Constructs a settings panel that is used to contain a single child element.
   *
   * @param host A reference to the host.
   * @param head Another component to host in the head of the panel.
   * @param options Options for this panel.
   */
  constructor(host: KittenScientists, head: THead, options?: Partial<TOptions>);
  addChild(child: UiComponent): void;
  /**
   * Control the visibility of the panel's contents.
   *
   * @param expand Should the panel be expanded? If not set, the panel is toggled.
   * @param toggleNested Also toggle all panels inside this panel?
   */
  toggle(expand?: boolean | undefined, toggleNested?: boolean): void;
}
//# sourceMappingURL=CollapsiblePanel.d.ts.map
