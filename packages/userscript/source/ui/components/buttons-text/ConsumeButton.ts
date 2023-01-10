import { UserScript } from "../../../UserScript";
import { SettingsSectionUi } from "../../SettingsSectionUi";
import { TextButton } from "../TextButton";

export type SettingWithConsume = { consume: number };

export class ConsumeButton extends TextButton {
  readonly setting: SettingWithConsume;

  constructor(
    host: UserScript,
    label: string,
    setting: SettingWithConsume,
    handler: { onClick?: () => void } = {}
  ) {
    super(host, label, {
      onClick: () => {
        const value = SettingsSectionUi.promptPercentage(
          this._host.engine.i18n("resources.consume.set", [label]),
          SettingsSectionUi.renderPercentage(setting.consume)
        );

        if (value !== null) {
          setting.consume = value;
          this.refreshUi();
        }

        if (handler.onClick) {
          handler.onClick();
        }
      },
      title: setting.consume.toString(),
    });

    this.setting = setting;
  }

  refreshUi() {
    super.refreshUi();

    this.element.prop("title", this.setting.consume.toString());
    this.element.text(
      this._host.engine.i18n("resources.consume", [
        SettingsSectionUi.renderPercentage(this.setting.consume),
      ])
    );
  }
}
