import { ResourcesSettingsItem } from "packages/kitten-scientists/source/settings/ResourcesSettings.js";
import { Icons } from "../../../images/Icons.js";
import { KittenScientists } from "../../../KittenScientists.js";
import { Button } from "../Button.js";
import { UiComponent, UiComponentOptions } from "../UiComponent.js";

export class ConsumeButton extends Button {
  readonly setting: ResourcesSettingsItem;

  constructor(
    host: KittenScientists,
    label: string,
    setting: ResourcesSettingsItem,
    options?: Partial<UiComponentOptions>,
  ) {
    super(host, `${UiComponent.renderPercentage(setting.consume)}%`, Icons.DataUsage, options);

    this.element.on("click", () => {
      const value = UiComponent.promptPercentage(
        host.engine.i18n("resources.consume.set", [label]),
        setting.consume,
      );

      if (value !== null) {
        setting.consume = value;
        this.refreshUi();
      }

      this.click();
    });

    this.element.addClass("ks-consume-button");
    this.setting = setting;
  }

  refreshUi() {
    super.refreshUi();

    const label = `${UiComponent.renderPercentage(this.setting.consume)}%`;
    this.updateTitle(this._host.engine.i18n("resources.consume", [label]));
    this.updateLabel(label);
  }
}
