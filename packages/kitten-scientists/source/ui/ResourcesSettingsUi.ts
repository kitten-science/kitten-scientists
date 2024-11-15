import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { SupportedLocale } from "../Engine.js";
import { KittenScientists } from "../KittenScientists.js";
import { Icons } from "../images/Icons.js";
import { ResourcesSettings, ResourcesSettingsItem } from "../settings/ResourcesSettings.js";
import { SettingOptions } from "../settings/Settings.js";
import { ucfirst } from "../tools/Format.js";
import { Resource } from "../types/index.js";
import stylesButton from "./components/Button.module.css";
import { PanelOptions } from "./components/CollapsiblePanel.js";
import { Container } from "./components/Container.js";
import { LabelListItem } from "./components/LabelListItem.js";
import stylesLabelListItem from "./components/LabelListItem.module.css";
import { SettingListItem } from "./components/SettingListItem.js";
import stylesSettingListItem from "./components/SettingListItem.module.css";
import { SettingsList } from "./components/SettingsList.js";
import { SettingsPanel } from "./components/SettingsPanel.js";
import { ConsumeButton } from "./components/buttons/ConsumeButton.js";
import { StockButton } from "./components/buttons/StockButton.js";

export class ResourcesSettingsUi extends SettingsPanel<ResourcesSettings> {
  constructor(
    host: KittenScientists,
    settings: ResourcesSettings,
    language: SettingOptions<SupportedLocale>,
    options?: PanelOptions,
  ) {
    const label = host.engine.i18n("ui.resources");
    super(
      host,
      settings,
      new LabelListItem(host, label, {
        childrenHead: [new Container(host, { classes: [stylesLabelListItem.fillSpace] })],
        classes: [stylesSettingListItem.setting],
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
      new SettingsList(host, {
        children: host.game.resPool.resources
          .filter(
            item =>
              !ignoredResources.includes(item.name) && !isNil(this.setting.resources[item.name]),
          )
          .sort((a, b) => a.title.localeCompare(b.title, language.selected))
          .map(
            resource => [this.setting.resources[resource.name], ucfirst(resource.title)] as const,
          )
          .map(([setting, title]) => this._makeResourceSetting(host, setting, title)),
      }),
    );
  }

  /**
   * Creates a UI element that reflects stock and consume values for a given resource.
   * This is currently only used for the craft section.
   *
   * @param i18nName The title to apply to the option.
   * @param option The option that is being controlled.
   * @returns A new option with stock and consume values.
   */
  private _makeResourceSetting(
    host: KittenScientists,
    option: ResourcesSettingsItem,
    i18nName: string,
  ) {
    const element = new SettingListItem(host, i18nName, option, {
      childrenHead: [new Container(host, { classes: [stylesLabelListItem.fillSpace] })],
      onCheck: () => {
        host.engine.imessage("status.resource.enable", [i18nName]);
      },
      onUnCheck: () => {
        host.engine.imessage("status.resource.disable", [i18nName]);
      },
    });

    // How many items to stock.
    const stockElement = new StockButton(host, i18nName, option, {
      alignment: "right",
      border: false,
      classes: [stylesButton.headAction],
      onRefresh: () => {
        stockElement.inactive = !option.enabled || option.stock === 0;
      },
    });
    element.head.addChild(stockElement);

    // The consume rate for the resource.
    const consumeElement = new ConsumeButton(host, i18nName, option, {
      border: false,
      classes: [stylesButton.lastHeadAction],
      onRefresh: () => {
        consumeElement.inactive = !option.enabled || option.consume !== 100;
      },
    });
    element.head.addChild(consumeElement);

    return element;
  }
}
