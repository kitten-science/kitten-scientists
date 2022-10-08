import { SettingsSection } from "../options/SettingsSection";
import { UserScript } from "../UserScript";
import { SettingUi } from "./SettingUi";

export class SettingsPanelUi {
  /**
   * Constructs a settings panel that is used to contain a major section of the UI.
   *
   * @param host A reference to the host.
   * @param id The ID of the settings panel.
   * @param label The label to put main checkbox of this section.
   * @param options An options section for which this is the settings panel.
   * @param mainChild The main child element in the panel that should be toggled with
   * the sections' expando button.
   * @param initiallyExpanded Should the main child be expanded right away?
   * @returns The constructed settings panel.
   */
  static make(
    host: UserScript,
    id: string,
    label: string,
    options: SettingsSection,
    mainChild: JQuery<HTMLElement>,
    initiallyExpanded = false
  ): { element: JQuery<HTMLElement>; expando: JQuery<HTMLElement> } {
    const panelElement = SettingUi.make(host, id, options, label, {
      onCheck: () => host.engine.imessage("status.auto.enable", [label]),
      onUnCheck: () => host.engine.imessage("status.auto.disable", [label]),
    });

    // The expando button for this panel.
    const itemsElement = SettingsPanelUi.makeItemsToggle(host, id).text(
      initiallyExpanded ? "-" : "+"
    );
    panelElement.append(itemsElement);

    itemsElement.data("expanded", initiallyExpanded);
    itemsElement.on("click", () => {
      mainChild.toggle();
      const itemsExpanded = !itemsElement.data("expanded");

      itemsElement.data("expanded", itemsExpanded);
      itemsElement.prop(
        "title",
        itemsExpanded ? host.engine.i18n("ui.itemsHide") : host.engine.i18n("ui.itemsShow")
      );
      itemsElement.text(itemsExpanded ? "-" : "+");
    });

    if (initiallyExpanded) {
      mainChild.toggle();
    }

    return { element: panelElement, expando: itemsElement };
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
