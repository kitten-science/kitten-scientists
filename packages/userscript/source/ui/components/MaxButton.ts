import { SettingMax } from "../../options/Settings";
import { UserScript } from "../../UserScript";
import { SettingsSectionUi } from "../SettingsSectionUi";
import { UiComponent } from "./UiComponent";

export class MaxButton extends UiComponent {
  readonly setting: SettingMax;
  readonly element: JQuery<HTMLElement>;

  constructor(
    host: UserScript,
    label: string,
    setting: SettingMax,
    handler: { onClick?: () => void } = {}
  ) {
    super(host);

    const element = $("<div/>").addClass("ks-text-button").addClass("ks-max-button");

    element.on("click", () => {
      const value = SettingsSectionUi.promptLimit(
        host.engine.i18n("ui.max.set", [label]),
        setting.max.toString()
      );

      if (value !== null) {
        const limit = SettingsSectionUi.renderLimit(value, host);
        host.updateOptions(() => (setting.max = value));
        element[0].title = limit;
        element[0].innerText = host.engine.i18n("ui.max", [limit]);
      }

      if (handler.onClick) {
        handler.onClick();
      }
    });

    setting.$max = this;

    this.element = element;
    this.setting = setting;
  }

  refreshUi() {
    this.element[0].title = this.setting.max.toFixed();
    this.element.text(
      this.host.engine.i18n("ui.max", [SettingsSectionUi.renderLimit(this.setting.max, this.host)])
    );
  }
}
