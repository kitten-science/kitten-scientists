import type { KittenScientists } from "../../KittenScientists.js";
import type { SettingOptions } from "../../settings/Settings.js";
import { UiComponent, type UiComponentOptions } from "./UiComponent.js";
export type RadioItemOptions = UiComponentOptions & {
  /**
   * Will be invoked when the user selects this radio item.
   */
  onCheck: () => void;
  /**
   * Should there be additional padding below this element?
   */
  delimiter: boolean;
  /**
   * Should an indicator be rendered in front of the element,
   * to indicate that this is an upgrade of a prior setting?
   */
  upgradeIndicator: boolean;
  /**
   * Should the user be prevented from changing the value of the input?
   */
  readOnly: boolean;
};
export declare class RadioItem<
  TSetting extends SettingOptions = SettingOptions,
> extends UiComponent {
  readonly setting: TSetting;
  readonly option: TSetting["options"][0];
  readonly element: JQuery;
  readonly input: JQuery;
  readOnly: boolean;
  /**
   * Construct a new radio setting element.
   * This is a radio input that is expected to be hosted in a `Fieldset`.
   *
   * @param host The userscript instance.
   * @param setting The setting this element is linked to.
   * @param option The specific option out of the setting that this radio item represents.
   * @param groupKey A unique name for the group of radio items this one belongs to.
   * @param options Options for this radio item.
   */
  constructor(
    host: KittenScientists,
    setting: TSetting,
    option: TSetting["options"][0],
    groupKey: string,
    options?: Partial<RadioItemOptions>,
  );
  refreshUi(): void;
}
//# sourceMappingURL=RadioItem.d.ts.map
