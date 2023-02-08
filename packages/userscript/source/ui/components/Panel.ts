import { is } from "../../tools/Maybe";
import { UserScript } from "../../UserScript";
import { Container } from "./Container";
import { ExpandoButton } from "./ExpandoButton";
import { UiComponent, UiComponentOptions } from "./UiComponent";

export type PanelOptions<TChild extends UiComponent = UiComponent> = UiComponentOptions<TChild> & {
  /**
   * Should the main child be expanded right away?
   */
  initiallyExpanded: boolean;
};

/**
 * A `Panel` is a section of the UI that can be expanded and collapsed
 * through an expando button.
 * The panel also has a head element, which is extended to create the panel
 * behavior.
 */
export class Panel<
  TChild extends UiComponent = UiComponent,
  THead extends UiComponent = UiComponent
> extends UiComponent {
  protected readonly container: UiComponent;
  readonly element: JQuery<HTMLElement>;
  protected readonly _expando: ExpandoButton;
  protected readonly _head: THead;
  protected _mainChildVisible: boolean;
  protected readonly parent: Panel | undefined;

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
  constructor(host: UserScript, head: THead, options?: Partial<PanelOptions<TChild>>) {
    super(host, options);

    this.container = new Container(host);
    this.container.element.addClass("ks-panel-content");
    this.children.add(this.container);

    this._head = head;
    this.children.add(head);

    // The expando button for this panel.
    const expando = new ExpandoButton(host);
    expando.element.on("click", () => {
      this.toggle();
    });

    head.element.append(expando.element, this.container.element);

    if (options?.initiallyExpanded) {
      this.container.element.show();
      expando.setExpanded();
    } else {
      this.container.element.hide();
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
        this.container.element.show();
        // Reflect expanded state on expando.
        this._expando.setExpanded();
        // Reflect expanded state for CSS.
        this._head.element.addClass("ks-expanded");
        // This is NOT a DOM event! It can only be caught by listening on this panel directly.
        this.dispatchEvent(new CustomEvent("panelShown"));
      } else {
        this.container.element.hide();
        this._expando.setCollapsed();
        this._head.element.removeClass("ks-expanded");
        this.dispatchEvent(new CustomEvent("panelHidden"));
      }
    }

    if (toggleNested) {
      const toggleChildren = (children: Set<UiComponent>) => {
        for (const child of children) {
          if (is(child, Panel)) {
            (child as Panel).toggle(expand, toggleNested);
          } else {
            toggleChildren((child as UiComponent).children);
          }
        }
      };

      toggleChildren(this.children);
    }
  }
}
