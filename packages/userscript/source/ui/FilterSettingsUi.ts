import { FilterItem, FilterSettings, FilterSettingsItem } from "../options/FilterSettings";
import { objectEntries } from "../tools/Entries";
import { ucfirst } from "../tools/Format";
import { mustExist } from "../tools/Maybe";
import { UserScript } from "../UserScript";
import { SettingsSectionUi } from "./SettingsSectionUi";

export class FiltersSettingsUi extends SettingsSectionUi<FilterSettings> {
  readonly element: JQuery<HTMLElement>;

  private readonly _options: FilterSettings;

  private _itemsExpanded = false;

  constructor(host: UserScript, options: FilterSettings = host.options.auto.filters) {
    super(host);

    this._options = options;

    const toggleName = "filter";

    const itext = ucfirst(this._host.i18n("ui.filter"));

    // Our main element is a list item.
    const element = this._getSettingsPanel(toggleName, itext);

    this._options.$enabled = element.checkbox;

    element.checkbox.on("change", () => {
      if (element.checkbox.is(":checked") && this._options.enabled === false) {
        this._host.updateOptions(() => (this._options.enabled = true));
        this._host.imessage("status.auto.enable", [itext]);
      } else if (!element.checkbox.is(":checked") && this._options.enabled === true) {
        this._host.updateOptions(() => (this._options.enabled = false));
        this._host.imessage("status.auto.disable", [itext]);
      }
    });

    // Create build items.
    // We create these in a list that is displayed when the user clicks the "items" button.
    const list = this._getOptionList(toggleName);

    element.items.on("click", () => {
      list.toggle();

      this._itemsExpanded = !this._itemsExpanded;

      element.items.text(this._itemsExpanded ? "-" : "+");
      element.items.prop(
        "title",
        this._itemsExpanded ? this._host.i18n("ui.itemsHide") : this._host.i18n("ui.itemsShow")
      );
    });

    const buttons = [
      {
        name: "buildFilter",
        option: this._options.items.buildFilter,
        label: this._host.i18n("filter.build"),
      },
      {
        name: "craftFilter",
        option: this._options.items.craftFilter,
        label: this._host.i18n("filter.craft"),
      },
      {
        name: "upgradeFilter",
        option: this._options.items.upgradeFilter,
        label: this._host.i18n("filter.upgrade"),
      },
      {
        name: "researchFilter",
        option: this._options.items.researchFilter,
        label: this._host.i18n("filter.research"),
      },
      {
        name: "tradeFilter",
        option: this._options.items.tradeFilter,
        label: this._host.i18n("filter.trade"),
      },
      {
        name: "huntFilter",
        option: this._options.items.huntFilter,
        label: this._host.i18n("filter.hunt"),
      },
      {
        name: "praiseFilter",
        option: this._options.items.praiseFilter,
        label: this._host.i18n("filter.praise"),
      },
      {
        name: "adoreFilter",
        option: this._options.items.adoreFilter,
        label: this._host.i18n("filter.adore"),
      },
      {
        name: "transcendFilter",
        option: this._options.items.transcendFilter,
        label: this._host.i18n("filter.transcend"),
      },
      {
        name: "faithFilter",
        option: this._options.items.faithFilter,
        label: this._host.i18n("filter.faith"),
      },
      {
        name: "accelerateFilter",
        option: this._options.items.accelerateFilter,
        label: this._host.i18n("filter.accelerate"),
      },
      {
        name: "timeSkipFilter",
        option: this._options.items.timeSkipFilter,
        label: this._host.i18n("filter.time.skip"),
      },
      {
        name: "festivalFilter",
        option: this._options.items.festivalFilter,
        label: this._host.i18n("filter.festival"),
      },
      {
        name: "starFilter",
        option: this._options.items.starFilter,
        label: this._host.i18n("filter.star"),
      },
      {
        name: "distributeFilter",
        option: this._options.items.distributeFilter,
        label: this._host.i18n("filter.distribute"),
      },
      {
        name: "promoteFilter",
        option: this._options.items.promoteFilter,
        label: this._host.i18n("filter.promote"),
      },
      {
        name: "miscFilter",
        option: this._options.items.miscFilter,
        label: this._host.i18n("filter.misc"),
      },
    ] as const;

    const makeButton = (name: FilterItem, option: FilterSettingsItem, label: string) =>
      this._getOption(name, option, label, false, {
        onCheck: () => {
          option.enabled = true;
          this._host.imessage("filter.enable", [label]);
        },
        onUnCheck: () => {
          option.enabled = false;
          this._host.imessage("filter.disable", [label]);
        },
      });

    const optionButtons = buttons.map(button =>
      makeButton(button.name, button.option, button.label)
    );

    list.append(optionButtons);

    element.panel.append(list);

    this.element = element.panel;
  }

  getState(): FilterSettings {
    return {
      enabled: this._options.enabled,
      items: this._options.items,
    };
  }

  setState(state: FilterSettings): void {
    this._options.enabled = state.enabled;

    for (const [name, option] of objectEntries(this._options.items)) {
      option.enabled = state.items[name].enabled;
    }
  }

  refreshUi(): void {
    mustExist(this._options.$enabled).prop("checked", this._options.enabled);

    for (const [name, option] of objectEntries(this._options.items)) {
      mustExist(option.$enabled).prop("checked", this._options.items[name].enabled);
    }
  }
}
