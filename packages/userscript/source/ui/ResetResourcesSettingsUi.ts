import {
  ResetResourcesSettings,
  ResetResourcesSettingsItem,
} from "../options/ResetResourcesSettings";
import { ucfirst } from "../tools/Format";
import { UserScript } from "../UserScript";
import { SettingListItem } from "./components/SettingListItem";
import { SettingsPanel } from "./components/SettingsPanel";
import { SettingsSectionUi } from "./SettingsSectionUi";

export class ResetResourcesSettingsUi extends SettingsPanel<ResetResourcesSettings> {
  private readonly _buildings: Array<SettingListItem>;

  constructor(host: UserScript, settings: ResetResourcesSettings) {
    const label = host.engine.i18n("option.embassies");
    super(host, label, settings);

    this._list.addEventListener("enableAll", () => {
      this._buildings.forEach(item => (item.settings.enabled = true));
      this.refreshUi();
    });
    this._list.addEventListener("disableAll", () => {
      this._buildings.forEach(item => (item.settings.enabled = false));
      this.refreshUi();
    });
    this._list.addEventListener("reset", () => {
      this.settings.load(new ResetResourcesSettings());
      this.refreshUi();
    });

    // Add all the current resources
    this._buildings = [];
    for (const setting of Object.values(this.settings.items)) {
      this._buildings.push(
        this._addNewResourceOption(
          ucfirst(this._host.engine.i18n(`$resources.${setting.resource}.title`)),
          setting
        )
      );
    }
    this.addChildren(this._buildings);
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
    const stock = setting.stock;

    // The overall container for this resource item.
    const container = new SettingListItem(this._host, title, setting, {
      onCheck: () => this._host.engine.imessage("status.sub.enable", [title]),
      onUnCheck: () => this._host.engine.imessage("status.sub.disable", [title]),
    });

    // How many items to stock.
    const stockElement = $("<div/>", {
      text: this._host.engine.i18n("resources.stock", [this._renderLimit(stock)]),
    })
      .addClass("ks-text-button")
      .addClass("ks-label");

    container.element.append(stockElement);

    stockElement.on("click", () => {
      const value = SettingsSectionUi.promptLimit(
        this._host.engine.i18n("resources.stock.set", [title]),
        setting.stock.toFixed(0)
      );
      if (value !== null) {
        setting.enabled = true;
        setting.stock = value;
        stockElement.text(this._host.engine.i18n("resources.stock", [this._renderLimit(value)]));
        this._host.updateOptions();
      }
    });

    setting.$stock = stockElement;

    return container;
  }
}
