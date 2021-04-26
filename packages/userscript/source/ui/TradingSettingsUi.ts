import { Options } from "../options/Options";
import { TradingSettings } from "../options/TradingSettings";
import { ucfirst } from "../tools/Format";
import { Race, Season } from "../types";
import { UserScript } from "../UserScript";
import { SettingsSection } from "./SettingsSection";

export class TradingSettingsUi extends SettingsSection {
  readonly element: JQuery<HTMLElement>;

  private readonly _options: TradingSettings;

  private readonly _itemsButton: JQuery<HTMLElement>;
  private readonly _triggerButton: JQuery<HTMLElement>;

  private readonly _buildingButtons = new Array<JQuery<HTMLElement>>();

  constructor(
    host: UserScript,
    upgradeOptions: TradingSettings = host.options.auto.trade
  ) {
    super(host);

    this._options = upgradeOptions;

    const toggleName = "trade";

    const itext = ucfirst(this._host.i18n("ui.trade"));

    // Our main element is a list item.
    const element = $("<li/>", { id: "ks-" + toggleName });

    const label = $("<label/>", {
      for: "toggle-" + toggleName,
      text: itext,
    });

    const input = $("<input/>", {
      id: "toggle-" + toggleName,
      type: "checkbox",
    });

    element.append(input, label);

    // Create "trigger" button in the item.
    this._triggerButton = $("<div/>", {
      id: "trigger-" + toggleName,
      text: this._host.i18n("ui.trigger"),
      title: this._options.trigger,
      css: {
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        paddingRight: "5px",
        textShadow: "3px 3px 4px gray",
      },
    });

    this._triggerButton.on("click", () => {
      const value = window.prompt(
        this._host.i18n("ui.trigger.set", [itext]),
        this._options.trigger
      );

      if (value !== null) {
        this._options.trigger = parseFloat(value);
        //this._host.saveToKittenStorage();
        this._triggerButton[0].title = this._options.trigger;
      }
    });

    // Create build items.
    // We create these in a list that is displayed when the user clicks the "items" button.
    const list = this.getOptionHead(toggleName);

    // Add a border on the element
    element.css("borderBottom", "1px  solid rgba(185, 185, 185, 0.7)");

    this._itemsButton = $("<div/>", {
      id: "toggle-items-" + toggleName,
      text: this._host.i18n("ui.items"),
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
    });

    this._buildingButtons = [
      this.getTradeOption(
        "dragons",
        this._options.items.dragons,
        this._host.i18n("$trade.race.dragons")
      ),
      this.getTradeOption(
        "zebras",
        this._options.items.zebras,
        this._host.i18n("$trade.race.zebras")
      ),
      this.getTradeOption(
        "lizards",
        this._options.items.lizards,
        this._host.i18n("$trade.race.lizards")
      ),
      this.getTradeOption(
        "sharks",
        this._options.items.sharks,
        this._host.i18n("$trade.race.sharks")
      ),
      this.getTradeOption(
        "griffins",
        this._options.items.griffins,
        this._host.i18n("$trade.race.griffins")
      ),
      this.getTradeOption(
        "nagas",
        this._options.items.nagas,
        this._host.i18n("$trade.race.nagas")
      ),
      this.getTradeOption(
        "spiders",
        this._options.items.spiders,
        this._host.i18n("$trade.race.spiders")
      ),
      this.getTradeOption(
        "leviathans",
        this._options.items.leviathans,
        this._host.i18n("$trade.race.leviathans")
      ),
    ];

    list.append(...this._buildingButtons);

    element.append(this._itemsButton);
    element.append(this._triggerButton);
    element.append(list);

    this.element = element;
  }

  getTradeOption(
    name: Race,
    option: { enabled: boolean; limited: boolean },
    i18nName: string,
  ): JQuery<HTMLElement> {
    const element = this.getOption(name, option, i18nName);
    element.css("borderBottom", "1px solid rgba(185, 185, 185, 0.7)");

    //Limited Trading
    const label = $("<label/>", {
      for: "toggle-limited-" + name,
      text: this._host.i18n("ui.limit"),
    });

    const input = $("<input/>", {
      id: "toggle-limited-" + name,
      type: "checkbox",
    }).data("option", option);

    if (option.limited) {
      input.prop("checked", true);
    }

    input.on("change", () => {
      if (input.is(":checked") && option.limited == false) {
        option.limited = true;
        this._host.imessage("trade.limited", [i18nName]);
      } else if (!input.is(":checked") && option.limited == true) {
        option.limited = false;
        this._host.imessage("trade.unlimited", [i18nName]);
      }
      //kittenStorage.items[input.attr("id")] = option.limited;
      //this._host.saveToKittenStorage();
    });

    element.append(input, label);
    //Limited Trading End

    const button = $("<div/>", {
      id: "toggle-seasons-" + name,
      text: this._host.i18n("trade.seasons"),
      css: {
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        paddingRight: "5px",
        textShadow: "3px 3px 4px gray",
      },
    });

    const list = $("<ul/>", {
      id: "seasons-list-" + name,
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

  private _getSeason(name: string, season: Season, option: unknown): JQuery<HTMLElement> {
    const iname = ucfirst(this._host.i18n("$trade.race." + name));
    const iseason = ucfirst(this._host.i18n("$calendar.season." + season));

    const element = $("<li/>");

    const label = $("<label/>", {
      for: "toggle-" + name + "-" + season,
      text: ucfirst(iseason),
    });

    const input = $("<input/>", {
      id: "toggle-" + name + "-" + season,
      type: "checkbox",
    }).data("option", option);

    if (option[season]) {
      input.prop("checked", true);
    }

    input.on("change", () => {
      if (input.is(":checked") && option[season] == false) {
        option[season] = true;
        this._host.imessage("trade.season.enable", [iname, iseason]);
      } else if (!input.is(":checked") && option[season] == true) {
        option[season] = false;
        this._host.imessage("trade.season.disable", [iname, iseason]);
      }
      //kittenStorage.items[input.attr("id")] = option[season];
      //this._host.saveToKittenStorage();
    });

    element.append(input, label);

    return element;
  }

  setState(state: { trigger: number }): void {
    this._triggerButton[0].title = state.trigger;
  }
}
