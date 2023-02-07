import { SettingOptions } from "../../settings/Settings";
import { UserScript } from "../../UserScript";
import { Fieldset } from "./Fieldset";
import { RadioItem } from "./RadioItem";
import { UiComponent, UiComponentOptions } from "./UiComponent";

export type OptionsListItemOptions = UiComponentOptions & {
  readonly onCheck: () => void;
  readonly readOnly: boolean;
};

export class OptionsListItem<TSetting extends SettingOptions = SettingOptions> extends UiComponent {
  readonly fieldset: Fieldset;
  readonly setting: TSetting;
  readonly element: JQuery<HTMLElement>;
  readonly _options: Array<RadioItem>;

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
    host: UserScript,
    label: string,
    setting: TSetting,
    options?: Partial<Omit<OptionsListItemOptions, "children">>
  ) {
    super(host, options);

    this.element = $(`<li/>`);

    this.fieldset = new Fieldset(host, label);
    this.addChild(this.fieldset);

    this._options = new Array<RadioItem>();
    for (const option of setting.options) {
      this._options.push(
        new RadioItem(host, setting, option, label, {
          onCheck: options?.onCheck,
          readOnly: options?.readOnly,
        })
      );
    }
    this.fieldset.addChildren(this._options);

    this.setting = setting;
  }

  refreshUi() {
    super.refreshUi();

    for (const option of this._options) {
      if (option.option.value === this.setting.selected) {
        option.input.prop("checked", true);
        break;
      }
    }
  }
}
