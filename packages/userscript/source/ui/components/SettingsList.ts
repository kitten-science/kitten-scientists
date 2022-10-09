import { UserScript } from "../../UserScript";
import { UiComponent } from "./UiComponent";

/**
 * The `SettingsList` is a `<ul>` designed to host `SettingListItem` instances.
 *
 * It has enable/disable buttons to check/uncheck all settings contained in it.
 * Most commonly, it is used as part of the `SettingsPanel`.
 *
 * This construct is also sometimes referred to as an "items list" for historic reasons.
 */
export class SettingsList extends UiComponent {
  readonly element: JQuery<HTMLElement>;

  /**
   * Constructs a `SettingsList`.
   *
   * @param host A reference to the host.
   * @param id The ID for this list.
   */
  constructor(host: UserScript, id: string) {
    super(host);

    const containerList = $("<ul/>", {
      id: `items-list-${id}`,
    })
      .addClass("ks-list")
      .addClass("ks-items-list");

    const disableAllButton = $("<div/>", {
      id: `toggle-all-items-${id}`,
    })
      .text(host.engine.i18n("ui.disable.all"))
      .addClass("ks-button");

    disableAllButton.on("click", function () {
      // can't use find as we only want one layer of checkboxes
      const items = containerList.children().children(":checkbox");
      items.prop("checked", false);
      items.trigger("change");
      containerList.children().children(":checkbox").trigger("change");
    });

    containerList.append(disableAllButton);

    const enableAllButton = $("<div/>", {
      id: `toggle-all-items-${id}`,
    })
      .text(host.engine.i18n("ui.enable.all"))
      .addClass("ks-button")
      .addClass("ks-margin-right");

    enableAllButton.on("click", function () {
      // can't use find as we only want one layer of checkboxes
      const items = containerList.children().children(":checkbox");
      items.prop("checked", true);
      items.trigger("change");
      containerList.children().children(":checkbox").trigger("change");
    });

    containerList.append(enableAllButton);

    this.element = containerList;
  }

  refreshUi() {
    /* intentionally left blank */
  }
}
