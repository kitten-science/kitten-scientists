import { SettingTrigger } from "../../settings/Settings";
import { UserScript } from "../../UserScript";
import { SettingsSectionUi } from "../SettingsSectionUi";
import { UiComponent } from "./UiComponent";

export class TriggerLimitButton extends UiComponent {
  readonly setting: SettingTrigger;
  readonly element: JQuery<HTMLElement>;

  constructor(
    host: UserScript,
    label: string,
    setting: SettingTrigger,
    handler: { onClick?: () => void } = {}
  ) {
    super(host);

    const element = $("<div/>").addClass("ks-text-button").addClass("ks-max-button");

    element.on("click", () => {
      const value = SettingsSectionUi.promptLimit(
        host.engine.i18n("ui.trigger.set", [label]),
        setting.trigger.toString()
      );

      if (value !== null) {
        setting.trigger = value;
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

    this.element[0].title = this.setting.trigger.toFixed();
    this.element.text(
      this._host.engine.i18n("ui.trigger", [
        SettingsSectionUi.renderLimit(this.setting.trigger, this._host),
      ])
    );
  }
}
