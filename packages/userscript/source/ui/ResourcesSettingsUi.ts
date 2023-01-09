import { Icons } from "../images/Icons";
import { ResourcesSettings, ResourcesSettingsItem } from "../settings/ResourcesSettings";
import { ucfirst } from "../tools/Format";
import { UserScript } from "../UserScript";
import { ConsumeButton } from "./components/buttons-text/ConsumeButton";
import { StockButton } from "./components/buttons-text/StockButton";
import { LabelListItem } from "./components/LabelListItem";
import { SettingListItem } from "./components/SettingListItem";
import { SettingsList } from "./components/SettingsList";
import { SettingsPanel, SettingsPanelOptions } from "./components/SettingsPanel";

export class ResourcesSettingsUi extends SettingsPanel<ResourcesSettings> {
  private readonly _resources: Array<SettingListItem>;

  constructor(
    host: UserScript,
    settings: ResourcesSettings,
    options?: SettingsPanelOptions<SettingsPanel<ResourcesSettings>>
  ) {
    const label = host.engine.i18n("ui.resources");
    super(host, label, settings, {
      ...options,
      settingItem: new LabelListItem(host, label, {
        icon: Icons.Resources,
      }),
    });

    // Disable checkbox. Resource control is always active.
    //this.readOnly = true;

    // Add all the current resources
    this._resources = [];
    for (const setting of Object.values(this.setting.resources)) {
      this._resources.push(
        this._makeResourceSetting(
          ucfirst(this._host.engine.i18n(`$resources.${setting.resource}.title`)),
          setting
        )
      );
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
