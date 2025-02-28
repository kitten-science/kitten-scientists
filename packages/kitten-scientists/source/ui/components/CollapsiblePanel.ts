import { is } from "@oliversalzburg/js-utils/data/nil.js";
import type { KittenScientists } from "../../KittenScientists.js";
import { Container } from "./Container.js";
import type { LabelListItem } from "./LabelListItem.js";
import stylesSettingListItem from "./SettingListItem.module.css";
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
export class CollapsiblePanel<
  TOptions extends PanelOptions = PanelOptions,
  THead extends LabelListItem = LabelListItem,
> extends UiComponent<TOptions> {
  protected readonly container: UiComponent;
  readonly element: JQuery;
  protected readonly _expando: ExpandoButton;
  protected readonly _head: THead;
  protected _mainChildVisible: boolean;
  protected readonly parent: CollapsiblePanel | undefined;

  get expando() {
    return this._expando;
  }

  get isExpanded() {
    return this._mainChildVisible;
  }

  /**
   * Constructs a settings panel that is used to contain a single child element.
   *
   * @param host A reference to the host.
   * @param head Another component to host in the head of the panel.
   * @param options Options for this panel.
   */
  constructor(host: KittenScientists, head: THead, options?: Partial<TOptions>) {
    super(host, options);

    this.container = new Container(host);
    this.container.element.addClass(stylesSettingListItem.panelContent);
    this.children.add(this.container);

    this._head = head;
    this.children.add(head);

    // The expando button for this panel.
    const expando = new ExpandoButton(host);
    expando.element.on("click", () => {
      this.toggle();
    });
    head.head.addChild(expando);

    head.element.append(this.container.element);

    if (options?.initiallyExpanded) {
      this.container.element.removeClass(stylesSettingListItem.hidden);
      expando.setExpanded();
    } else {
      this.container.element.addClass(stylesSettingListItem.hidden);
    }

    this._mainChildVisible = options?.initiallyExpanded ?? false;
    this.element = head.element;
    this.addChildren(options?.children);
    this._expando = expando;
  }

  override addChild(child: UiComponent) {
    this.children.add(child);
    this.container.element.append(child.element);
  }

  /**
   * Control the visibility of the panel's contents.
   *
   * @param expand Should the panel be expanded? If not set, the panel is toggled.
   * @param toggleNested Also toggle all panels inside this panel?
   */
  toggle(expand: boolean | undefined = undefined, toggleNested = false) {
    const visible = expand !== undefined ? expand : !this._mainChildVisible;
    if (visible !== this._mainChildVisible) {
      this._mainChildVisible = visible;
      if (this._mainChildVisible) {
        // Refresh panel UI on expand.
        this.container.refreshUi();
        // Show the DOM element.
        this.container.element.removeClass(stylesSettingListItem.hidden);
        // Reflect expanded state on expando.
        this._expando.setExpanded();
        // Reflect expanded state for CSS.
        this._head.element.addClass(stylesSettingListItem.expanded);
        // This is NOT a DOM event! It can only be caught by listening on this panel directly.
        this.dispatchEvent(new CustomEvent("panelShown"));
      } else {
        this.container.element.addClass(stylesSettingListItem.hidden);
        this._expando.setCollapsed();
        this._head.element.removeClass(stylesSettingListItem.expanded);
        this.dispatchEvent(new CustomEvent("panelHidden"));
      }
    }

    if (toggleNested) {
      const toggleChildren = (children: Set<TOptions["children"][0]>) => {
        for (const child of children) {
          if (is(child, CollapsiblePanel)) {
            (child as CollapsiblePanel).toggle(expand, toggleNested);
          } else {
            toggleChildren((child as UiComponent<TOptions>).children);
          }
        }
      };

      toggleChildren(this.children);
    }
  }
}
