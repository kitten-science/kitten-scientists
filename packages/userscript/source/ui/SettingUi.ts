import { Setting } from "../options/Settings";
import { UserScript } from "../UserScript";
import { SettingListItem } from "./components/SettingListItem";

export class SettingUi {
  private static _provisionedOptionElements = new Map<string, SettingListItem>();

  /**
   * Construct a new setting element.
   * This is a simple checkbox with a label.
   *
   * @param host The userscript instance.
   * @param name The internal ID of this setting. Should be unique throughout the script.
   * @param setting The setting this element is linked to.
   * @param i18nName The label on the setting element.
   * @param handler The event handlers for this setting element.
   * @param handler.onCheck Will be invoked when the user checks the checkbox.
   * @param handler.onUnCheck Will be invoked when the user unchecks the checkbox.
   * @param delimiter Should there be additional padding below this element?
   * @param upgradeIndicator Should an indicator be rendered in front of the elemnt,
   * to indicate that this is an upgrade of a prior setting?
   * @param additionalClasses A list of CSS classes to attach to the element.
   * @returns The constructed setting element.
   */
  static make(
    host: UserScript,
    name: string,
    setting: Setting,
    i18nName: string,
    handler: {
      onCheck: () => void;
      onUnCheck: () => void;
    },
    delimiter = false,
    upgradeIndicator = false,
    additionalClasses = []
  ): SettingListItem {
    if (SettingUi._provisionedOptionElements.has(name)) {
      throw new Error(
        `Duplicate setting ID requested! The setting ID '${name}' has already been assigned to a previously provisoned element.`
      );
    }

    const element = new SettingListItem(
      host,
      name,
      i18nName,
      setting,
      handler,
      delimiter,
      upgradeIndicator,
      additionalClasses
    );

    SettingUi._provisionedOptionElements.set(name, element);

    return element;
  }
}
