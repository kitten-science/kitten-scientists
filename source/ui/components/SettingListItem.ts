import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import type { Setting } from "../../settings/Settings.js";
import { LabelListItem, type LabelListItemOptions } from "./LabelListItem.js";
import { default as styles, default as stylesSettingListItem } from "./SettingListItem.module.css";
import type { UiComponent } from "./UiComponent.js";

export type SettingListItemOptions = ThisType<SettingListItem> &
  LabelListItemOptions & {
    /**
     * Will be invoked when the user checks the checkbox.
     */
    readonly onCheck?: (isBatchProcess?: boolean) => void | Promise<void>;

    /**
     * Will be invoked when the user unchecks the checkbox.
     */
    readonly onUnCheck?: (isBatchProcess?: boolean) => void | Promise<void>;

    /**
     * Should the user be prevented from changing the value of the input?
     */
    readonly readOnly?: boolean;
  };

export class SettingListItem<TSetting extends Setting = Setting> extends LabelListItem {
  declare readonly options: SettingListItemOptions;
  readonly setting: TSetting;
  readonly checkbox?: JQuery;

  readOnly: boolean;

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
  constructor(
    parent: UiComponent,
    setting: TSetting,
    label: string,
    options?: SettingListItemOptions,
  ) {
    super(parent, label, { ...options, children: [] });

    this.element.addClass(styles.setting);

    const id = `ks-setting${SettingListItem.#nextId++}`;
    const checkbox = $("<input/>", {
      id,
      type: "checkbox",
    }).addClass(styles.checkbox);

    this.readOnly = options?.readOnly ?? false;
    checkbox.prop("disabled", this.readOnly);

    checkbox.on("change", () => {
      if (checkbox.is(":checked") && !setting.enabled) {
        setting.enabled = true;
        options?.onCheck?.();
        this.refreshUi();
      } else if (!checkbox.is(":checked") && setting.enabled) {
        setting.enabled = false;
        options?.onUnCheck?.();
        this.refreshUi();
      }
    });

    this.elementLabel.before(checkbox);
    this.elementLabel.prop("for", id);

    this.checkbox = checkbox;
    this.setting = setting;

    this.addChildren(options?.children);
  }

  async check(isBatchProcess = false) {
    this.setting.enabled = true;
    await this.options?.onCheck?.call(isBatchProcess);
    this.refreshUi();
  }

  async uncheck(isBatchProcess = false) {
    this.setting.enabled = false;
    await this.options.onUnCheck?.call(isBatchProcess);
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
