import { UserScript } from "../../UserScript";
import { ExpandoButton } from "./ExpandoButton";
import { LabelListItem } from "./LabelListItem";
import { UiComponent } from "./UiComponent";

export class Panel<TChild extends UiComponent = UiComponent> extends UiComponent {
  readonly element: JQuery<HTMLElement>;
  protected readonly _child: TChild;
  protected readonly _element: UiComponent;
  protected readonly _expando: ExpandoButton;
  protected _mainChildVisible: boolean;

  get isExpanded() {
    return this._mainChildVisible;
  }

  /**
   * Constructs a settings panel that is used to contain a major section of the UI.
   *
   * @param host A reference to the host.
   * @param label The label to put main checkbox of this section.
   * @param child Another compontent to host in the panel.
   * @param icon When set to an SVG path, will be used as an icon on the label.
   * @param initiallyExpanded Should the main child be expanded right away?
   */
  constructor(
    host: UserScript,
    label: string,
    child: TChild,
    icon: string | undefined = undefined,
    initiallyExpanded = false
  ) {
    super(host);

    this._child = child;

    const element = new LabelListItem(host, label, icon);
    this.children.add(element);
    this.children.add(child);

    // The expando button for this panel.
    const expando = new ExpandoButton(host);
    if (initiallyExpanded) {
      expando.setExpanded();
    }
    expando.element.on("click", () => {
      this.toggle();
    });

    element.element.append(expando.element, child.element);

    if (initiallyExpanded) {
      child.element.toggle();
    }

    this._element = element;
    this._mainChildVisible = initiallyExpanded;
    this.element = element.element;
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
    } else {
      this._child.element.hide();
      this._expando.setCollapsed();
    }
  }
}
