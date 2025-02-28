import type { KittenScientists } from "../KittenScientists.js";
import type { BuildingUpgradeSettings } from "../settings/BuildingUpgradeSettings.js";
import type { PanelOptions } from "./components/CollapsiblePanel.js";
import { Container } from "./components/Container";
import stylesLabelListItem from "./components/LabelListItem.module.css";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";

export class BuildingUpgradeSettingsUi extends SettingsPanel<BuildingUpgradeSettings> {
  constructor(host: KittenScientists, settings: BuildingUpgradeSettings, options?: PanelOptions) {
    const label = host.engine.i18n("ui.upgrade.buildings");
    super(
      host,
      settings,
      new SettingListItem(host, settings, label, {
        childrenHead: [new Container(host, { classes: [stylesLabelListItem.fillSpace] })],
        onCheck: () => {
          host.engine.imessage("status.auto.enable", [label]);
        },
        onUnCheck: () => {
          host.engine.imessage("status.auto.disable", [label]);
        },
      }),
      options,
    );

    const items = [];
    for (const setting of Object.values(this.setting.buildings)) {
      const label = host.engine.i18n(`$buildings.${setting.upgrade}.label`);
      const button = new SettingListItem(host, setting, label, {
        onCheck: () => {
          host.engine.imessage("status.sub.enable", [label]);
        },
        onUnCheck: () => {
          host.engine.imessage("status.sub.disable", [label]);
        },
      });

      items.push({ label: label, button: button });
    }
    // Ensure buttons are added into UI with their labels alphabetized.
    items.sort((a, b) => a.label.localeCompare(b.label));
    const itemsList = new SettingsList(host);
    for (const button of items) {
      itemsList.addChild(button.button);
    }
    this.addChild(itemsList);
  }
}
