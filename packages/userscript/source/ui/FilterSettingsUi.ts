import { FilterSettings, FilterSettingsItem } from "../options/FilterSettings";
import { UserScript } from "../UserScript";
import { ExplainerListItem } from "./components/ExplainerListItem";
import { SettingListItem } from "./components/SettingListItem";
import { SettingsSectionUi } from "./SettingsSectionUi";

export class FiltersSettingsUi extends SettingsSectionUi<FilterSettings> {
  private readonly _filters: Array<SettingListItem>;

  constructor(host: UserScript, settings: FilterSettings) {
    const label = host.engine.i18n("ui.filter");
    super(host, label, settings);

    this._list.addEventListener("enableAll", () => {
      this._filters.forEach(item => (item.settings.enabled = true));
      this.refreshUi();
    });
    this._list.addEventListener("disableAll", () => {
      this._filters.forEach(item => (item.settings.enabled = false));
      this.refreshUi();
    });
    this._list.addEventListener("reset", () => {
      this.settings.load(new FilterSettings());
      this.refreshUi();
    });

    const buttonTemplates = [
      {
        name: "buildFilter" as const,
        option: this.settings.items.buildFilter,
        label: this._host.engine.i18n("filter.build"),
      },
      {
        name: "craftFilter" as const,
        option: this.settings.items.craftFilter,
        label: this._host.engine.i18n("filter.craft"),
      },
      {
        name: "upgradeFilter" as const,
        option: this.settings.items.upgradeFilter,
        label: this._host.engine.i18n("filter.upgrade"),
      },
      {
        name: "researchFilter" as const,
        option: this.settings.items.researchFilter,
        label: this._host.engine.i18n("filter.research"),
      },
      {
        name: "tradeFilter" as const,
        option: this.settings.items.tradeFilter,
        label: this._host.engine.i18n("filter.trade"),
      },
      {
        name: "huntFilter" as const,
        option: this.settings.items.huntFilter,
        label: this._host.engine.i18n("filter.hunt"),
      },
      {
        name: "praiseFilter" as const,
        option: this.settings.items.praiseFilter,
        label: this._host.engine.i18n("filter.praise"),
      },
      {
        name: "adoreFilter" as const,
        option: this.settings.items.adoreFilter,
        label: this._host.engine.i18n("filter.adore"),
      },
      {
        name: "transcendFilter" as const,
        option: this.settings.items.transcendFilter,
        label: this._host.engine.i18n("filter.transcend"),
      },
      {
        name: "faithFilter" as const,
        option: this.settings.items.faithFilter,
        label: this._host.engine.i18n("filter.faith"),
      },
      {
        name: "accelerateFilter" as const,
        option: this.settings.items.accelerateFilter,
        label: this._host.engine.i18n("filter.accelerate"),
      },
      {
        name: "timeSkipFilter" as const,
        option: this.settings.items.timeSkipFilter,
        label: this._host.engine.i18n("filter.time.skip"),
      },
      {
        name: "festivalFilter" as const,
        option: this.settings.items.festivalFilter,
        label: this._host.engine.i18n("filter.festival"),
      },
      {
        name: "starFilter" as const,
        option: this.settings.items.starFilter,
        label: this._host.engine.i18n("filter.star"),
      },
      {
        name: "distributeFilter" as const,
        option: this.settings.items.distributeFilter,
        label: this._host.engine.i18n("filter.distribute"),
      },
      {
        name: "promoteFilter" as const,
        option: this.settings.items.promoteFilter,
        label: this._host.engine.i18n("filter.promote"),
      },
      {
        name: "miscFilter" as const,
        option: this.settings.items.miscFilter,
        label: this._host.engine.i18n("filter.misc"),
      },
    ];

    const makeButton = (option: FilterSettingsItem, label: string) =>
      new SettingListItem(
        this._host,
        label,
        option,
        {
          onCheck: () => this._host.engine.imessage("filter.enable", [label]),
          onUnCheck: () => this._host.engine.imessage("filter.disable", [label]),
        },
        false,
        false
      );

    this._filters = buttonTemplates
      .sort((a, b) => a.label.localeCompare(b.label))
      .map(button => makeButton(button.option, button.label));
    this.addChildren(this._filters);

    this.addChild(new ExplainerListItem(this._host, "Disabled items are hidden from the log."));
  }
}
