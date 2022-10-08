import { SettingLimited } from "../options/Settings";
import { UserScript } from "../UserScript";
import { SettingLimitedListItem } from "./components/SettingLimitedListItem";

export class SettingLimitedUi {
  /**
   * Create a UI element for a setting that can be limited.
   * This will result in an element with a checkbox that has a "Limited" label.
   *
   * @param host The userscript instance.
   * @param name A unique name for this setting.
   * @param setting The setting model.
   * @param label The label for the setting.
   * @param handler Handlers to call when the setting is checked or unchecked.
   * @param handler.onCheck Is called when the setting is checked.
   * @param handler.onUnCheck Is called when the setting is unchecked.
   * @param handler.onLimitedCheck Is called when the "Limited" checkbox is checked.
   * @param handler.onLimitedUnCheck Is called when the "Limited" checkbox is unchecked.
   * @param delimiter Should a delimiter be rendered after this element?
   * @param upgradeIndicator Should an indicator be rendered in front of the elemnt,
   * to indicate that this is an upgrade of a prior setting?
   * @returns The created element.
   */
  static make(
    host: UserScript,
    name: string,
    setting: SettingLimited,
    label: string,
    handler: {
      onCheck: () => void;
      onUnCheck: () => void;
      onLimitedCheck: () => void;
      onLimitedUnCheck: () => void;
    },
    delimiter = false,
    upgradeIndicator = false
  ): SettingLimitedListItem {
    return new SettingLimitedListItem(
      host,
      name,
      label,
      setting,
      handler,
      delimiter,
      upgradeIndicator
    );
  }
}
