import { isNil } from "@oliversalzburg/js-utils/nil.js";
import { UserScript } from "../../UserScript.js";
import { SettingOptions } from "../../settings/Settings.js";
import { UiComponent, UiComponentOptions } from "./UiComponent.js";

export type RadioItemOptions = UiComponentOptions & {
  /**
   * Will be invoked when the user selects this radio item.
   */
  onCheck: () => void;

  /**
   * Should there be additional padding below this element?
   */
  delimiter: boolean;

  /**
   * Should an indicator be rendered in front of the element,
   * to indicate that this is an upgrade of a prior setting?
   */
  upgradeIndicator: boolean;

  /**
   * Should the user be prevented from changing the value of the input?
   */
  readOnly: boolean;
};

export class RadioItem<TSetting extends SettingOptions = SettingOptions> extends UiComponent {
  readonly setting: TSetting;
  readonly option: TSetting["options"][0];
  readonly element: JQuery<HTMLElement>;
  readonly input: JQuery<HTMLElement>;

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
    host: UserScript,
    setting: TSetting,
    option: TSetting["options"][0],
    groupKey: string,
    options?: Partial<RadioItemOptions>,
  ) {
    super(host, options);

    const element = $(`<div/>`);
    element.addClass("ks-setting");

    if (options?.delimiter === true) {
      element.addClass("ks-delimiter");
    }

    const elementLabel = $("<label/>", {
      text: `${options?.upgradeIndicator ? `⮤ ` : ""}${option.label}`,
    }).addClass("ks-label");

    const input = $("<input/>", {
      name: groupKey,
      type: "radio",
    }).addClass("ks-radio");

    this.readOnly = options?.readOnly ?? false;

    input.on("change", () => {
      this.setting.selected = option.value;
      if (!isNil(options?.onCheck)) {
        options?.onCheck();
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
