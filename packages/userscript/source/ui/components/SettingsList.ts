import { UserScript } from "../../UserScript";
import { DisableButton } from "./DisableButton";
import { EnableButton } from "./EnableButton";
import { ResetButton } from "./ResetButton";
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
  readonly resetButton: ResetButton | undefined;

  /**
   * Constructs a `SettingsList`.
   *
   * @param host A reference to the host.
   * @param hasReset Does this section have a "Reset" button?
   */
  constructor(host: UserScript, hasReset = true) {
    super(host);

    const containerList = $("<ul/>").addClass("ks-list").addClass("ks-items-list");

    const disableAllButton = new DisableButton(this._host);
    disableAllButton.element.on("click", () => this.dispatchEvent(new Event("disableAll")));
    containerList.append(disableAllButton.element);

    const enableAllButton = new EnableButton(this._host);
    enableAllButton.element.on("click", () => this.dispatchEvent(new Event("enableAll")));
    containerList.append(enableAllButton.element);

    if (hasReset) {
      this.resetButton = new ResetButton(this._host);
      this.resetButton.element.on("click", () => this.dispatchEvent(new Event("reset")));
      containerList.append(this.resetButton.element);
    }

    this.element = containerList;
  }
}
