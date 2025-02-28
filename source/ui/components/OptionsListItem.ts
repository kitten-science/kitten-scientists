import type { KittenScientists } from "../../KittenScientists.js";
import type { SettingOptions } from "../../settings/Settings.js";
import { Fieldset } from "./Fieldset.js";
import { RadioItem } from "./RadioItem.js";
import { UiComponent, type UiComponentOptions } from "./UiComponent.js";

export type OptionsListItemOptions = UiComponentOptions & {
  readonly onCheck: () => void;
  readonly readOnly: boolean;
};

export class OptionsListItem<TSetting extends SettingOptions = SettingOptions> extends UiComponent {
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
  ) {
    super(host, options);

    this.element = $("<li/>");

    this.fieldset = new Fieldset(host, label);
    this.addChild(this.fieldset);

    this._items = new Array<RadioItem>();
    for (const option of setting.options) {
      this._items.push(
        new RadioItem(host, setting, option, label, {
          onCheck: options?.onCheck,
          readOnly: options?.readOnly,
        }),
      );
    }
    this.fieldset.addChildren(this._items);

    this.setting = setting;
  }

  refreshUi() {
    super.refreshUi();

    for (const option of this._items) {
      if (option.option.value === this.setting.selected) {
        option.input.prop("checked", true);
        break;
      }
    }
  }
}
