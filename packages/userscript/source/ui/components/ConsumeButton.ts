import { UserScript } from "../../UserScript";
import { SettingsSectionUi } from "../SettingsSectionUi";
import { UiComponent } from "./UiComponent";

export type SettingWithConsume = { consume: number };

export class ConsumeButton extends UiComponent {
  readonly setting: SettingWithConsume;
  readonly element: JQuery<HTMLElement>;

  constructor(
    host: UserScript,
    label: string,
    setting: SettingWithConsume,
    handler: { onClick?: () => void } = {}
  ) {
    super(host);

    const element = $("<div/>").addClass("ks-label").addClass("ks-text-button");

    element.on("click", () => {
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
    });

    this.element = element;
    this.setting = setting;
  }

  refreshUi() {
    super.refreshUi();

    this.element[0].title = this.setting.consume.toString();
    this.element.text(
      this._host.engine.i18n("resources.consume", [
        SettingsSectionUi.renderPercentage(this.setting.consume),
      ])
    );
  }
}
