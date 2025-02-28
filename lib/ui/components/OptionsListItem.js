import { Fieldset } from "./Fieldset.js";
import { RadioItem } from "./RadioItem.js";
import { UiComponent } from "./UiComponent.js";
export class OptionsListItem extends UiComponent {
  fieldset;
  setting;
  element;
  _items;
  /**
   * Construct a new options setting element.
   * This is a list of options, where the selected option will be put into the setting.
   *
   * @param host The userscript instance.
   * @param label The label on the setting element.
   * @param setting The setting this element is linked to.
   * @param options Options for the list item.
   */
  constructor(host, label, setting, options) {
    super(host, options);
    this.element = $("<li/>");
    this.fieldset = new Fieldset(host, label);
    this.addChild(this.fieldset);
    this._items = new Array();
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
//# sourceMappingURL=OptionsListItem.js.map
