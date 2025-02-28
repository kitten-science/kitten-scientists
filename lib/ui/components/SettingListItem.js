import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { LabelListItem } from "./LabelListItem.js";
import { default as styles, default as stylesSettingListItem } from "./SettingListItem.module.css";
export class SettingListItem extends LabelListItem {
  setting;
  checkbox;
  readOnly;
  static #nextId = 0;
  /**
   * Construct a new setting element.
   * This is a simple checkbox with a label.
   *
   * @param host The userscript instance.
   * @param label The label on the setting element.
   * @param setting The setting this element is linked to.
   * @param options Options for this list item.
   */
  constructor(host, setting, label, options = {}) {
    super(host, label, { ...options, children: [] });
    this.element.addClass(styles.setting);
    const id = `ks-setting${SettingListItem.#nextId++}`;
    const checkbox = $("<input/>", {
      id,
      type: "checkbox",
    }).addClass(styles.checkbox);
    this.readOnly = options.readOnly ?? false;
    checkbox.prop("disabled", this.readOnly);
    checkbox.on("change", () => {
      if (checkbox.is(":checked") && !setting.enabled) {
        setting.enabled = true;
        options.onCheck?.();
        this.refreshUi();
      } else if (!checkbox.is(":checked") && setting.enabled) {
        setting.enabled = false;
        options.onUnCheck?.();
        this.refreshUi();
      }
    });
    this.elementLabel.before(checkbox);
    this.elementLabel.prop("for", id);
    this.checkbox = checkbox;
    this.setting = setting;
    this.addChildren(options.children);
  }
  check() {
    this.setting.enabled = true;
    this._options.onCheck?.();
    this.refreshUi();
  }
  uncheck() {
    this.setting.enabled = false;
    this._options.onUnCheck?.();
    this.refreshUi();
  }
  refreshUi() {
    super.refreshUi();
    if (this.setting.enabled) {
      this.element.addClass(styles.checked);
    } else {
      this.element.removeClass(styles.checked);
    }
    if (this.readOnly) {
      this.element.addClass(stylesSettingListItem.readonly);
    } else {
      this.element.removeClass(stylesSettingListItem.readonly);
    }
    if (!isNil(this.checkbox)) {
      this.checkbox.prop("checked", this.setting.enabled);
      this.checkbox.prop("disabled", this.readOnly);
    }
  }
}
//# sourceMappingURL=SettingListItem.js.map
