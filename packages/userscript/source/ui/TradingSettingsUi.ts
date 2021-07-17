import { TradingSettings, TradingSettingsItem } from "../options/TradingSettings";
import { objectEntries } from "../tools/Entries";
import { ucfirst } from "../tools/Format";
import { mustExist } from "../tools/Maybe";
import { Race, Season } from "../types";
import { UserScript } from "../UserScript";
import { SettingsSectionUi } from "./SettingsSectionUi";

export class TradingSettingsUi extends SettingsSectionUi<TradingSettings> {
  readonly element: JQuery<HTMLElement>;

  private readonly _options: TradingSettings;

  private readonly _itemsButton: JQuery<HTMLElement>;
  private _itemsExpanded = false;
  private readonly _triggerButton: JQuery<HTMLElement>;

  private readonly _optionButtons = new Array<JQuery<HTMLElement>>();

  constructor(host: UserScript, upgradeOptions: TradingSettings = host.options.auto.trade) {
    super(host);

    this._options = upgradeOptions;

    const toggleName = "trade";

    const itext = ucfirst(this._host.i18n("ui.trade"));

    // Our main element is a list item.
    const element = this._getSettingsPanel(toggleName);

    const label = $("<label/>", {
      text: itext,
    });
    label.on("click", () => this._itemsButton.trigger("click"));

    const input = $("<input/>", {
      id: `toggle-${toggleName}`,
      type: "checkbox",
    });
    this._options.$enabled = input;

    input.on("change", () => {
      if (input.is(":checked") && this._options.enabled === false) {
        this._host.updateOptions(() => (this._options.enabled = true));
        this._host.imessage("status.auto.enable", [itext]);
      } else if (!input.is(":checked") && this._options.enabled === true) {
        this._host.updateOptions(() => (this._options.enabled = false));
        this._host.imessage("status.auto.disable", [itext]);
      }
    });

    element.append(input, label);

    // Create "trigger" button in the item.
    this._triggerButton = $("<div/>", {
      id: `trigger-${toggleName}`,
      text: this._host.i18n("ui.trigger"),
      //title: this._options.trigger,
      css: {
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        paddingRight: "5px",
      },
    });
    this._options.$trigger = this._triggerButton;

    this._triggerButton.on("click", () => {
      const value = window.prompt(
        this._host.i18n("ui.trigger.set", [itext]),
        this._options.trigger.toFixed(2)
      );

      if (value !== null) {
        this._host.updateOptions(() => (this._options.trigger = parseFloat(value)));
        this._triggerButton[0].title = this._options.trigger.toFixed(2);
      }
    });

    // Create build items.
    // We create these in a list that is displayed when the user clicks the "items" button.
    const list = this._getOptionHead(toggleName);

    this._itemsButton = this._getItemsToggle(toggleName);
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
      this._getTradeOption(
        "dragons",
        this._options.items.dragons,
        this._host.i18n("$trade.race.dragons")
      ),
      this._getTradeOption(
        "zebras",
        this._options.items.zebras,
        this._host.i18n("$trade.race.zebras")
      ),
      this._getTradeOption(
        "lizards",
        this._options.items.lizards,
        this._host.i18n("$trade.race.lizards")
      ),
      this._getTradeOption(
        "sharks",
        this._options.items.sharks,
        this._host.i18n("$trade.race.sharks")
      ),
      this._getTradeOption(
        "griffins",
        this._options.items.griffins,
        this._host.i18n("$trade.race.griffins")
      ),
      this._getTradeOption(
        "nagas",
        this._options.items.nagas,
        this._host.i18n("$trade.race.nagas")
      ),
      this._getTradeOption(
        "spiders",
        this._options.items.spiders,
        this._host.i18n("$trade.race.spiders")
      ),
      this._getTradeOption(
        "leviathans",
        this._options.items.leviathans,
        this._host.i18n("$trade.race.leviathans")
      ),
    ];

    list.append(...this._optionButtons);

    element.append(this._itemsButton);
    element.append(this._triggerButton);
    element.append(list);

    this.element = element;
  }

  private _getTradeOption(
    name: Race,
    option: TradingSettingsItem,
    i18nName: string
  ): JQuery<HTMLElement> {
    const element = this.getOption(name, option, i18nName);
    element.css("borderBottom", "1px solid rgba(185, 185, 185, 0.7)");

    //Limited Trading
    const label = $("<label/>", {
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
        this._host.imessage("trade.limited", [i18nName]);
      } else if (!input.is(":checked") && option.limited === true) {
        this._host.updateOptions(() => (option.limited = false));
        this._host.imessage("trade.unlimited", [i18nName]);
      }
    });

    element.append(input, label);
    //Limited Trading End

    const button = $("<div/>", {
      id: `toggle-seasons-${name}`,
      text: this._host.i18n("trade.seasons"),
      css: {
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        paddingRight: "5px",
      },
    });

    const list = $("<ul/>", {
      id: `seasons-list-${name}`,
      css: { display: "none", paddingLeft: "20px" },
    });

    // fill out the list with seasons
    list.append(this._getSeason(name, "spring", option));
    list.append(this._getSeason(name, "summer", option));
    list.append(this._getSeason(name, "autumn", option));
    list.append(this._getSeason(name, "winter", option));

    button.on("click", function () {
      list.toggle();
    });

    element.append(button, list);

    return element;
  }

  private _getSeason(name: Race, season: Season, option: TradingSettingsItem): JQuery<HTMLElement> {
    const iname = ucfirst(this._host.i18n(`$trade.race.${name}` as const));
    const iseason = ucfirst(this._host.i18n(`$calendar.season.${season}` as const));

    const element = $("<li/>");

    const label = $("<label/>", {
      for: `toggle-${name}-${season}`,
      text: ucfirst(iseason),
    });

    const input = $("<input/>", {
      id: `toggle-${name}-${season}`,
      type: "checkbox",
    }).data("option", option);
    option[`$${season}` as const] = input;

    input.on("change", () => {
      if (input.is(":checked") && option[season] === false) {
        this._host.updateOptions(() => (option[season] = true));
        this._host.imessage("trade.season.enable", [iname, iseason]);
      } else if (!input.is(":checked") && option[season] === true) {
        this._host.updateOptions(() => (option[season] = false));
        this._host.imessage("trade.season.disable", [iname, iseason]);
      }
    });

    element.append(input, label);

    return element;
  }

  setState(state: TradingSettings): void {
    this._options.enabled = state.enabled;
    this._options.trigger = state.trigger;

    for (const [name, option] of objectEntries(this._options.items)) {
      option.enabled = state.items[name].enabled;
      option.limited = state.items[name].limited;

      option.autumn = state.items[name].autumn;
      option.spring = state.items[name].spring;
      option.summer = state.items[name].summer;
      option.winter = state.items[name].winter;
    }
  }

  refreshUi(): void {
    mustExist(this._options.$enabled).prop("checked", this._options.enabled);
    mustExist(this._options.$trigger)[0].title = this._options.trigger.toFixed(2);

    for (const [name, option] of objectEntries(this._options.items)) {
      mustExist(option.$enabled).prop("checked", this._options.items[name].enabled);
      mustExist(option.$limited).prop("checked", this._options.items[name].limited);

      mustExist(option.$autumn).prop("checked", this._options.items[name].autumn);
      mustExist(option.$spring).prop("checked", this._options.items[name].spring);
      mustExist(option.$summer).prop("checked", this._options.items[name].summer);
      mustExist(option.$winter).prop("checked", this._options.items[name].winter);
    }
  }
}
