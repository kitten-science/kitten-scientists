import { KittenScientists } from "../../../KittenScientists.js";
import { SettingMax } from "../../../settings/Settings.js";
import { TextButton } from "../TextButton.js";
import { UiComponent } from "../UiComponent.js";

export class MaxButton extends TextButton {
  readonly setting: SettingMax;

  constructor(
    host: KittenScientists,
    label: string,
    setting: SettingMax,
    handler: { onClick?: () => void } = {},
  ) {
    super(host, label, {
      onClick: () => {
        const value = UiComponent.promptLimit(
          host.engine.i18n("ui.max.set", [label]),
          setting.max.toString(),
        );

        if (value !== null) {
          setting.max = value;
          this.refreshUi();
        }

        if (handler.onClick) {
          handler.onClick();
        }
      },
      title: setting.max.toFixed(),
    });

    this.element.addClass("ks-max-button");

    this.setting = setting;
  }

  refreshUi() {
    super.refreshUi();

    this.element.prop("title", this.setting.max.toFixed());
    this.element.text(
      this._host.engine.i18n("ui.max", [UiComponent.renderLimit(this.setting.max, this._host)]),
    );
  }
}
