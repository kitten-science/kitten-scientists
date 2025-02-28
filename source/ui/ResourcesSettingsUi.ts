import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import type { SupportedLocale } from "../Engine.js";
import type { KittenScientists } from "../KittenScientists.js";
import { Icons } from "../images/Icons.js";
import type { ResourcesSettings, ResourcesSettingsItem } from "../settings/ResourcesSettings.js";
import type { SettingOptions } from "../settings/Settings.js";
import { ucfirst } from "../tools/Format.js";
import type { Resource } from "../types/index.js";
import stylesButton from "./components/Button.module.css";
import type { PanelOptions } from "./components/CollapsiblePanel.js";
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
    locale: SettingOptions<SupportedLocale>,
    options?: PanelOptions,
  ) {
    const label = host.engine.i18n("ui.resources");
    super(
      host,
      settings,
      new LabelListItem(host, label, {
        childrenHead: [new Container(host, { classes: [stylesLabelListItem.fillSpace] })],
        classes: [stylesSettingListItem.checked, stylesSettingListItem.setting],
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
          .sort((a, b) => a.title.localeCompare(b.title, locale.selected))
          .map(
            resource => [this.setting.resources[resource.name], ucfirst(resource.title)] as const,
          )
          .map(([setting, title]) => this._makeResourceSetting(host, setting, locale, title)),
      }),
    );
  }

  /**
   * Creates a UI element that reflects stock and consume values for a given resource.
   * This is currently only used for the craft section.
   *
   * @param label The title to apply to the option.
   * @param option The option that is being controlled.
   * @returns A new option with stock and consume values.
   */
  private _makeResourceSetting(
    host: KittenScientists,
    option: ResourcesSettingsItem,
    locale: SettingOptions<SupportedLocale>,
    label: string,
  ) {
    const element = new SettingListItem(host, option, label, {
      childrenHead: [new Container(host, { classes: [stylesLabelListItem.fillSpace] })],
      onCheck: () => {
        host.engine.imessage("status.resource.enable", [label]);
      },
      onUnCheck: () => {
        host.engine.imessage("status.resource.disable", [label]);
      },
    });

    // How many items to stock.
    const stockElement = new StockButton(host, option, locale, label, {
      alignment: "right",
      border: false,
      classes: [stylesButton.headAction],
      onRefresh: () => {
        stockElement.inactive = !option.enabled || option.stock === 0;
      },
    });
    element.head.addChild(stockElement);

    // The consume rate for the resource.
    const consumeElement = new ConsumeButton(host, option, locale, label, {
      border: false,
      classes: [stylesButton.lastHeadAction],
      onRefresh: () => {
        consumeElement.inactive = !option.enabled || option.consume !== 100;
        consumeElement.ineffective = option.enabled && option.consume === 0;
      },
    });
    element.head.addChild(consumeElement);

    return element;
  }
}
