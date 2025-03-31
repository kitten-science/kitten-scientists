import type { KittenScientists } from "../KittenScientists.js";
import { FilterItems, type LogFilterSettings } from "../settings/LogFilterSettings.js";
import type { PanelOptions } from "./components/CollapsiblePanel.js";
import { Container } from "./components/Container.js";
import { ExplainerListItem } from "./components/ExplainerListItem.js";
import stylesLabelListItem from "./components/LabelListItem.module.css";
import { SettingListItem, type SettingListItemOptions } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";

export class LogFiltersSettingsUi extends SettingsPanel<LogFilterSettings> {
  constructor(
    host: KittenScientists,
    settings: LogFilterSettings,
    options?: Partial<PanelOptions & SettingListItemOptions>,
  ) {
    const label = host.engine.i18n("ui.filter");
    super(
      host,
      settings,
      new SettingListItem(host, settings, label, {
        childrenHead: [new Container(host, { classes: [stylesLabelListItem.fillSpace] })],
        onCheck: (isBatchProcess?: boolean) => {
          host.engine.imessage("status.auto.enable", [label]);
          this.refreshUi();
          options?.onCheck?.(isBatchProcess);
        },
        onUnCheck: (isBatchProcess?: boolean) => {
          host.engine.imessage("status.auto.disable", [label]);
          this.refreshUi();
          options?.onUnCheck?.(isBatchProcess);
        },
      }),
    );

    this.addChild(
      new SettingsList(host, {
        children: [
          new SettingListItem(host, settings.disableKGLog, host.engine.i18n("filter.allKG")),
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
            new SettingListItem(host, this.setting.filters[item.name], item.label, {
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
