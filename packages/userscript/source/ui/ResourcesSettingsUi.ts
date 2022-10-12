import { ResourcesSettings, ResourcesSettingsItem } from "../options/ResourcesSettings";
import { ucfirst } from "../tools/Format";
import { UserScript } from "../UserScript";
import { SettingListItem } from "./components/SettingListItem";
import { SettingsSectionUi } from "./SettingsSectionUi";

export class ResourcesSettingsUi extends SettingsSectionUi<ResourcesSettings> {
  private readonly _buildings: Array<SettingListItem>;

  constructor(host: UserScript, settings: ResourcesSettings) {
    const label = host.engine.i18n("ui.resources");
    super(host, label, settings);

    // Disable checkbox. Resource control is always active.
    $("input", this.element).prop("disabled", true);

    this._list.addEventListener("enableAll", () => {
      this._buildings.forEach(item => (item.settings.enabled = true));
      this.refreshUi();
    });
    this._list.addEventListener("disableAll", () => {
      this._buildings.forEach(item => (item.settings.enabled = false));
      this.refreshUi();
    });
    this._list.addEventListener("reset", () => {
      this.settings.load(new ResourcesSettings());
      this.refreshUi();
    });

    // Add all the current resources
    this._buildings = [];
    for (const setting of Object.values(this.settings.items)) {
      this._buildings.push(
        this._makeResourceSetting(
          ucfirst(this._host.engine.i18n(`$resources.${setting.resource}.title`)),
          setting
        )
      );
    }
    this.addChildren(this._buildings);
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
        this._host.updateSettings();
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
        this._host.updateSettings();
        this.refreshUi();
      }
    });

    return container;
  }
}
