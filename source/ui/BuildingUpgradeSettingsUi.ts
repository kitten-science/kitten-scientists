import type { SupportedLocale } from "../Engine.js";
import type { BonfireSettings } from "../settings/BonfireSettings.js";
import type { BuildingUpgradeSettings } from "../settings/BuildingUpgradeSettings.js";
import type { SettingOptions } from "../settings/Settings.js";
import { Container } from "./components/Container.js";
import stylesLabelListItem from "./components/LabelListItem.module.css";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
import type { UiComponent } from "./components/UiComponent.js";

export class BuildingUpgradeSettingsUi extends SettingsPanel<BuildingUpgradeSettings> {
  constructor(
    parent: UiComponent,
    settings: BuildingUpgradeSettings,
    _locale: SettingOptions<SupportedLocale>,
    sectionSetting: BonfireSettings,
  ) {
    const label = parent.host.engine.i18n("ui.upgrade.buildings");
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
      {
        onRefreshRequest: () => {
          this.expando.ineffective =
            sectionSetting.enabled &&
            settings.enabled &&
            !Object.values(settings.buildings).some(building => building.enabled);
        },
      },
    );

    const items = [];
    for (const setting of Object.values(this.setting.buildings)) {
      const label = this.host.engine.i18n(`$buildings.${setting.upgrade}.label`);
      const button = new SettingListItem(this, setting, label, {
        onCheck: () => {
          this.host.engine.imessage("status.sub.enable", [label]);
        },
        onUnCheck: () => {
          this.host.engine.imessage("status.sub.disable", [label]);
        },
      });

      items.push({ button: button, label: label });
    }
    // Ensure buttons are added into UI with their labels alphabetized.
    items.sort((a, b) => a.label.localeCompare(b.label));
    const itemsList = new SettingsList(this);
    for (const button of items) {
      itemsList.addChild(button.button);
    }
    this.addChildContent(itemsList);
  }
}
