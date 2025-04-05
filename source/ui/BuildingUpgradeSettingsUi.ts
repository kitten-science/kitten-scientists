import type { SupportedLocale } from "../Engine.js";
import type { BonfireSettings } from "../settings/BonfireSettings.js";
import type { BuildingUpgradeSettings } from "../settings/BuildingUpgradeSettings.js";
import type { SettingOptions } from "../settings/Settings.js";
import { Container } from "./components/Container.js";
import stylesLabelListItem from "./components/LabelListItem.module.css";
import { SettingListItem, type SettingListItemOptions } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel, type SettingsPanelOptions } from "./components/SettingsPanel.js";
import type { UiComponent } from "./components/UiComponent.js";

export class BuildingUpgradeSettingsUi extends SettingsPanel<BuildingUpgradeSettings> {
  constructor(
    parent: UiComponent,
    settings: BuildingUpgradeSettings,
    locale: SettingOptions<SupportedLocale>,
    sectionSetting: BonfireSettings,
    options?: SettingsPanelOptions<SettingListItem> & SettingListItemOptions,
  ) {
    const label = parent.host.engine.i18n("ui.upgrade.buildings");
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
        onRefresh: () => {
          this.expando.ineffective =
            sectionSetting.enabled &&
            settings.enabled &&
            !Object.values(settings.buildings).some(building => building.enabled);
        },
      }),
      options,
    );

    const items = [];
    for (const setting of Object.values(this.setting.buildings)) {
      const label = parent.host.engine.i18n(`$buildings.${setting.upgrade}.label`);
      const button = new SettingListItem(parent, setting, label, {
        onCheck: () => {
          parent.host.engine.imessage("status.sub.enable", [label]);
          this.refreshUi();
        },
        onUnCheck: () => {
          parent.host.engine.imessage("status.sub.disable", [label]);
          this.refreshUi();
        },
      });

      items.push({ label: label, button: button });
    }
    // Ensure buttons are added into UI with their labels alphabetized.
    items.sort((a, b) => a.label.localeCompare(b.label));
    const itemsList = new SettingsList(parent);
    for (const button of items) {
      itemsList.addChild(button.button);
    }
    this.addChild(itemsList);
  }
}
