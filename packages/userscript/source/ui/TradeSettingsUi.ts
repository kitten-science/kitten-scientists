import { TradeSettings, TradeSettingsItem } from "../options/TradeSettings";
import { objectEntries } from "../tools/Entries";
import { ucfirst } from "../tools/Format";
import { mustExist } from "../tools/Maybe";
import { Race, Season } from "../types";
import { UserScript } from "../UserScript";
import { HeaderListItem } from "./components/HeaderListItem";
import { SettingLimitedListItem } from "./components/SettingLimitedListItem";
import { SettingListItem } from "./components/SettingListItem";
import { SettingsList } from "./components/SettingsList";
import { SettingsPanel } from "./components/SettingsPanel";
import { TriggerButton } from "./components/TriggerButton";
import { EmbassySettingsUi } from "./EmbassySettingsUi";
import { SettingsSectionUi } from "./SettingsSectionUi";

export class TradeSettingsUi extends SettingsSectionUi {
  protected readonly _items: Array<SettingListItem>;
  private readonly _trigger: TriggerButton;
  private readonly _settings: TradeSettings;

  constructor(host: UserScript, settings: TradeSettings) {
    const label = ucfirst(host.engine.i18n("ui.trade"));
    const panel = new SettingsPanel(host, label, settings);
    super(host, panel);

    this._settings = settings;

    // Create "trigger" button in the item.
    this._trigger = new TriggerButton(host, label, settings);
    this._trigger.element.insertBefore(panel.list);

    this.panel._list.addEventListener("enableAll", () => {
      this._items.forEach(item => (item.setting.enabled = true));
      this.refreshUi();
    });
    this.panel._list.addEventListener("disableAll", () => {
      this._items.forEach(item => (item.setting.enabled = false));
      this.refreshUi();
    });
    this.panel._list.addEventListener("reset", () => {
      this._settings.load(new TradeSettings());
      this.refreshUi();
    });

    this._items = [
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

    for (const setting of this._items) {
      panel.list.append(setting.element);
    }

    const additionOptions = this._getAdditionOptions();
    panel.list.append(additionOptions);
  }

  private _getTradeOption(
    name: Race,
    option: TradeSettingsItem,
    i18nName: string,
    delimiter = false,
    upgradeIndicator = false
  ) {
    const element = new SettingLimitedListItem(
      this._host,
      i18nName,
      option,
      {
        onCheck: () => this._host.engine.imessage("status.sub.enable", [i18nName]),
        onUnCheck: () => this._host.engine.imessage("status.sub.disable", [i18nName]),
        onLimitedCheck: () => this._host.engine.imessage("trade.limited", [i18nName]),
        onLimitedUnCheck: () => this._host.engine.imessage("trade.unlimited", [i18nName]),
      },
      delimiter,
      upgradeIndicator
    );

    const seasonsButton = $("<div/>", {
      html: '<svg style="width: 15px; height: 15px;" viewBox="0 0 48 48"><path fill="currentColor" d="M15.3 28.3q-.85 0-1.425-.575-.575-.575-.575-1.425 0-.85.575-1.425.575-.575 1.425-.575.85 0 1.425.575.575.575.575 1.425 0 .85-.575 1.425-.575.575-1.425.575Zm8.85 0q-.85 0-1.425-.575-.575-.575-.575-1.425 0-.85.575-1.425.575-.575 1.425-.575.85 0 1.425.575.575.575.575 1.425 0 .85-.575 1.425-.575.575-1.425.575Zm8.5 0q-.85 0-1.425-.575-.575-.575-.575-1.425 0-.85.575-1.425.575-.575 1.425-.575.85 0 1.425.575.575.575.575 1.425 0 .85-.575 1.425-.575.575-1.425.575ZM9 44q-1.2 0-2.1-.9Q6 42.2 6 41V10q0-1.2.9-2.1Q7.8 7 9 7h3.25V4h3.25v3h17V4h3.25v3H39q1.2 0 2.1.9.9.9.9 2.1v31q0 1.2-.9 2.1-.9.9-2.1.9Zm0-3h30V19.5H9V41Zm0-24.5h30V10H9Zm0 0V10v6.5Z"/></svg>',
      title: this._host.engine.i18n("trade.seasons"),
    }).addClass("ks-icon-button");

    const list = new SettingsList(this._host);

    // fill out the list with seasons
    list.element.append(this._getSeason(name, "spring", option));
    list.element.append(this._getSeason(name, "summer", option));
    list.element.append(this._getSeason(name, "autumn", option));
    list.element.append(this._getSeason(name, "winter", option));

    seasonsButton.on("click", function () {
      list.element.toggle();
    });

    element.element.append(seasonsButton, list.element);

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

    label.prepend(input);
    element.append(label);

    return element;
  }

  private _getAdditionOptions(): Array<JQuery<HTMLElement>> {
    const header = new HeaderListItem(this._host, "Additional options");

    // Embassies
    const embassiesElement = new EmbassySettingsUi(this._host, this._settings.buildEmbassies);

    const unlockRaces = new SettingListItem(
      this._host,
      this._host.engine.i18n("ui.upgrade.races"),
      this._settings.unlockRaces,
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

    return [header.element, unlockRaces.element, embassiesElement.element];
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

    mustExist(this._settings.$enabled).refreshUi();
    mustExist(this._settings.$trigger).refreshUi();

    mustExist(this._settings.buildEmbassies.$enabled).refreshUi();
    mustExist(this._settings.buildEmbassies.$trigger).refreshUi();
    for (const [, option] of objectEntries(this._settings.buildEmbassies.items)) {
      mustExist(option.$enabled).refreshUi();
      mustExist(option.$max).refreshUi();
    }

    mustExist(this._settings.unlockRaces.$enabled).refreshUi();

    for (const [name, option] of objectEntries(this._settings.items)) {
      mustExist(option.$enabled).refreshUi();
      mustExist(option.$limited).refreshUi();

      mustExist(option.$autumn).prop("checked", this._settings.items[name].autumn);
      mustExist(option.$spring).prop("checked", this._settings.items[name].spring);
      mustExist(option.$summer).prop("checked", this._settings.items[name].summer);
      mustExist(option.$winter).prop("checked", this._settings.items[name].winter);
    }
  }
}
