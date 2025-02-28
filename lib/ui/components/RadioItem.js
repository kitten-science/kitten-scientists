import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import stylesDelimiter from "./Delimiter.module.css";
import stylesLabel from "./LabelListItem.module.css";
import stylesSettingListItem from "./SettingListItem.module.css";
import { UiComponent } from "./UiComponent.js";
export class RadioItem extends UiComponent {
  setting;
  option;
  element;
  input;
  readOnly;
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
  constructor(host, setting, option, groupKey, options) {
    super(host, options);
    const element = $("<div/>");
    element.addClass(stylesSettingListItem.setting);
    if (options?.delimiter === true) {
      element.addClass(stylesDelimiter.delimiter);
    }
    const elementLabel = $("<label/>", {
      text: `${options?.upgradeIndicator ? "⮤ " : ""}${option.label}`,
    }).addClass(stylesLabel.label);
    const input = $("<input/>", {
      name: groupKey,
      type: "radio",
    }).addClass("ks-radio");
    this.readOnly = options?.readOnly ?? false;
    input.on("change", () => {
      this.setting.selected = option.value;
      if (!isNil(options?.onCheck)) {
        options.onCheck();
      }
    });
    elementLabel.prepend(input);
    element.append(elementLabel);
    this.input = input;
    this.element = element;
    this.addChildren(options?.children);
    this.setting = setting;
    this.option = option;
  }
  refreshUi() {
    super.refreshUi();
    this.input.prop("disabled", this.readOnly);
  }
}
//# sourceMappingURL=RadioItem.js.map
