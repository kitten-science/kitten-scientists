import { ResourcesSettings, ResourcesSettingsItem } from "../options/ResourcesSettings";
import { objectEntries } from "../tools/Entries";
import { ucfirst } from "../tools/Format";
import { mustExist } from "../tools/Maybe";
import { UserScript } from "../UserScript";
import { SettingListItem } from "./components/SettingListItem";
import { SettingsPanel } from "./components/SettingsPanel";
import { SettingsSectionUi } from "./SettingsSectionUi";

export class ResourcesSettingsUi extends SettingsSectionUi {
  protected readonly _items: Array<SettingListItem>;
  private readonly _settings: ResourcesSettings;

  constructor(host: UserScript, settings: ResourcesSettings) {
    const label = ucfirst(host.engine.i18n("ui.resources"));
    const panel = new SettingsPanel(host, label, settings);
    super(host, panel);

    this._settings = settings;
    $("input", panel.element).prop("disabled", true);

    this.panel._list.addEventListener("enableAll", () => {
      this._items.forEach(item => (item.setting.enabled = true));
      this.refreshUi();
    });
    this.panel._list.addEventListener("disableAll", () => {
      this._items.forEach(item => (item.setting.enabled = false));
      this.refreshUi();
    });
    this.panel._list.addEventListener("reset", () => {
      this._settings.load(new ResourcesSettings());
      this.refreshUi();
    });

    // Add all the current resources
    this._items = [];
    for (const [name, item] of objectEntries(this._settings.items)) {
      this._items.push(
        this._makeResourceSetting(ucfirst(this._host.engine.i18n(`$resources.${name}.title`)), item)
      );
    }

    for (const setting of this._items) {
      panel.list.append(setting.element);
    }
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
    const stock = setting.stock;

    // The overall container for this resource item.
    const container = new SettingListItem(this._host, title, setting, {
      onCheck: () => this._host.engine.imessage("status.resource.enable", [title]),
      onUnCheck: () => this._host.engine.imessage("status.resource.disable", [title]),
    });

    // How many items to stock.
    const stockElement = $("<div/>", {
      text: this._host.engine.i18n("resources.stock", [this._renderLimit(stock)]),
    })
      .addClass("ks-text-button")
      .addClass("ks-label");

    // The consume rate for the resource.
    const consumeElement = $("<div/>", {
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
