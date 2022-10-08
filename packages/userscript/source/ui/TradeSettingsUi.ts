import { TradeSettings, TradeSettingsItem } from "../options/TradeSettings";
import { objectEntries } from "../tools/Entries";
import { ucfirst } from "../tools/Format";
import { mustExist } from "../tools/Maybe";
import { Race, Season } from "../types";
import { UserScript } from "../UserScript";
import { SettingLimitedUi } from "./SettingLimitedUi";
import { SettingMaxUi } from "./SettingMaxUi";
import { SettingsListUi } from "./SettingsListUi";
import { SettingsPanelUi } from "./SettingsPanelUi";
import { SettingsSectionUi } from "./SettingsSectionUi";
import { SettingTriggerUi } from "./SettingTriggerUi";
import { SettingUi } from "./SettingUi";

export class TradeSettingsUi extends SettingsSectionUi {
  readonly element: JQuery<HTMLElement>;
  readonly mainChild: JQuery<HTMLElement>;

  private readonly _settings: TradeSettings;

  constructor(host: UserScript, settings: TradeSettings) {
    super(host);

    this._settings = settings;

    const toggleName = "trade";
    const label = ucfirst(this._host.engine.i18n("ui.trade"));

    // Create build items.
    // We create these in a list that is displayed when the user clicks the "items" button.
    const list = SettingsListUi.getSettingsList(this._host.engine, toggleName);

    // Our main element is a list item.
    const element = SettingsPanelUi.make(this._host, toggleName, label, this._settings, list);

    // Create "trigger" button in the item.
    this._settings.$trigger = this._makeSectionTriggerButton(toggleName, label, this._settings);

    const optionButtons = [
      this._getTradeOption(
        "lizards",
        this._settings.items.lizards,
        this._host.engine.i18n("$trade.race.lizards")
      ),
      this._getTradeOption(
        "sharks",
        this._settings.items.sharks,
        this._host.engine.i18n("$trade.race.sharks")
      ),
      this._getTradeOption(
        "griffins",
        this._settings.items.griffins,
        this._host.engine.i18n("$trade.race.griffins")
      ),
      this._getTradeOption(
        "nagas",
        this._settings.items.nagas,
        this._host.engine.i18n("$trade.race.nagas")
      ),
      this._getTradeOption(
        "zebras",
        this._settings.items.zebras,
        this._host.engine.i18n("$trade.race.zebras")
      ),
      this._getTradeOption(
        "spiders",
        this._settings.items.spiders,
        this._host.engine.i18n("$trade.race.spiders")
      ),
      this._getTradeOption(
        "dragons",
        this._settings.items.dragons,
        this._host.engine.i18n("$trade.race.dragons")
      ),
      this._getTradeOption(
        "leviathans",
        this._settings.items.leviathans,
        this._host.engine.i18n("$trade.race.leviathans"),
        true
      ),
    ];

    list.append(...optionButtons);

    const additionOptions = this._getAdditionOptions();
    list.append(additionOptions);

    element.append(this._settings.$trigger);
    element.append(list);

    this.element = element;
    this.mainChild = list;
  }

  private _getTradeOption(
    name: Race,
    option: TradeSettingsItem,
    i18nName: string,
    delimiter = false,
    upgradeIndicator = false
  ): JQuery<HTMLElement> {
    const element = SettingLimitedUi.make(
      this._host,
      name,
      option,
      i18nName,
      {
        onCheck: () => this._host.engine.imessage("status.sub.enable", [i18nName]),
        onUnCheck: () => this._host.engine.imessage("status.sub.disable", [i18nName]),
        onLimitedCheck: () => {
          this._host.updateOptions(() => (option.limited = true));
          this._host.engine.imessage("trade.limited", [i18nName]);
        },
        onLimitedUnCheck: () => {
          this._host.updateOptions(() => (option.limited = false));
          this._host.engine.imessage("trade.unlimited", [i18nName]);
        },
      },
      delimiter,
      upgradeIndicator
    );

    const seasonsButton = $("<div/>", {
      id: `toggle-seasons-${name}`,
      html: '<svg style="width: 15px; height: 15px;" viewBox="0 0 48 48"><path fill="currentColor" d="M15.3 28.3q-.85 0-1.425-.575-.575-.575-.575-1.425 0-.85.575-1.425.575-.575 1.425-.575.85 0 1.425.575.575.575.575 1.425 0 .85-.575 1.425-.575.575-1.425.575Zm8.85 0q-.85 0-1.425-.575-.575-.575-.575-1.425 0-.85.575-1.425.575-.575 1.425-.575.85 0 1.425.575.575.575.575 1.425 0 .85-.575 1.425-.575.575-1.425.575Zm8.5 0q-.85 0-1.425-.575-.575-.575-.575-1.425 0-.85.575-1.425.575-.575 1.425-.575.85 0 1.425.575.575.575.575 1.425 0 .85-.575 1.425-.575.575-1.425.575ZM9 44q-1.2 0-2.1-.9Q6 42.2 6 41V10q0-1.2.9-2.1Q7.8 7 9 7h3.25V4h3.25v3h17V4h3.25v3H39q1.2 0 2.1.9.9.9.9 2.1v31q0 1.2-.9 2.1-.9.9-2.1.9Zm0-3h30V19.5H9V41Zm0-24.5h30V10H9Zm0 0V10v6.5Z"/></svg>',
      title: this._host.engine.i18n("trade.seasons"),
    }).addClass("ks-icon-button");

    const list = SettingsSectionUi.getList(`seasons-list-${name}`);

    // fill out the list with seasons
    list.append(this._getSeason(name, "spring", option));
    list.append(this._getSeason(name, "summer", option));
    list.append(this._getSeason(name, "autumn", option));
    list.append(this._getSeason(name, "winter", option));

    seasonsButton.on("click", function () {
      list.toggle();
    });

    element.append(seasonsButton, list);

    return element;
  }

  private _getSeason(name: Race, season: Season, option: TradeSettingsItem): JQuery<HTMLElement> {
    const iname = ucfirst(this._host.engine.i18n(`$trade.race.${name}` as const));
    const iseason = ucfirst(this._host.engine.i18n(`$calendar.season.${season}` as const));

    const element = $("<li/>");

    const label = $("<label/>", {
      for: `toggle-${name}-${season}`,
      text: ucfirst(iseason),
    });

    const input = $("<input/>", {
      id: `toggle-${name}-${season}`,
      type: "checkbox",
    });
    option[`$${season}` as const] = input;

    input.on("change", () => {
      if (input.is(":checked") && option[season] === false) {
        this._host.updateOptions(() => (option[season] = true));
        this._host.engine.imessage("trade.season.enable", [iname, iseason]);
      } else if (!input.is(":checked") && option[season] === true) {
        this._host.updateOptions(() => (option[season] = false));
        this._host.engine.imessage("trade.season.disable", [iname, iseason]);
      }
    });

    element.append(input, label);

    return element;
  }

  private _getAdditionOptions(): Array<JQuery<HTMLElement>> {
    const header = this._getHeader("Additional options");

    // Embassies
    const embassiesList = SettingsListUi.getSettingsList(this._host.engine, "embassies");
    const embassiesElement = SettingsPanelUi.make(
      this._host,
      "embassies",
      this._host.engine.i18n("option.embassies"),
      this._settings.buildEmbassies,
      embassiesList
    );

    const embassiesButtons = [];
    for (const [race, option] of objectEntries(this._settings.buildEmbassies.items)) {
      const label = this._host.engine.i18n(`$trade.race.${race}`);
      const button = SettingMaxUi.make(this._host, `embassy-${race}`, option, label, {
        onCheck: () => this._host.engine.imessage("status.sub.enable", [label]),
        onUnCheck: () => this._host.engine.imessage("status.sub.disable", [label]),
      });

      embassiesButtons.push({ label: label, button: button });
    }
    embassiesElement.append(
      SettingTriggerUi.getTriggerButton(
        this._host,
        "buildEmbassies",
        this._host.engine.i18n("option.embassies"),
        this._settings.buildEmbassies
      )
    );
    // Ensure buttons are added into UI with their labels alphabetized.
    embassiesButtons.sort((a, b) => a.label.localeCompare(b.label));
    embassiesButtons.forEach(button => embassiesList.append(button.button));

    const unlockRaces = SettingUi.make(
      this._host,
      "races",
      this._settings.unlockRaces,
      this._host.engine.i18n("ui.upgrade.races"),
      {
        onCheck: () =>
          this._host.engine.imessage("status.auto.enable", [
            this._host.engine.i18n("ui.upgrade.races"),
          ]),
        onUnCheck: () =>
          this._host.engine.imessage("status.auto.disable", [
            this._host.engine.i18n("ui.upgrade.races"),
          ]),
      }
    );

    return [header, unlockRaces, embassiesElement, embassiesList];
  }

  setState(state: TradeSettings): void {
    this._settings.enabled = state.enabled;
    this._settings.trigger = state.trigger;

    this._settings.buildEmbassies.enabled = state.buildEmbassies.enabled;
    this._settings.unlockRaces.enabled = state.unlockRaces.enabled;

    for (const [name, option] of objectEntries(this._settings.items)) {
      option.enabled = state.items[name].enabled;
      option.limited = state.items[name].limited;

      option.autumn = state.items[name].autumn;
      option.spring = state.items[name].spring;
      option.summer = state.items[name].summer;
      option.winter = state.items[name].winter;
    }
  }

  refreshUi(): void {
    this.setState(this._settings);

    mustExist(this._settings.$enabled).prop("checked", this._settings.enabled);
    mustExist(this._settings.$trigger)[0].title = SettingsSectionUi.renderPercentage(
      this._settings.trigger
    );

    mustExist(this._settings.buildEmbassies.$enabled).prop(
      "checked",
      this._settings.buildEmbassies.enabled
    );
    for (const [name, option] of objectEntries(this._settings.buildEmbassies.items)) {
      mustExist(option.$enabled).prop("checked", this._settings.buildEmbassies.items[name].enabled);
      mustExist(option.$max).text(
        this._host.engine.i18n("ui.max", [
          this._renderLimit(this._settings.buildEmbassies.items[name].max),
        ])
      );
    }

    mustExist(this._settings.unlockRaces.$enabled).prop(
      "checked",
      this._settings.unlockRaces.enabled
    );

    for (const [name, option] of objectEntries(this._settings.items)) {
      mustExist(option.$enabled).prop("checked", this._settings.items[name].enabled);
      mustExist(option.$limited).prop("checked", this._settings.items[name].limited);

      mustExist(option.$autumn).prop("checked", this._settings.items[name].autumn);
      mustExist(option.$spring).prop("checked", this._settings.items[name].spring);
      mustExist(option.$summer).prop("checked", this._settings.items[name].summer);
      mustExist(option.$winter).prop("checked", this._settings.items[name].winter);
    }
  }
}
