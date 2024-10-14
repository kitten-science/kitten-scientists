import { KittenScientists } from "../KittenScientists.js";
import { FilterItems, LogFilterSettings } from "../settings/LogFilterSettings.js";
import { ExplainerListItem } from "./components/ExplainerListItem.js";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { AbstractBuildSettingsPanel } from "./SettingsSectionUi.js";

export class LogFiltersSettingsUi extends AbstractBuildSettingsPanel<LogFilterSettings> {
  constructor(host: KittenScientists, settings: LogFilterSettings) {
    const label = host.engine.i18n("ui.filter");
    super(
      host,
      settings,
      new SettingListItem(host, label, settings, {
        onCheck: () => {
          host.engine.imessage("status.auto.enable", [label]);
        },
        onUnCheck: () => {
          host.engine.imessage("status.auto.disable", [label]);
        },
      }),
    );

    this.addChild(
      new SettingsList(host, {
        children: [
          new SettingListItem(host, this._host.engine.i18n("filter.allKG"), settings.disableKGLog),
        ],
        hasDisableAll: false,
        hasEnableAll: false,
      }),
    );

    const listFilters = new SettingsList(this._host, {
      children: FilterItems.map(item => {
        return { name: item, label: this._host.engine.i18n(`filter.${item}`) };
      })
        .sort((a, b) => a.label.localeCompare(b.label))
        .map(
          item =>
            new SettingListItem(this._host, item.label, this.setting.filters[item.name], {
              onCheck: () => {
                this._host.engine.imessage("filter.enable", [item.label]);
              },
              onUnCheck: () => {
                this._host.engine.imessage("filter.disable", [item.label]);
              },
            }),
        ),
    });
    this.addChild(listFilters);

    this.addChild(new ExplainerListItem(this._host, "filter.explainer"));
  }
}
