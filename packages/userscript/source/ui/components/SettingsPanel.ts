import { SettingsSection } from "../../options/SettingsSection";
import { UserScript } from "../../UserScript";
import { ExpandoButton } from "./ExpandoButton";
import { SettingListItem } from "./SettingListItem";
import { SettingsList } from "./SettingsList";
import { UiComponent } from "./UiComponent";

export class SettingsPanel extends UiComponent {
  readonly host: UserScript;
  readonly settings: SettingsSection;
  readonly element: JQuery<HTMLElement>;
  private readonly _element: SettingListItem;
  private readonly _expando: ExpandoButton;
  readonly list: JQuery<HTMLElement>;
  readonly _list: SettingsList;
  private _mainChildVisible: boolean;

  get isExpanded() {
    return this._mainChildVisible;
  }

  /**
   * Constructs a settings panel that is used to contain a major section of the UI.
   *
   * @param host A reference to the host.
   * @param id The ID of the settings panel.
   * @param label The label to put main checkbox of this section.
   * @param settings An options section for which this is the settings panel.
   * @param initiallyExpanded Should the main child be expanded right away?
   */
  constructor(
    host: UserScript,
    id: string,
    label: string,
    settings: SettingsSection,
    initiallyExpanded = false
  ) {
    super(host);

    const element = new SettingListItem(host, id, label, settings, {
      onCheck: () => host.engine.imessage("status.auto.enable", [label]),
      onUnCheck: () => host.engine.imessage("status.auto.disable", [label]),
    });

    const list = new SettingsList(host, id);

    // The expando button for this panel.
    const expando = new ExpandoButton(host, id);
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
    this.host = host;
    this.list = list.element;
    this.settings = settings;
  }

  refreshUi() {
    this._element.refreshUi();
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
