import { ResourcesSettings, ResourcesSettingsItem } from "../options/ResourcesSettings";
import { objectEntries } from "../tools/Entries";
import { ucfirst } from "../tools/Format";
import { mustExist } from "../tools/Maybe";
import { Resource } from "../types";
import { UserScript } from "../UserScript";
import { SettingsSectionUi } from "./SettingsSectionUi";
import { SettingUi } from "./SettingUi";

export class ResourcesSettingsUi extends SettingsSectionUi {
  readonly element: JQuery<HTMLElement>;

  private readonly _settings: ResourcesSettings;

  constructor(host: UserScript, settings: ResourcesSettings) {
    super(host);

    this._settings = settings;

    const toggleName = "resources";
    const label = ucfirst(this._host.engine.i18n("ui.resources"));

    // Create build items.
    // We create these in a list that is displayed when the user clicks the "items" button.
    const list = this._getItemsList(toggleName);

    // Our main element is a list item.
    const element = this._getSettingsPanel(toggleName, label, this._settings, list);
    $("input", element).prop("disabled", true);

    const allresources = SettingsSectionUi.getList("available-resources-list");

    list.append(allresources);

    // Add all the current resources
    for (const [name, item] of objectEntries(this._settings.items)) {
      list.append(
        this._addNewResourceOption(
          name,
          ucfirst(this._host.engine.i18n(`$resources.${name}.title`)),
          item
        )
      );
      //this.setStockValue(name, item.stock);
      //this.setConsumeRate(name, item.consume);
    }

    element.append(list);

    this.element = element;
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
  private _addNewResourceOption(
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

    container.append(stockElement, consumeElement);

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

    return container;
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

    mustExist(this._settings.$enabled).prop("checked", true);

    for (const [, option] of objectEntries(this._settings.items)) {
      mustExist(option.$enabled).prop("checked", option.enabled);
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
