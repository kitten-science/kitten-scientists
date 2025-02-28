import type { KittenScientists } from "../../KittenScientists.js";
import type { Setting } from "../../settings/Settings.js";
import { LabelListItem, type LabelListItemOptions } from "./LabelListItem.js";
import type { UiComponent, UiComponentInterface } from "./UiComponent.js";
export type SettingListItemOptions<TChild extends UiComponentInterface = UiComponentInterface> =
  LabelListItemOptions<TChild> & {
    /**
     * Will be invoked when the user checks the checkbox.
     */
    readonly onCheck: () => void;
    /**
     * Will be invoked when the user unchecks the checkbox.
     */
    readonly onUnCheck: () => void;
    /**
     * Should the user be prevented from changing the value of the input?
     */
    readonly readOnly: boolean;
  };
export declare class SettingListItem<
  TSetting extends Setting = Setting,
  TOptions extends SettingListItemOptions<UiComponent> = SettingListItemOptions<UiComponent>,
> extends LabelListItem<TOptions> {
  #private;
  readonly setting: TSetting;
  readonly checkbox?: JQuery;
  readOnly: boolean;
  /**
   * Construct a new setting element.
   * This is a simple checkbox with a label.
   *
   * @param host The userscript instance.
   * @param label The label on the setting element.
   * @param setting The setting this element is linked to.
   * @param options Options for this list item.
   */
  constructor(
    host: KittenScientists,
    setting: TSetting,
    label: string,
    options?: Partial<TOptions>,
  );
  check(): void;
  uncheck(): void;
  refreshUi(): void;
}
//# sourceMappingURL=SettingListItem.d.ts.map
