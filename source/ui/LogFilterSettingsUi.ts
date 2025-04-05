import { FilterItems, type LogFilterSettings } from "../settings/LogFilterSettings.js";
import { Container } from "./components/Container.js";
import { ExplainerListItem } from "./components/ExplainerListItem.js";
import stylesLabelListItem from "./components/LabelListItem.module.css";
import { SettingListItem, type SettingListItemOptions } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel, type SettingsPanelOptions } from "./components/SettingsPanel.js";
import type { UiComponent } from "./components/UiComponent.js";

export class LogFiltersSettingsUi extends SettingsPanel<LogFilterSettings> {
  constructor(
    parent: UiComponent,
    settings: LogFilterSettings,
    options?: SettingsPanelOptions<SettingListItem> & SettingListItemOptions,
  ) {
    const label = parent.host.engine.i18n("ui.filter");
    super(
      parent,
      settings,
      new SettingListItem(parent, settings, label, {
        childrenHead: [new Container(parent, { classes: [stylesLabelListItem.fillSpace] })],
        onCheck: (isBatchProcess?: boolean) => {
          parent.host.engine.imessage("status.auto.enable", [label]);
          this.refreshUi();
          options?.onCheck?.(isBatchProcess);
        },
        onUnCheck: (isBatchProcess?: boolean) => {
          parent.host.engine.imessage("status.auto.disable", [label]);
          this.refreshUi();
          options?.onUnCheck?.(isBatchProcess);
        },
      }),
    );

    this.addChild(
      new SettingsList(parent, {
        children: [
          new SettingListItem(
            parent,
            settings.disableKGLog,
            parent.host.engine.i18n("filter.allKG"),
          ),
        ],
        hasDisableAll: false,
        hasEnableAll: false,
      }),
    );

    const listFilters = new SettingsList(parent, {
      children: FilterItems.map(item => {
        return { name: item, label: parent.host.engine.i18n(`filter.${item}`) };
      })
        .sort((a, b) => a.label.localeCompare(b.label))
        .map(
          item =>
            new SettingListItem(parent, this.setting.filters[item.name], item.label, {
              onCheck: () => {
                parent.host.engine.imessage("filter.enable", [item.label]);
              },
              onUnCheck: () => {
                parent.host.engine.imessage("filter.disable", [item.label]);
              },
            }),
        ),
    });
    this.addChild(listFilters);

    this.addChild(new ExplainerListItem(parent, "filter.explainer"));
  }
}
