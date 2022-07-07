import { DistributeSettingsItem, VillageSettings } from "../options/VillageSettings";
import { objectEntries } from "../tools/Entries";
import { ucfirst } from "../tools/Format";
import { mustExist } from "../tools/Maybe";
import { UserScript } from "../UserScript";
import { SettingsSectionUi } from "./SettingsSectionUi";

export class VillageSettingsUi extends SettingsSectionUi<VillageSettings> {
  readonly element: JQuery<HTMLElement>;

  private readonly _options: VillageSettings;

  private readonly _optionButtons = new Array<JQuery<HTMLElement>>();

  constructor(host: UserScript, options: VillageSettings = host.options.auto.distribute) {
    super(host);

    this._options = options;

    const toggleName = "distribute";
    const label = ucfirst(this._host.i18n("ui.distribute"));

    // Create build items.
    // We create these in a list that is displayed when the user clicks the "items" button.
    const list = this._getOptionList(toggleName);

    // Our main element is a list item.
    const element = this._getSettingsPanel(toggleName, label, this._options, list);
    this._options.$enabled = element.checkbox;

    this._optionButtons = [
      this._getDistributeOption(
        "woodcutter",
        this._options.items.woodcutter,
        this._host.i18n("$village.job.woodcutter")
      ),
      this._getDistributeOption(
        "farmer",
        this._options.items.farmer,
        this._host.i18n("$village.job.farmer")
      ),
      this._getDistributeOption(
        "scholar",
        this._options.items.scholar,
        this._host.i18n("$village.job.scholar")
      ),
      this._getDistributeOption(
        "hunter",
        this._options.items.hunter,
        this._host.i18n("$village.job.hunter")
      ),
      this._getDistributeOption(
        "miner",
        this._options.items.miner,
        this._host.i18n("$village.job.miner")
      ),
      this._getDistributeOption(
        "priest",
        this._options.items.priest,
        this._host.i18n("$village.job.priest")
      ),
      this._getDistributeOption(
        "geologist",
        this._options.items.geologist,
        this._host.i18n("$village.job.geologist")
      ),
      this._getDistributeOption(
        "engineer",
        this._options.items.engineer,
        this._host.i18n("$village.job.engineer")
      ),
    ];

    list.append(...this._optionButtons);

    element.panel.append(list);

    this.element = element.panel;
  }

  private _getDistributeOption(
    name: string,
    option: DistributeSettingsItem,
    label: string
  ): JQuery<HTMLElement> {
    const element = this._getOption(name, option, label);

    //Limited Distribution
    const labelElement = $("<label/>", {
      for: `toggle-limited-${name}`,
      text: this._host.i18n("ui.limit"),
    });

    const input = $("<input/>", {
      id: `toggle-limited-${name}`,
      type: "checkbox",
    }).data("option", option);
    option.$limited = input;

    input.on("change", () => {
      if (input.is(":checked") && option.limited === false) {
        this._host.updateOptions(() => (option.limited = true));
        this._host.imessage("distribute.limited", [label]);
      } else if (!input.is(":checked") && option.limited === true) {
        this._host.updateOptions(() => (option.limited = false));
        this._host.imessage("distribute.unlimited", [label]);
      }
    });

    element.append(input, labelElement);

    const maxButton = $("<div/>", {
      id: `set-${name}-max`,
      text: this._host.i18n("ui.max", [option.max]),
      //title: option.max,
      css: {
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        paddingRight: "5px",
      },
    }).data("option", option);
    option.$max = maxButton;

    maxButton.on("click", () => {
      const value = window.prompt(this._host.i18n("ui.max.set", [label]), option.max.toString());

      if (value !== null) {
        this._host.updateOptions(() => (option.max = parseInt(value)));
        maxButton[0].title = option.max.toString();
        maxButton[0].innerText = this._host.i18n("ui.max", [option.max]);
      }
    });

    element.append(maxButton);

    return element;
  }

  getState(): VillageSettings {
    return {
      enabled: this._options.enabled,
      items: this._options.items,
    };
  }

  setState(state: VillageSettings): void {
    mustExist(this._options.$enabled).prop("checked", state.enabled);
    this._options.enabled = state.enabled;

    for (const [name, option] of objectEntries(this._options.items)) {
      option.enabled = state.items[name].enabled;
      option.limited = state.items[name].limited;
      option.max = state.items[name].max;
    }
  }

  refreshUi(): void {
    mustExist(this._options.$enabled).prop("checked", this._options.enabled);

    for (const [name, option] of objectEntries(this._options.items)) {
      mustExist(option.$enabled).prop("checked", this._options.items[name].enabled);
      mustExist(option.$limited).prop("checked", this._options.items[name].limited);
      mustExist(option.$max).text(this._host.i18n("ui.max", [this._options.items[name].max]));
    }
  }
}
