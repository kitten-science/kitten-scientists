import { SettingTrigger } from "../../settings/Settings";
import { UserScript } from "../../UserScript";
import { SettingsSectionUi } from "../SettingsSectionUi";
import { IconButton } from "./IconButton";

export class TriggerButton extends IconButton {
  readonly setting: SettingTrigger;

  constructor(
    host: UserScript,
    label: string,
    setting: SettingTrigger,
    handler: { onClick?: () => void } = {}
  ) {
    super(
      host,
      "M19.95 42 22 27.9h-7.3q-.55 0-.8-.5t0-.95L26.15 6h2.05l-2.05 14.05h7.2q.55 0 .825.5.275.5.025.95L22 42Z",
      ""
    );

    this.element.on("click", () => {
      const value = SettingsSectionUi.promptPercentage(
        host.engine.i18n("ui.trigger.set", [label]),
        SettingsSectionUi.renderPercentage(setting.trigger)
      );

      if (value !== null) {
        setting.trigger = value;
        this.refreshUi();
      }

      if (handler.onClick) {
        handler.onClick();
      }
    });

    this.setting = setting;
  }

  refreshUi() {
    this.element[0].title = this._host.engine.i18n("ui.trigger", [
      SettingsSectionUi.renderPercentage(this.setting.trigger),
    ]);
  }
}
