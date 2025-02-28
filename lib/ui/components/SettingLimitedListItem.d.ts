import type { KittenScientists } from "../../KittenScientists.js";
import type { SettingLimited } from "../../settings/Settings.js";
import { SettingListItem, type SettingListItemOptions } from "./SettingListItem.js";
import type { UiComponent } from "./UiComponent.js";
import { LimitedButton } from "./buttons/LimitedButton.js";
export type SettingListItemOptionsLimited = {
  /**
   * Is called when the "Limited" checkbox is checked.
   */
  readonly onLimitedCheck: () => void;
  /**
   * Is called when the "Limited" checkbox is unchecked.
   */
  readonly onLimitedUnCheck: () => void;
};
export declare class SettingLimitedListItem<
  TOptions extends SettingListItemOptions<UiComponent> &
    SettingListItemOptionsLimited = SettingListItemOptions<UiComponent> &
    SettingListItemOptionsLimited,
> extends SettingListItem {
  readonly limitedButton: LimitedButton;
  /**
   * Create a UI element for a setting that can be limited.
   * This will result in an element with a checkbox that has a "Limited" label.
   *
   * @param host The userscript instance.
   * @param label The label for the setting.
   * @param setting The setting model.
   * @param options Options for the list item.
   */
  constructor(
    host: KittenScientists,
    setting: SettingLimited,
    label: string,
    options?: Partial<TOptions>,
  );
  refreshUi(): void;
}
//# sourceMappingURL=SettingLimitedListItem.d.ts.map
