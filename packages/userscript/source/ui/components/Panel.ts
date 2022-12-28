import { UserScript } from "../../UserScript";
import { ExpandoButton } from "./ExpandoButton";
import { UiComponent } from "./UiComponent";

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
  readonly element: JQuery<HTMLElement>;
  protected readonly _child: TChild;
  protected readonly _expando: ExpandoButton;
  protected readonly _head: THead;
  protected _mainChildVisible: boolean;

  get isExpanded() {
    return this._mainChildVisible;
  }

  /**
   * Constructs a settings panel that is used to contain a single child element.
   *
   * @param host A reference to the host.
   * @param child Another component to host in the panel.
   * @param head Another component to host in the head of the panel.
   * @param initiallyExpanded Should the main child be expanded right away?
   */
  constructor(host: UserScript, child: TChild, head: THead, initiallyExpanded = false) {
    super(host);

    this._head = head;
    this._child = child;

    this.children.add(head);
    this.children.add(child);

    // The expando button for this panel.
    const expando = new ExpandoButton(host);
    if (initiallyExpanded) {
      expando.setExpanded();
    }
    expando.element.on("click", () => {
      this.toggle();
    });

    head.element.append(expando.element, child.element);

    if (initiallyExpanded) {
      child.element.toggle();
    }

    this._mainChildVisible = initiallyExpanded;
    this.element = head.element;
    this._expando = expando;
  }

  override addChild(child: UiComponent) {
    throw new Error("A panel can only host a single child.");
  }

  toggle(expand: boolean | undefined = undefined) {
    this._mainChildVisible = expand !== undefined ? expand : !this._mainChildVisible;
    if (this._mainChildVisible) {
      this._child.element.show();
      this._expando.setExpanded();
      this._head.element.addClass("ks-expanded");
    } else {
      this._child.element.hide();
      this._expando.setCollapsed();
      this._head.element.removeClass("ks-expanded");
    }
  }
}
