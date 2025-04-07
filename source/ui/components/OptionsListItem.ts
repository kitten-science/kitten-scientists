import type { SettingOptions } from "../../settings/Settings.js";
import { Fieldset } from "./Fieldset.js";
import { RadioItem } from "./RadioItem.js";
import { UiComponent, type UiComponentOptions } from "./UiComponent.js";

export type OptionsListItemOptions = ThisType<OptionsListItem> &
  UiComponentOptions & {
    readonly onCheck?: (isBatchProcess?: boolean) => void;
    readonly readOnly?: boolean;
  };

export class OptionsListItem<TSetting extends SettingOptions = SettingOptions> extends UiComponent {
  declare readonly options: OptionsListItemOptions;
  readonly fieldset: Fieldset;
  readonly setting: TSetting;
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
    parent: UiComponent,
    label: string,
    setting: TSetting,
    options?: OptionsListItemOptions,
  ) {
    super(parent, {
      ...options,
      onRefresh: () => {
        for (const option of this._items) {
          if (option.option.value === this.setting.selected) {
            option.input.prop("checked", true);
            break;
          }
        }
        options?.onRefresh?.();
      },
    });

    this.element = $("<li/>");

    this.fieldset = new Fieldset(parent, label);
    this.addChild(this.fieldset);

    this._items = new Array<RadioItem>();
    for (const option of setting.options) {
      this._items.push(
        new RadioItem(parent, setting, option, label, {
          onCheck: options?.onCheck,
          readOnly: options?.readOnly,
        }),
      );
    }
    this.fieldset.addChildren(this._items);

    this.setting = setting;
  }

  toString(): string {
    return `[${OptionsListItem.name}#${this.componentId}]`;
  }
}
