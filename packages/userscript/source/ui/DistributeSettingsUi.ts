import { DistributeSettings, DistributeSettingsItem } from "../options/DistributeSettings";
import { objectEntries } from "../tools/Entries";
import { ucfirst } from "../tools/Format";
import { mustExist } from "../tools/Maybe";
import { UserScript } from "../UserScript";
import { SettingsSectionUi } from "./SettingsSectionUi";

export class DistributeSettingsUi extends SettingsSectionUi<DistributeSettings> {
  readonly element: JQuery<HTMLElement>;

  private readonly _options: DistributeSettings;

  private readonly _itemsButton: JQuery<HTMLElement>;
  private _itemsExpanded = false;

  private readonly _optionButtons = new Array<JQuery<HTMLElement>>();

  constructor(host: UserScript, options: DistributeSettings = host.options.auto.distribute) {
    super(host);

    this._options = options;

    const toggleName = "distribute";

    const itext = ucfirst(this._host.i18n("ui.distribute"));

    // Our main element is a list item.
    const element = $("<li/>", { id: `ks-${toggleName}` });

    const label = $("<label/>", {
      text: itext,
    });
    label.on("click", () => this._itemsButton.trigger("click"));

    const input = $("<input/>", {
      id: "toggle-" + toggleName,
      type: "checkbox",
    });
    this._options.$enabled = input;

    input.on("change", () => {
      if (input.is(":checked") && this._options.enabled === false) {
        this._options.enabled = true;

        this._host.imessage("status.auto.enable", [itext]);
        //saveToKittenStorage();
      } else if (!input.is(":checked") && this._options.enabled === true) {
        this._options.enabled = false;
        this._host.imessage("status.auto.disable", [itext]);
        //saveToKittenStorage();
      }
    });

    element.append(input, label);

    // Create build items.
    // We create these in a list that is displayed when the user clicks the "items" button.
    const list = this.getOptionHead(toggleName);

    // Add a border on the element
    element.css("borderBottom", "1px  solid rgba(185, 185, 185, 0.7)");

    this._itemsButton = $("<div/>", {
      id: "toggle-items-" + toggleName,
      text: "+",
      css: {
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        paddingRight: "5px",
        textShadow: "3px 3px 4px gray",
      },
    });

    this._itemsButton.on("click", () => {
      list.toggle();

      this._itemsExpanded = !this._itemsExpanded;

      this._itemsButton.text(this._itemsExpanded ? "-" : "+");
      this._itemsButton.prop(
        "title",
        this._itemsExpanded ? this._host.i18n("ui.itemsHide") : this._host.i18n("ui.itemsShow")
      );
    });

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

    element.append(this._itemsButton);
    element.append(list);

    this.element = element;
  }

  private _getDistributeOption(
    name: string,
    option: DistributeSettingsItem,
    label: string
  ): JQuery<HTMLElement> {
    const element = this.getOption(name, option, label);
    element.css("borderBottom", "1px solid rgba(185, 185, 185, 0.7)");

    //Limited Distribution
    const labelElement = $("<label/>", {
      for: "toggle-limited-" + name,
      text: this._host.i18n("ui.limit"),
    });

    const input = $("<input/>", {
      id: "toggle-limited-" + name,
      type: "checkbox",
    }).data("option", option);
    option.$limited = input;

    /*
    if (option.limited) {
      input.prop("checked", true);
    }
    */

    input.on("change", () => {
      if (input.is(":checked") && option.limited === false) {
        option.limited = true;
        this._host.imessage("distribute.limited", [label]);
      } else if (!input.is(":checked") && option.limited === true) {
        option.limited = false;
        this._host.imessage("distribute.unlimited", [label]);
      }
      //kittenStorage.items[input.attr("id")] = option.limited;
      //this._host.saveToKittenStorage();
    });

    element.append(input, labelElement);

    const maxButton = $("<div/>", {
      id: "set-" + name + "-max",
      text: this._host.i18n("ui.max", [option.max]),
      //title: option.max,
      css: {
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        paddingRight: "5px",
        textShadow: "3px 3px 4px gray",
      },
    }).data("option", option);
    option.$max = maxButton;

    maxButton.on("click", () => {
      const value = window.prompt(this._host.i18n("ui.max.set", [label]), option.max.toString());

      if (value !== null) {
        option.max = parseInt(value);
        //kittenStorage.items[maxButton.attr("id")] = option.max;
        //this._host.saveToKittenStorage();
        maxButton[0].title = option.max.toString();
        maxButton[0].innerText = this._host.i18n("ui.max", [option.max]);
      }
    });

    element.append(maxButton);

    return element;
  }

  setState(state: DistributeSettings): void {
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
