import { Setting } from "../../options/Settings";
import { UserScript } from "../../UserScript";
import { ExpandoButton } from "./ExpandoButton";
import { LabelListItem } from "./LabelListItem";
import { SettingsList } from "./SettingsList";
import { UiComponent } from "./UiComponent";

export class IconSettingsPanel<TSetting extends Setting = Setting> extends UiComponent {
  readonly settings: TSetting;
  readonly element: JQuery<HTMLElement>;
  protected readonly _element: LabelListItem;
  protected readonly _expando: ExpandoButton;
  readonly list: JQuery<HTMLElement>;
  protected readonly _list: SettingsList;
  protected _mainChildVisible: boolean;

  get isExpanded() {
    return this._mainChildVisible;
  }

  /**
   * Constructs a settings panel that is used to contain a major section of the UI.
   *
   * @param host A reference to the host.
   * @param label The label to put main checkbox of this section.
   * @param setting An setting for which this is the settings panel.
   * @param icon SVG path
   * @param initiallyExpanded Should the main child be expanded right away?
   */
  constructor(
    host: UserScript,
    label: string,
    setting: TSetting,
    icon: string | undefined,
    initiallyExpanded = false
  ) {
    super(host);

    const element = new LabelListItem(host, label, icon);
    this.children.add(element);

    const list = new SettingsList(host);
    this.children.add(list);

    // The expando button for this panel.
    const expando = new ExpandoButton(host);
    if (initiallyExpanded) {
      expando.setExpanded();
    }
    expando.element.on("click", () => {
      this.toggle();
    });

    element.element.append(expando.element, list.element);

    if (initiallyExpanded) {
      list.element.toggle();
    }

    this._element = element;
    this._list = list;
    this._mainChildVisible = initiallyExpanded;
    this.element = element.element;
    this._expando = expando;
    this.list = list.element;
    this.settings = setting;
  }

  override addChild(child: UiComponent) {
    this.children.add(child);
    this._list.element.append(child.element);
  }

  toggle(expand: boolean | undefined = undefined) {
    this._mainChildVisible = expand !== undefined ? expand : !this._mainChildVisible;
    if (this._mainChildVisible) {
      this.list.show();
      this._expando.setExpanded();
    } else {
      this.list.hide();
      this._expando.setCollapsed();
    }
  }
}
