import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { KittenScientists } from "../../KittenScientists.js";
import { Setting } from "../../settings/Settings.js";
import { LabelListItem, LabelListItemOptions } from "./LabelListItem.js";

export type SettingListItemOptions = LabelListItemOptions & {
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

export class SettingListItem<TSetting extends Setting = Setting> extends LabelListItem {
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
    label: string,
    setting: TSetting,
    options?: Partial<SettingListItemOptions>,
  ) {
    super(host, label, { ...options, children: [] });

    this.element.addClass("ks-setting");

    const checkbox = $("<input/>", {
      type: "checkbox",
    }).addClass("ks-checkbox");

    this.readOnly = options?.readOnly ?? false;
    checkbox.prop("disabled", this.readOnly);

    checkbox.on("change", () => {
      if (checkbox.is(":checked") && !setting.enabled) {
        setting.enabled = true;
        options?.onCheck?.();
      } else if (!checkbox.is(":checked") && setting.enabled) {
        setting.enabled = false;
        options?.onUnCheck?.();
      }
    });

    this.elementLabel.prepend(checkbox);

    this.checkbox = checkbox;
    this.setting = setting;

    this.addChildren(options?.children);
  }

  refreshUi() {
    super.refreshUi();

    if (!isNil(this.checkbox)) {
      this.checkbox.prop("checked", this.setting.enabled);
      this.checkbox.prop("disabled", this.readOnly);
    }
  }
}
