import { SettingLimited } from "../../settings/Settings";
import { UserScript } from "../../UserScript";
import { LimitedButton } from "./LimitedButton";
import { SettingListItem } from "./SettingListItem";

export class SettingLimitedListItem extends SettingListItem {
  readonly limitedButton: LimitedButton;

  /**
   * Create a UI element for a setting that can be limited.
   * This will result in an element with a checkbox that has a "Limited" label.
   *
   * @param host The userscript instance.
   * @param label The label for the setting.
   * @param setting The setting model.
   * @param handler Handlers to call when the setting is checked or unchecked.
   * @param handler.onCheck Is called when the setting is checked.
   * @param handler.onUnCheck Is called when the setting is unchecked.
   * @param handler.onLimitedCheck Is called when the "Limited" checkbox is checked.
   * @param handler.onLimitedUnCheck Is called when the "Limited" checkbox is unchecked.
   * @param delimiter Should a delimiter be rendered after this element?
   * @param upgradeIndicator Should an indicator be rendered in front of the elemnt,
   * to indicate that this is an upgrade of a prior setting?
   */
  constructor(
    host: UserScript,
    label: string,
    setting: SettingLimited,
    handler: {
      onCheck: () => void;
      onUnCheck: () => void;
      onLimitedCheck: () => void;
      onLimitedUnCheck: () => void;
    },
    delimiter = false,
    upgradeIndicator = false
  ) {
    super(host, label, setting, handler, delimiter, upgradeIndicator);

    this.limitedButton = new LimitedButton(host, setting, handler);
    this.element.append(this.limitedButton.element);
  }

  refreshUi() {
    super.refreshUi();

    this.limitedButton.refreshUi();
  }
}
