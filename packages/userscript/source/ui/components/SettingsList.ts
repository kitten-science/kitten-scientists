import { UserScript } from "../../UserScript";

export class SettingsList {
  readonly element: JQuery<HTMLElement>;

  /**
   * Constructs a list panel that is used to contain a list of options.
   * The panel has "enable all" and "disable all" buttons to check and
   * uncheck all checkboxes in the section at once.
   *
   * @param host A reference to the host.
   * @param id The ID for this list.
   */
  constructor(host: UserScript, id: string) {
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
}
