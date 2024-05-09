import { isNil } from "@oliversalzburg/js-utils/nil.js";
import { UserScript } from "../UserScript.js";
import { Icons } from "../images/Icons.js";
import {
  ResetResourcesSettings,
  ResetResourcesSettingsItem,
} from "../settings/ResetResourcesSettings.js";
import { ucfirst } from "../tools/Format.js";
import { IconSettingsPanel } from "./components/IconSettingsPanel.js";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { StockButton } from "./components/buttons-text/StockButton.js";

export class ResetResourcesSettingsUi extends IconSettingsPanel<ResetResourcesSettings> {
  private readonly _resources: Array<SettingListItem>;

  constructor(host: UserScript, settings: ResetResourcesSettings) {
    const label = host.engine.i18n("ui.resources");
    super(host, label, settings, {
      icon: Icons.Resources,
    });

    // Add all the current resources
    this._resources = this._host.game.resPool.resources
      .filter(item => !isNil(this.setting.resources[item.name]))
      .map(resource =>
        this._addNewResourceOption(ucfirst(resource.title), this.setting.resources[resource.name]),
      );

    const listResources = new SettingsList(this._host);
    listResources.addChildren(this._resources);
    this.addChild(listResources);
  }

  /**
   * Creates a UI element that reflects stock values for a given resource.
   * This is currently only used for the time/reset section.
   *
   * @param title The title to apply to the option.
   * @param setting The option that is being controlled.
   * @returns A new option with stock value.
   */
  private _addNewResourceOption(title: string, setting: ResetResourcesSettingsItem) {
    // The overall container for this resource item.
    const container = new SettingListItem(this._host, title, setting, {
      onCheck: () => this._host.engine.imessage("status.sub.enable", [title]),
      onUnCheck: () => this._host.engine.imessage("status.sub.disable", [title]),
    });

    // How many items to stock.
    const stockElement = new StockButton(this._host, title, setting);
    container.addChild(stockElement);

    return container;
  }
}
