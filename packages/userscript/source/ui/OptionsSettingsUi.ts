import { OptionsSettings, OptionsSettingsItem } from "../options/OptionsSettings";
import { objectEntries } from "../tools/Entries";
import { ucfirst } from "../tools/Format";
import { isNil, mustExist } from "../tools/Maybe";
import { UserScript } from "../UserScript";
import { SettingsSectionUi } from "./SettingsSectionUi";

export class OptionsSettingsUi extends SettingsSectionUi<OptionsSettings> {
  readonly element: JQuery<HTMLElement>;

  private readonly _options: OptionsSettings;

  constructor(host: UserScript, options: OptionsSettings = host.options.auto.options) {
    super(host);

    this._options = options;

    const toggleName = "options";
    const label = ucfirst(this._host.i18n("ui.options"));

    // Create build items.
    // We create these in a list that is displayed when the user clicks the "items" button.
    const list = this._getOptionList(toggleName);

    // Our main element is a list item.
    const element = this._getSettingsPanel(toggleName, label, this._options, list);
    this._options.$enabled = element.checkbox;

    const optionButtons = [
      this._getOptionsOption(
        "observe",
        this._options.items.observe,
        this._host.i18n("option.observe")
      ),
      this._getOptionsOption(
        "shipOverride",
        this._options.items.shipOverride,
        this._host.i18n("option.shipOverride")
      ),
      this._getOptionsOption(
        "autofeed",
        this._options.items.autofeed,
        this._host.i18n("option.autofeed")
      ),
      this._getOptionsOption("hunt", this._options.items.hunt, this._host.i18n("option.hunt")),
      this._getOptionsOption(
        "crypto",
        this._options.items.crypto,
        this._host.i18n("option.crypto")
      ),
      this._getOptionsOption(
        "fixCry",
        this._options.items.fixCry,
        this._host.i18n("option.fix.cry")
      ),
    ];

    list.append(...optionButtons);

    element.panel.append(list);

    this.element = element.panel;
  }

  private _getOptionsOption(
    name: string,
    option: OptionsSettingsItem,
    iname: string
  ): JQuery<HTMLElement> {
    const element = this._getOption(name, option, iname);

    if (option.subTrigger !== undefined) {
      const triggerButton = $("<div/>", {
        id: `set-${name}-subTrigger`,
        text: this._host.i18n("ui.trigger"),
        //title: option.subTrigger,
        css: {
          cursor: "pointer",
          display: "inline-block",
          float: "right",
          paddingRight: "5px",
        },
      }).data("option", option);
      option.$subTrigger = triggerButton;

      triggerButton.on("click", () => {
        let value;
        if (name === "crypto") {
          value = window.prompt(
            this._host.i18n("ui.trigger.crypto.set", [iname]),
            mustExist(option.subTrigger).toFixed(2)
          );
        } else {
          value = window.prompt(
            this._host.i18n("ui.trigger.set", [iname]),
            mustExist(option.subTrigger).toFixed(2)
          );
        }

        if (value !== null) {
          option.subTrigger = parseFloat(value);
          this._host.updateOptions();
          triggerButton[0].title = option.subTrigger.toFixed(2);
        }
      });

      element.append(triggerButton);
    }

    return element;
  }

  getState(): OptionsSettings {
    return {
      enabled: this._options.enabled,
      items: this._options.items,
    };
  }

  setState(state: OptionsSettings): void {
    this._options.enabled = state.enabled;

    for (const [name, option] of objectEntries(this._options.items)) {
      option.enabled = state.items[name].enabled;

      if (!isNil(option.$subTrigger)) {
        option.subTrigger = state.items[name].subTrigger;
      }
    }
  }

  refreshUi(): void {
    mustExist(this._options.$enabled).prop("checked", this._options.enabled);

    for (const [name, option] of objectEntries(this._options.items)) {
      mustExist(option.$enabled).prop("checked", this._options.items[name].enabled);

      if (!isNil(option.$subTrigger)) {
        option.$subTrigger[0].title = mustExist(this._options.items[name].subTrigger).toFixed(2);
      }
    }
  }
}
