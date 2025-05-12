import { FilterItems, type LogFilterSettings } from "../settings/LogFilterSettings.js";
import { Container } from "./components/Container.js";
import { ExplainerListItem } from "./components/ExplainerListItem.js";
import stylesLabelListItem from "./components/LabelListItem.module.css";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
import type { UiComponent } from "./components/UiComponent.js";

export class LogFiltersSettingsUi extends SettingsPanel<LogFilterSettings> {
  constructor(parent: UiComponent, settings: LogFilterSettings) {
    const label = parent.host.engine.i18n("ui.filter");
    super(
      parent,
      settings,
      new SettingListItem(parent, settings, label, {
        onCheck: (_isBatchProcess?: boolean) => {
          parent.host.engine.imessage("status.auto.enable", [label]);
        },
        onUnCheck: (_isBatchProcess?: boolean) => {
          parent.host.engine.imessage("status.auto.disable", [label]);
        },
      }).addChildrenHead([new Container(parent, { classes: [stylesLabelListItem.fillSpace] })]),
    );

    this.addChildContent(
      new SettingsList(this, {
        hasDisableAll: false,
        hasEnableAll: false,
      }).addChildren([
        new SettingListItem(this, settings.disableKGLog, this.host.engine.i18n("filter.allKG")),
      ]),
    );

    const listFilters = new SettingsList(this).addChildren(
      FilterItems.map(item => {
        return { label: this.host.engine.i18n(`filter.${item}`), name: item };
      })
        .sort((a, b) => a.label.localeCompare(b.label))
        .map(
          item =>
            new SettingListItem(this, this.setting.filters[item.name], item.label, {
              onCheck: () => {
                this.host.engine.imessage("filter.enable", [item.label]);
              },
              onUnCheck: () => {
                this.host.engine.imessage("filter.disable", [item.label]);
              },
            }),
        ),
    );
    this.addChildContent(listFilters);

    this.addChildContent(new ExplainerListItem(this, "filter.explainer"));
  }
}
