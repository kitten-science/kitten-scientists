import type { KittenScientists } from "../../KittenScientists.js";
import type { SettingOptions } from "../../settings/Settings.js";
import { Fieldset } from "./Fieldset.js";
import { RadioItem } from "./RadioItem.js";
import { UiComponent, type UiComponentOptions } from "./UiComponent.js";
export type OptionsListItemOptions = UiComponentOptions & {
  readonly onCheck: () => void;
  readonly readOnly: boolean;
};
export declare class OptionsListItem<
  TSetting extends SettingOptions = SettingOptions,
> extends UiComponent {
  readonly fieldset: Fieldset;
  readonly setting: TSetting;
  readonly element: JQuery;
  readonly _items: Array<RadioItem>;
  /**
   * Construct a new options setting element.
   * This is a list of options, where the selected option will be put into the setting.
   *
   * @param host The userscript instance.
   * @param label The label on the setting element.
   * @param setting The setting this element is linked to.
   * @param options Options for the list item.
   */
  constructor(
    host: KittenScientists,
    label: string,
    setting: TSetting,
    options?: Partial<Omit<OptionsListItemOptions, "children">>,
  );
  refreshUi(): void;
}
//# sourceMappingURL=OptionsListItem.d.ts.map
