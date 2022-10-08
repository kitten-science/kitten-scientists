import { ResourcesSettings, ResourcesSettingsItem } from "../options/ResourcesSettings";
import { objectEntries } from "../tools/Entries";
import { ucfirst } from "../tools/Format";
import { mustExist } from "../tools/Maybe";
import { Resource } from "../types";
import { UserScript } from "../UserScript";
import { SettingsListUi } from "./SettingsListUi";
import { SettingsPanelUi } from "./SettingsPanelUi";
import { SettingsSectionUi } from "./SettingsSectionUi";
import { SettingUi } from "./SettingUi";

export class ResourcesSettingsUi extends SettingsSectionUi {
  private readonly _settings: ResourcesSettings;

  constructor(host: UserScript, settings: ResourcesSettings) {
    const toggleName = "resources";
    const label = ucfirst(host.engine.i18n("ui.resources"));
    const list = SettingsListUi.getSettingsList(host.engine, toggleName);
    const panel = SettingsPanelUi.make(host, toggleName, label, settings, list);
    super(host, panel, list);

    this._settings = settings;
    $("input", panel.element).prop("disabled", true);

    const allresources = SettingsSectionUi.getList("available-resources-list");

    list.append(allresources);

    // Add all the current resources
    for (const [name, item] of objectEntries(this._settings.items)) {
      list.append(
        this._makeResourceSetting(
          name,
          ucfirst(this._host.engine.i18n(`$resources.${name}.title`)),
          item
        )
      );
    }

    panel.element.append(list);
  }

  /**
   * Creates a UI element that reflects stock and consume values for a given resource.
   * This is currently only used for the craft section.
   *
   * @param name The resource.
   * @param title The title to apply to the option.
   * @param setting The option that is being controlled.
   * @returns A new option with stock and consume values.
   */
  private _makeResourceSetting(
    name: Resource,
    title: string,
    setting: ResourcesSettingsItem
  ): JQuery<HTMLElement> {
    const stock = setting.stock;

    // The overall container for this resource item.
    const container = SettingUi.make(this._host, `resource-${name}`, setting, title, {
      onCheck: () => this._host.engine.imessage("status.resource.enable", [title]),
      onUnCheck: () => this._host.engine.imessage("status.resource.disable", [title]),
    });

    // How many items to stock.
    const stockElement = $("<div/>", {
      id: `stock-value-${name}`,
      text: this._host.engine.i18n("resources.stock", [this._renderLimit(stock)]),
    })
      .addClass("ks-text-button")
      .addClass("ks-label");

    // The consume rate for the resource.
    const consumeElement = $("<div/>", {
      id: `consume-rate-${name}`,
      text: this._host.engine.i18n("resources.consume", [
        SettingsSectionUi.renderConsumeRate(setting.consume),
      ]),
    }).addClass("ks-text-button");

    container.element.append(stockElement, consumeElement);

    stockElement.on("click", () => {
      const value = SettingsSectionUi.promptLimit(
        this._host.engine.i18n("resources.stock.set", [title]),
        setting.stock.toFixed(0)
      );
      if (value !== null) {
        setting.stock = value;
        this._host.updateOptions();
        this.refreshUi();
      }
    });

    consumeElement.on("click", () => {
      const consumeValue = SettingsSectionUi.promptPercentage(
        this._host.engine.i18n("resources.consume.set", [title]),
        SettingsSectionUi.renderConsumeRate(setting.consume)
      );
      if (consumeValue !== null) {
        setting.consume = consumeValue;
        this._host.updateOptions();
        this.refreshUi();
      }
    });

    setting.$consume = consumeElement;
    setting.$stock = stockElement;

    return container.element;
  }

  setState(state: ResourcesSettings): void {
    this._settings.enabled = state.enabled;

    for (const [name, option] of objectEntries(this._settings.items)) {
      option.enabled = state.items[name].enabled;
      option.consume = state.items[name].consume;
      option.stock = state.items[name].stock;
    }
  }

  refreshUi(): void {
    this.setState(this._settings);

    mustExist(this._settings.$enabled).refreshUi();

    for (const [, option] of objectEntries(this._settings.items)) {
      mustExist(option.$enabled).refreshUi();
      mustExist(option.$consume).text(
        this._host.engine.i18n("resources.consume", [
          SettingsSectionUi.renderConsumeRate(option.consume),
        ])
      );
      mustExist(option.$stock).text(
        this._host.engine.i18n("resources.stock", [this._renderLimit(option.stock)])
      );
    }
  }
}
