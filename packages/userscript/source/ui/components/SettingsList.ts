import { UserScript } from "../../UserScript";
import { DisableButton } from "./buttons-icon/DisableButton";
import { EnableButton } from "./buttons-icon/EnableButton";
import { ResetButton } from "./buttons-icon/ResetButton";
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
  readonly list: JQuery<HTMLElement>;

  readonly disableAllButton: DisableButton;
  readonly enableAllButton: EnableButton;
  readonly resetButton: ResetButton | undefined;

  /**
   * Constructs a `SettingsList`.
   *
   * @param host A reference to the host.
   * @param hasReset Does this section have a "Reset" button?
   */
  constructor(host: UserScript, hasReset = false) {
    super(host);

    const container = $("<div/>").addClass("ks-list-container");

    this.list = $("<ul/>").addClass("ks-list").addClass("ks-items-list");

    container.append(this.list);

    const tools = $("<div/>").addClass("ks-list-tools");

    this.enableAllButton = new EnableButton(this._host);
    this.enableAllButton.element.on("click", () => this.dispatchEvent(new Event("enableAll")));
    tools.append(this.enableAllButton.element);

    this.disableAllButton = new DisableButton(this._host);
    this.disableAllButton.element.on("click", () => this.dispatchEvent(new Event("disableAll")));
    tools.append(this.disableAllButton.element);

    if (hasReset) {
      this.resetButton = new ResetButton(this._host);
      this.resetButton.element.on("click", () => this.dispatchEvent(new Event("reset")));
      tools.append(this.resetButton.element);
    }

    container.append(tools);

    this.element = container;
  }

  override addChild(child: UiComponent) {
    this.children.add(child);
    this.list.append(child.element);
  }
}
