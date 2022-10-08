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
  ): JQuery<HTMLElement> {
    const panelElement = SettingUi.make(host, id, options, label, {
      onCheck: () => host.engine.imessage("status.auto.enable", [label]),
      onUnCheck: () => host.engine.imessage("status.auto.disable", [label]),
    });

    // The expando button for this panel.
    const itemsElement = $("<div/>", {
      id: `toggle-items-${id}`,
      title: host.engine.i18n("ui.itemsShow"),
    })
      .addClass("ks-expando-button")
      .text(initiallyExpanded ? "-" : "+");
    panelElement.append(itemsElement);

    let itemsExpanded = initiallyExpanded;
    itemsElement.on("click", () => {
      mainChild.toggle();
      itemsExpanded = !itemsExpanded;

      itemsElement.text(itemsExpanded ? "-" : "+");
      itemsElement.prop(
        "title",
        itemsExpanded ? host.engine.i18n("ui.itemsHide") : host.engine.i18n("ui.itemsShow")
      );
    });

    if (initiallyExpanded) {
      mainChild.toggle();
    }

    return panelElement;
  }
}
