import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { SupportedLanguage } from "../Engine.js";
import { KittenScientists } from "../KittenScientists.js";
import { Icons } from "../images/Icons.js";
import { ResourcesSettings, ResourcesSettingsItem } from "../settings/ResourcesSettings.js";
import { SettingOptions } from "../settings/Settings.js";
import { ucfirst } from "../tools/Format.js";
import { Resource } from "../types/index.js";
import { PanelOptions } from "./components/CollapsiblePanel.js";
import { LabelListItem } from "./components/LabelListItem.js";
import { SettingListItem } from "./components/SettingListItem.js";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
import { ConsumeButton } from "./components/buttons-icon/ConsumeButton.js";
import { StockButton } from "./components/buttons-icon/StockButton.js";

export class ResourcesSettingsUi extends SettingsPanel<ResourcesSettings> {
  constructor(
    host: KittenScientists,
    settings: ResourcesSettings,
    language: SettingOptions<SupportedLanguage>,
    options?: PanelOptions,
  ) {
    const label = host.engine.i18n("ui.resources");
    super(
      host,
      settings,
      new LabelListItem(host, label, {
        icon: Icons.Resources,
      }),
      options,
    );

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

    this.addChild(
      new SettingsList(this._host, {
        children: this._host.game.resPool.resources
          .filter(
            item =>
              !ignoredResources.includes(item.name) && !isNil(this.setting.resources[item.name]),
          )
          .sort((a, b) => (language.selected !== "zh" ? a.title.localeCompare(b.title) : 0))
          .map(
            resource => [this.setting.resources[resource.name], ucfirst(resource.title)] as const,
          )
          .map(([setting, title]) => this._makeResourceSetting(title, setting)),
      }),
    );
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
      onCheck: () => {
        this._host.engine.imessage("status.resource.enable", [title]);
      },
      onUnCheck: () => {
        this._host.engine.imessage("status.resource.disable", [title]);
      },
    });

    // How many items to stock.
    const stockElement = new StockButton(this._host, title, setting);
    container.head.addChild(stockElement);

    // The consume rate for the resource.
    const consumeElement = new ConsumeButton(this._host, title, setting);
    container.head.addChild(consumeElement);

    return container;
  }
}
