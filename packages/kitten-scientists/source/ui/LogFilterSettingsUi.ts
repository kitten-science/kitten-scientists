import { KittenScientists } from "../KittenScientists.js";
import { FilterItems, LogFilterSettings } from "../settings/LogFilterSettings.js";
import { Container } from "./components/Container.js";
import { ExplainerListItem } from "./components/ExplainerListItem.js";
import stylesLabelListItem from "./components/LabelListItem.module.css";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";

export class LogFiltersSettingsUi extends SettingsPanel<LogFilterSettings> {
  constructor(host: KittenScientists, settings: LogFilterSettings) {
    const label = host.engine.i18n("ui.filter");
    super(
      host,
      settings,
      new SettingListItem(host, label, settings, {
        childrenHead: [new Container(host, { classes: [stylesLabelListItem.fillSpace] })],
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
          new SettingListItem(host, host.engine.i18n("filter.allKG"), settings.disableKGLog),
        ],
        hasDisableAll: false,
        hasEnableAll: false,
      }),
    );

    const listFilters = new SettingsList(host, {
      children: FilterItems.map(item => {
        return { name: item, label: host.engine.i18n(`filter.${item}`) };
      })
        .sort((a, b) => a.label.localeCompare(b.label))
        .map(
          item =>
            new SettingListItem(host, item.label, this.setting.filters[item.name], {
              onCheck: () => {
                host.engine.imessage("filter.enable", [item.label]);
              },
              onUnCheck: () => {
                host.engine.imessage("filter.disable", [item.label]);
              },
            }),
        ),
    });
    this.addChild(listFilters);

    this.addChild(new ExplainerListItem(host, "filter.explainer"));
  }
}
