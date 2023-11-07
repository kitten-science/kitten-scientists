import { isNil } from "@oliversalzburg/js-utils/lib/nil.js";
import { UserScript } from "../../UserScript.js";
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
  readonly checkbox?: JQuery<HTMLElement>;

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
    host: UserScript,
    label: string,
    setting: TSetting,
    options?: Partial<SettingListItemOptions>,
  ) {
    super(host, label, options);

    const checkbox = $("<input/>", {
      type: "checkbox",
    }).addClass("ks-checkbox");

    this.readOnly = options?.readOnly ?? false;
    checkbox.prop("disabled", this.readOnly);

    checkbox.on("change", () => {
      if (checkbox.is(":checked") && setting.enabled === false) {
        setting.enabled = true;
        options?.onCheck?.();
      } else if (!checkbox.is(":checked") && setting.enabled === true) {
        setting.enabled = false;
        options?.onUnCheck?.();
      }
    });

    this.elementLabel.prepend(checkbox);

    this.checkbox = checkbox;
    this.addChildren(options?.children);
    this.setting = setting;
  }

  refreshUi() {
    super.refreshUi();

    if (!isNil(this.checkbox)) {
      this.checkbox.prop("checked", this.setting.enabled);
      this.checkbox.prop("disabled", this.readOnly);
    }
  }
}
