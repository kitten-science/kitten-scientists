import { ResetResourcesSettingsItem } from "packages/kitten-scientists/source/settings/ResetResourcesSettings.js";
import { ResourcesSettingsItem } from "packages/kitten-scientists/source/settings/ResourcesSettings.js";
import { Icons } from "../../../images/Icons.js";
import { KittenScientists } from "../../../KittenScientists.js";
import { AbstractBuildSettingsPanel } from "../../SettingsSectionUi.js";
import { Button } from "../Button.js";
import { UiComponentOptions } from "../UiComponent.js";

export class StockButton extends Button {
  readonly setting: ResetResourcesSettingsItem | ResourcesSettingsItem;

  constructor(
    host: KittenScientists,
    label: string,
    setting: ResetResourcesSettingsItem | ResourcesSettingsItem,
    options?: Partial<UiComponentOptions>,
  ) {
    super(
      host,
      AbstractBuildSettingsPanel.renderLimit(setting.stock, host),
      Icons.Inventory2,
      options,
    );

    this.element.on("click", () => {
      const value = AbstractBuildSettingsPanel.promptLimit(
        host.engine.i18n("resources.stock.set", [label]),
        setting.stock.toFixed(),
      );

      if (value !== null) {
        setting.stock = value;
        this.refreshUi();
      }

      this.click();
    });

    this.element.addClass("ks-stock-button");
    this.setting = setting;
  }

  refreshUi() {
    super.refreshUi();

    const label = AbstractBuildSettingsPanel.renderLimit(this.setting.stock, this._host);
    this.updateTitle(this._host.engine.i18n("resources.stock", [label]));
    this.updateLabel(label);
  }
}
