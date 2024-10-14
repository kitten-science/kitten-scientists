import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { SupportedLanguage } from "../Engine.js";
import { KittenScientists } from "../KittenScientists.js";
import { SettingOptions } from "../settings/Settings.js";
import { TechSettings } from "../settings/TechSettings.js";
import { PanelOptions } from "./components/CollapsiblePanel.js";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";

export class TechSettingsUi extends SettingsPanel<TechSettings> {
  constructor(
    host: KittenScientists,
    settings: TechSettings,
    language: SettingOptions<SupportedLanguage>,
    options?: PanelOptions,
  ) {
    const label = host.engine.i18n("ui.upgrade.techs");
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
      options,
    );

    const localeSupportsSortMethod = language.selected !== "zh";

    const items = [];
    for (const tech of localeSupportsSortMethod
      ? this._host.game.science.techs.sort((a, b) => a.label.localeCompare(b.label))
      : this._host.game.science.techs) {
      if (isNil(this.setting.techs[tech.name])) {
        continue;
      }

      const button = new SettingListItem(this._host, tech.label, this.setting.techs[tech.name], {
        onCheck: () => {
          this._host.engine.imessage("status.sub.enable", [tech.label]);
        },
        onUnCheck: () => {
          this._host.engine.imessage("status.sub.disable", [tech.label]);
        },
      });

      items.push(button);
    }

    const itemsList = new SettingsList(this._host, { children: items });
    this.addChild(itemsList);
  }
}
