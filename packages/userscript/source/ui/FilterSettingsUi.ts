import { FilterItem, FilterSettings, FilterSettingsItem } from "../options/FilterSettings";
import { objectEntries } from "../tools/Entries";
import { ucfirst } from "../tools/Format";
import { mustExist } from "../tools/Maybe";
import { UserScript } from "../UserScript";
import { SettingListItem } from "./components/SettingListItem";
import { SettingsPanel } from "./components/SettingsPanel";
import { SettingsSectionUi } from "./SettingsSectionUi";

export class FiltersSettingsUi extends SettingsSectionUi {
  private readonly _settings: FilterSettings;

  constructor(host: UserScript, settings: FilterSettings) {
    const toggleName = "filter";
    const label = ucfirst(host.engine.i18n("ui.filter"));
    const panel = new SettingsPanel(host, toggleName, label, settings);
    super(host, panel);

    this._settings = settings;

    const buttons = [
      {
        name: "buildFilter" as const,
        option: this._settings.items.buildFilter,
        label: this._host.engine.i18n("filter.build"),
      },
      {
        name: "craftFilter" as const,
        option: this._settings.items.craftFilter,
        label: this._host.engine.i18n("filter.craft"),
      },
      {
        name: "upgradeFilter" as const,
        option: this._settings.items.upgradeFilter,
        label: this._host.engine.i18n("filter.upgrade"),
      },
      {
        name: "researchFilter" as const,
        option: this._settings.items.researchFilter,
        label: this._host.engine.i18n("filter.research"),
      },
      {
        name: "tradeFilter" as const,
        option: this._settings.items.tradeFilter,
        label: this._host.engine.i18n("filter.trade"),
      },
      {
        name: "huntFilter" as const,
        option: this._settings.items.huntFilter,
        label: this._host.engine.i18n("filter.hunt"),
      },
      {
        name: "praiseFilter" as const,
        option: this._settings.items.praiseFilter,
        label: this._host.engine.i18n("filter.praise"),
      },
      {
        name: "adoreFilter" as const,
        option: this._settings.items.adoreFilter,
        label: this._host.engine.i18n("filter.adore"),
      },
      {
        name: "transcendFilter" as const,
        option: this._settings.items.transcendFilter,
        label: this._host.engine.i18n("filter.transcend"),
      },
      {
        name: "faithFilter" as const,
        option: this._settings.items.faithFilter,
        label: this._host.engine.i18n("filter.faith"),
      },
      {
        name: "accelerateFilter" as const,
        option: this._settings.items.accelerateFilter,
        label: this._host.engine.i18n("filter.accelerate"),
      },
      {
        name: "timeSkipFilter" as const,
        option: this._settings.items.timeSkipFilter,
        label: this._host.engine.i18n("filter.time.skip"),
      },
      {
        name: "festivalFilter" as const,
        option: this._settings.items.festivalFilter,
        label: this._host.engine.i18n("filter.festival"),
      },
      {
        name: "starFilter" as const,
        option: this._settings.items.starFilter,
        label: this._host.engine.i18n("filter.star"),
      },
      {
        name: "distributeFilter" as const,
        option: this._settings.items.distributeFilter,
        label: this._host.engine.i18n("filter.distribute"),
      },
      {
        name: "promoteFilter" as const,
        option: this._settings.items.promoteFilter,
        label: this._host.engine.i18n("filter.promote"),
      },
      {
        name: "miscFilter" as const,
        option: this._settings.items.miscFilter,
        label: this._host.engine.i18n("filter.misc"),
      },
    ];

    const makeButton = (name: FilterItem, option: FilterSettingsItem, label: string) =>
      new SettingListItem(
        this._host,
        name,
        label,
        option,
        {
          onCheck: () => this._host.engine.imessage("filter.enable", [label]),
          onUnCheck: () => this._host.engine.imessage("filter.disable", [label]),
        },
        false,
        false,
        []
      ).element;

    const optionButtons = buttons
      .sort((a, b) => a.label.localeCompare(b.label))
      .map(button => makeButton(button.name, button.option, button.label));

    panel.list.append(optionButtons);
    panel.list.append(this._getExplainer("Disabled items are hidden from the log."));
  }

  setState(state: FilterSettings): void {
    this._settings.enabled = state.enabled;

    for (const [name, option] of objectEntries(this._settings.items)) {
      option.enabled = state.items[name].enabled;
    }
  }

  refreshUi(): void {
    this.setState(this._settings);

    mustExist(this._settings.$enabled).refreshUi();

    for (const [, option] of objectEntries(this._settings.items)) {
      mustExist(option.$enabled).refreshUi();
    }
  }
}
