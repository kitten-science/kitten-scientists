import { FilterItem, FilterSettings, FilterSettingsItem } from "../options/FilterSettings";
import { objectEntries } from "../tools/Entries";
import { ucfirst } from "../tools/Format";
import { mustExist } from "../tools/Maybe";
import { UserScript } from "../UserScript";
import { SettingsSectionUi } from "./SettingsSectionUi";
import { SettingUi } from "./SettingUi";

export class FiltersSettingsUi extends SettingsSectionUi {
  readonly element: JQuery<HTMLElement>;

  private readonly _settings: FilterSettings;

  constructor(host: UserScript, settings: FilterSettings) {
    super(host);

    this._settings = settings;

    const toggleName = "filter";
    const label = ucfirst(this._host.engine.i18n("ui.filter"));

    // Create build items.
    // We create these in a list that is displayed when the user clicks the "items" button.
    const list = this._getItemsList(toggleName);

    // Our main element is a list item.
    const element = this._getSettingsPanel(toggleName, label, this._settings, list);
    this._settings.$enabled = element.checkbox;

    const buttons = [
      {
        name: "buildFilter",
        option: this._settings.items.buildFilter,
        label: this._host.engine.i18n("filter.build"),
      },
      {
        name: "craftFilter",
        option: this._settings.items.craftFilter,
        label: this._host.engine.i18n("filter.craft"),
      },
      {
        name: "upgradeFilter",
        option: this._settings.items.upgradeFilter,
        label: this._host.engine.i18n("filter.upgrade"),
      },
      {
        name: "researchFilter",
        option: this._settings.items.researchFilter,
        label: this._host.engine.i18n("filter.research"),
      },
      {
        name: "tradeFilter",
        option: this._settings.items.tradeFilter,
        label: this._host.engine.i18n("filter.trade"),
      },
      {
        name: "huntFilter",
        option: this._settings.items.huntFilter,
        label: this._host.engine.i18n("filter.hunt"),
      },
      {
        name: "praiseFilter",
        option: this._settings.items.praiseFilter,
        label: this._host.engine.i18n("filter.praise"),
      },
      {
        name: "adoreFilter",
        option: this._settings.items.adoreFilter,
        label: this._host.engine.i18n("filter.adore"),
      },
      {
        name: "transcendFilter",
        option: this._settings.items.transcendFilter,
        label: this._host.engine.i18n("filter.transcend"),
      },
      {
        name: "faithFilter",
        option: this._settings.items.faithFilter,
        label: this._host.engine.i18n("filter.faith"),
      },
      {
        name: "accelerateFilter",
        option: this._settings.items.accelerateFilter,
        label: this._host.engine.i18n("filter.accelerate"),
      },
      {
        name: "timeSkipFilter",
        option: this._settings.items.timeSkipFilter,
        label: this._host.engine.i18n("filter.time.skip"),
      },
      {
        name: "festivalFilter",
        option: this._settings.items.festivalFilter,
        label: this._host.engine.i18n("filter.festival"),
      },
      {
        name: "starFilter",
        option: this._settings.items.starFilter,
        label: this._host.engine.i18n("filter.star"),
      },
      {
        name: "distributeFilter",
        option: this._settings.items.distributeFilter,
        label: this._host.engine.i18n("filter.distribute"),
      },
      {
        name: "promoteFilter",
        option: this._settings.items.promoteFilter,
        label: this._host.engine.i18n("filter.promote"),
      },
      {
        name: "miscFilter",
        option: this._settings.items.miscFilter,
        label: this._host.engine.i18n("filter.misc"),
      },
    ] as const;

    const makeButton = (name: FilterItem, option: FilterSettingsItem, label: string) =>
      SettingUi.make(this._host, name, option, label, false, false, [], {
        onCheck: () => {
          option.enabled = true;
          this._host.engine.imessage("filter.enable", [label]);
        },
        onUnCheck: () => {
          option.enabled = false;
          this._host.engine.imessage("filter.disable", [label]);
        },
      });

    const optionButtons = buttons.map(button =>
      makeButton(button.name, button.option, button.label)
    );

    list.append(optionButtons);
    list.append(this._getExplainer("Unchecked items are hidden from the log."));

    element.panel.append(list);

    this.element = element.panel;
  }

  setState(state: FilterSettings): void {
    this._settings.enabled = state.enabled;

    for (const [name, option] of objectEntries(this._settings.items)) {
      option.enabled = state.items[name].enabled;
    }
  }

  refreshUi(): void {
    this.setState(this._settings);

    mustExist(this._settings.$enabled).prop("checked", this._settings.enabled);

    for (const [name, option] of objectEntries(this._settings.items)) {
      mustExist(option.$enabled).prop("checked", this._settings.items[name].enabled);
    }
  }
}
