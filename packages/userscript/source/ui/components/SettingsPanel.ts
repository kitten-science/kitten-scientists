import { SettingsSection } from "../../options/SettingsSection";
import { UserScript } from "../../UserScript";
import { SettingsListUi } from "../SettingsListUi";
import { SettingListItem } from "./SettingListItem";

export class SettingsPanel {
  readonly host: UserScript;
  readonly settings: SettingsSection;
  readonly element: JQuery<HTMLElement>;
  private readonly _element: SettingListItem;
  readonly expando: JQuery<HTMLElement>;
  readonly list: JQuery<HTMLElement>;
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
    this.host = host;
    const element = new SettingListItem(host, id, label, settings, {
      onCheck: () => host.engine.imessage("status.auto.enable", [label]),
      onUnCheck: () => host.engine.imessage("status.auto.disable", [label]),
    });

    const list = SettingsListUi.getSettingsList(host.engine, id);

    // The expando button for this panel.
    const itemsElement = SettingsPanel.makeItemsToggle(host, id).text(
      initiallyExpanded ? "-" : "+"
    );
    itemsElement.data("expanded", initiallyExpanded);
    itemsElement.on("click", () => {
      list.toggle();
      const itemsExpanded = !itemsElement.data("expanded");

      itemsElement.data("expanded", itemsExpanded);
      itemsElement.prop(
        "title",
        itemsExpanded ? host.engine.i18n("ui.itemsHide") : host.engine.i18n("ui.itemsShow")
      );
      itemsElement.text(itemsExpanded ? "-" : "+");
    });

    element.element.append(itemsElement, list);

    if (initiallyExpanded) {
      list.toggle();
    }

    this._element = element;
    this._mainChildVisible = initiallyExpanded;
    this.element = element.element;
    this.expando = itemsElement;
    this.host = host;
    this.list = list;
    this.settings = settings;
  }

  refreshUi() {
    this._element.refreshUi();
  }

  toggle(expand: boolean | undefined) {
    this._mainChildVisible = expand !== undefined ? expand : !this._mainChildVisible;
    if (this._mainChildVisible) {
      this.list.show();
      this.expando.data("expanded", true);
      this.expando.prop("title", this.host.engine.i18n("ui.itemsHide"));
      this.expando.text("-");
    } else {
      this.list.hide();
      this.expando.data("expanded", false);
      this.expando.prop("title", this.host.engine.i18n("ui.itemsShow"));
      this.expando.text("+");
    }
  }

  /**
   * Constructs an expando element that is commonly used to expand and
   * collapses a section of the UI.
   *
   * @param host A reference to the host.
   * @param id The ID of the section this is the expando for.
   * @returns The constructed expando element.
   */
  static makeItemsToggle(host: UserScript, id: string): JQuery<HTMLElement> {
    return $("<div/>", {
      id: `toggle-items-${id}`,
      title: host.engine.i18n("ui.itemsShow"),
      text: "+",
    }).addClass("ks-expando-button");
  }
}
