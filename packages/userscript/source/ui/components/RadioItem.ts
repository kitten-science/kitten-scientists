import { SettingOptions } from "../../settings/Settings";
import { UserScript } from "../../UserScript";
import { UiComponent } from "./UiComponent";

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
   * @param handler The event handlers for this setting element.
   * @param handler.onCheck Will be invoked when the user selects this radio item.
   * @param delimiter Should there be additional padding below this element?
   * @param upgradeIndicator Should an indicator be rendered in front of the elemnt,
   * to indicate that this is an upgrade of a prior setting?
   * @param readOnly Should the user be prevented from changing the value of the input?
   */
  constructor(
    host: UserScript,
    setting: TSetting,
    option: TSetting["options"][0],
    groupKey: string,
    handler: {
      onCheck: () => void;
    },
    delimiter = false,
    upgradeIndicator = false,
    readOnly = false
  ) {
    super(host);

    const element = $(`<div/>`);
    for (const cssClass of ["ks-setting", delimiter ? "ks-delimiter" : ""]) {
      element.addClass(cssClass);
    }

    const elementLabel = $("<label/>", {
      text: `${upgradeIndicator ? `⮤ ` : ""}${option.label}`,
    }).addClass("ks-label");

    const input = $("<input/>", {
      name: groupKey,
      type: "radio",
    }).addClass("ks-radio");

    this.readOnly = readOnly;

    input.on("change", () => {
      this.setting.selected = option.value;
      handler.onCheck();
    });

    elementLabel.prepend(input);
    element.append(elementLabel);

    this.input = input;
    this.element = element;
    this.setting = setting;
    this.option = option;
  }

  refreshUi() {
    super.refreshUi();

    this.input.prop("disabled", this.readOnly);
  }
}
