import { is } from "@oliversalzburg/js-utils/data/nil.js";
import { Container } from "./Container.js";
import type { LabelListItem } from "./LabelListItem.js";
import stylesSettingListItem from "./SettingListItem.module.css";
import { UiComponent, type UiComponentInterface, type UiComponentOptions } from "./UiComponent.js";
import { ExpandoButton } from "./buttons/ExpandoButton.js";

export type CollapsiblePanelOptions = ThisType<CollapsiblePanel> &
  UiComponentOptions & {
    /**
     * Should the main child be expanded right away?
     */
    readonly initiallyExpanded?: boolean;
  };

/**
 * A `Panel` is a section of the UI that can be expanded and collapsed
 * through an expando button.
 * The panel also has a head element, which is extended to create the panel
 * behavior.
 */
export class CollapsiblePanel<THead extends LabelListItem = LabelListItem> extends UiComponent {
  declare readonly options: CollapsiblePanelOptions;
  protected readonly container: UiComponent;
  readonly element: JQuery;
  readonly expando: ExpandoButton;
  readonly head: THead;
  protected _mainChildVisible: boolean;

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
  constructor(parent: UiComponent, head: THead, options?: CollapsiblePanelOptions) {
    super(parent, {});

    this.head = head;
    this.container = new Container(this);
    this.container.element.addClass(stylesSettingListItem.panelContent);

    // The expando button for this panel.
    const expando = new ExpandoButton(parent, {
      onClick: () => this.toggle(),
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
    this.expando = expando;

    this.addChildren([this.head, this.container]);
  }

  toString(): string {
    return `[${CollapsiblePanel.name}#${this.componentId}]`;
  }

  addChildHead(child: UiComponentInterface): this {
    this.head.addChild(child);
    return this;
  }
  addChildrenHead(children?: Iterable<UiComponentInterface>): this {
    for (const child of children ?? []) {
      this.head.addChild(child);
    }
    return this;
  }

  addChildContent(child: UiComponent): this {
    this.container.addChild(child);
    return this;
  }
  addChildrenContent(children?: Iterable<UiComponentInterface>): this {
    for (const child of children ?? []) {
      this.container.addChild(child);
    }
    return this;
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
        this.container.requestRefresh();
        // Show the DOM element.
        this.container.element.removeClass(stylesSettingListItem.hidden);
        // Reflect expanded state on expando.
        this.expando.setExpanded();
        // Reflect expanded state for CSS.
        this.head.element.addClass(stylesSettingListItem.expanded);
        // This is NOT a DOM event! It can only be caught by listening on this panel directly.
        this.dispatchEvent(new CustomEvent("panelShown"));
      } else {
        this.container.element.addClass(stylesSettingListItem.hidden);
        this.expando.setCollapsed();
        this.head.element.removeClass(stylesSettingListItem.expanded);
        this.dispatchEvent(new CustomEvent("panelHidden"));
      }
    }

    if (toggleNested) {
      const toggleChildren = (children: Iterable<UiComponentInterface>) => {
        for (const child of children) {
          if (is<CollapsiblePanel>(child, CollapsiblePanel)) {
            child.toggle(expand, toggleNested);
          } else {
            toggleChildren(child.children);
          }
        }
      };

      toggleChildren(this.children);
    }
  }

  requestRefresh(withChildren = false, depth = 0) {
    super.requestRefresh(withChildren, depth);
    this.head.requestRefresh(true, depth + 1);
  }

  refreshUi(): void {}
}
