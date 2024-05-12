import { isNil } from "@oliversalzburg/js-utils/nil.js";
import { UserScript } from "../UserScript.js";
import { Icons } from "../images/Icons.js";
import { ResourcesSettings, ResourcesSettingsItem } from "../settings/ResourcesSettings.js";
import { ucfirst } from "../tools/Format.js";
import { Resource } from "../types/index.js";
import { LabelListItem } from "./components/LabelListItem.js";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel, SettingsPanelOptions } from "./components/SettingsPanel.js";
import { ConsumeButton } from "./components/buttons-text/ConsumeButton.js";
import { StockButton } from "./components/buttons-text/StockButton.js";

export class ResourcesSettingsUi extends SettingsPanel<ResourcesSettings> {
  private readonly _resources: Array<SettingListItem>;

  constructor(
    host: UserScript,
    settings: ResourcesSettings,
    options?: SettingsPanelOptions<SettingsPanel<ResourcesSettings>>,
  ) {
    const label = host.engine.i18n("ui.resources");
    super(host, label, settings, {
      ...options,
      settingItem: new LabelListItem(host, label, {
        icon: Icons.Resources,
      }),
    });

    const ignoredResources: Array<Resource> = [
      "blackcoin",
      "burnedParagon",
      "elderBox",
      "gflops",
      "hashrates",
      "kittens",
      "paragon",
      "temporalFlux",
      "wrappingPaper",
      "zebras",
    ];

    // Add all the current resources
    const preparedResources: Array<[ResourcesSettingsItem, string]> =
      this._host.game.resPool.resources
        .filter(
          item =>
            !ignoredResources.includes(item.name) && !isNil(this.setting.resources[item.name]),
        )
        .map(resource => [this.setting.resources[resource.name], ucfirst(resource.title)]);

    this._resources = [];
    for (const [setting, title] of preparedResources.sort((a, b) => a[1].localeCompare(b[1]))) {
      this._resources.push(this._makeResourceSetting(title, setting));
    }
    const listResource = new SettingsList(this._host);
    listResource.addChildren(this._resources);
    this.addChild(listResource);
  }

  /**
   * Creates a UI element that reflects stock and consume values for a given resource.
   * This is currently only used for the craft section.
   *
   * @param title The title to apply to the option.
   * @param setting The option that is being controlled.
   * @returns A new option with stock and consume values.
   */
  private _makeResourceSetting(title: string, setting: ResourcesSettingsItem) {
    // The overall container for this resource item.
    const container = new SettingListItem(this._host, title, setting, {
      onCheck: () => this._host.engine.imessage("status.resource.enable", [title]),
      onUnCheck: () => this._host.engine.imessage("status.resource.disable", [title]),
    });

    // How many items to stock.
    const stockElement = new StockButton(this._host, title, setting);
    stockElement.element.addClass("ks-stock-button");
    container.addChild(stockElement);

    // The consume rate for the resource.
    const consumeElement = new ConsumeButton(this._host, title, setting);
    container.addChild(consumeElement);

    return container;
  }
}
