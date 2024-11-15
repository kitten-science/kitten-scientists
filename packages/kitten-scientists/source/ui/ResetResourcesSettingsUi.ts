import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { SupportedLanguage } from "../Engine.js";
import { KittenScientists } from "../KittenScientists.js";
import { Icons } from "../images/Icons.js";
import {
  ResetResourcesSettings,
  ResetResourcesSettingsItem,
} from "../settings/ResetResourcesSettings.js";
import { SettingOptions } from "../settings/Settings.js";
import { ucfirst } from "../tools/Format.js";
import { IconSettingsPanel } from "./components/IconSettingsPanel.js";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { StockButton } from "./components/buttons-icon/StockButton.js";

export class ResetResourcesSettingsUi extends IconSettingsPanel<ResetResourcesSettings> {
  constructor(
    host: KittenScientists,
    settings: ResetResourcesSettings,
    language: SettingOptions<SupportedLanguage>,
  ) {
    const label = host.engine.i18n("ui.resources");
    super(host, label, settings, {
      icon: Icons.Resources,
    });

    this.addChild(
      new SettingsList(host, {
        children: host.game.resPool.resources
          .filter(item => !isNil(this.setting.resources[item.name]))
          .sort((a, b) => (language.selected !== "zh" ? a.title.localeCompare(b.title) : 0))
          .map(resource =>
            this._makeResourceSetting(
              host,
              ucfirst(resource.title),
              this.setting.resources[resource.name],
            ),
          ),
      }),
    );
  }

  /**
   * Creates a UI element that reflects stock values for a given resource.
   * This is currently only used for the time/reset section.
   *
   * @param title The title to apply to the option.
   * @param setting The option that is being controlled.
   * @returns A new option with stock value.
   */
  private _makeResourceSetting(
    host: KittenScientists,
    title: string,
    setting: ResetResourcesSettingsItem,
  ) {
    // The overall container for this resource item.
    const container = new SettingListItem(host, title, setting, {
      onCheck: () => {
        host.engine.imessage("status.sub.enable", [title]);
      },
      onUnCheck: () => {
        host.engine.imessage("status.sub.disable", [title]);
      },
    });

    // How many items to stock.
    const stockElement = new StockButton(host, title, setting);
    container.head.addChild(stockElement);

    return container;
  }
}
