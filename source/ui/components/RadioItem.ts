import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import type { SettingOptions } from "../../settings/Settings.js";
import stylesDelimiter from "./Delimiter.module.css";
import stylesLabel from "./LabelListItem.module.css";
import stylesSettingListItem from "./SettingListItem.module.css";
import { UiComponent, type UiComponentOptions } from "./UiComponent.js";

export type RadioItemOptions = ThisType<RadioItem> &
  UiComponentOptions & {
    /**
     * Will be invoked when the user selects this radio item.
     */
    onCheck?: (isBatchProcess?: boolean) => void;

    /**
     * Should there be additional padding below this element?
     */
    delimiter?: boolean;

    /**
     * Should an indicator be rendered in front of the element,
     * to indicate that this is an upgrade of a prior setting?
     */
    upgradeIndicator?: boolean;

    /**
     * Should the user be prevented from changing the value of the input?
     */
    readOnly?: boolean;
  };

export class RadioItem<TSetting extends SettingOptions = SettingOptions> extends UiComponent {
  declare readonly options: RadioItemOptions;
  readonly setting: TSetting;
  readonly option: TSetting["options"][0];
  readonly elementLabel: JQuery<HTMLLabelElement>;
  readonly input: JQuery;

  readOnly: boolean;

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
  constructor(
    parent: UiComponent,
    setting: TSetting,
    option: TSetting["options"][0],
    groupKey: string,
    options?: RadioItemOptions,
  ) {
    super(parent, {
      ...options,
      onRefresh: () => {
        this.input.prop("disabled", this.readOnly);
      },
    });

    this.element = $("<div/>");
    this.element.addClass(stylesSettingListItem.setting);

    if (options?.delimiter === true) {
      this.element.addClass(stylesDelimiter.delimiter);
    }

    this.elementLabel = $<HTMLLabelElement>("<label/>", {
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

    this.elementLabel.prepend(input);
    this.element.append(this.elementLabel);

    this.input = input;
    this.setting = setting;
    this.option = option;
  }

  toString(): string {
    return `[${RadioItem.name}#${this.componentId}]: '${this.elementLabel.text()}'`;
  }
}
