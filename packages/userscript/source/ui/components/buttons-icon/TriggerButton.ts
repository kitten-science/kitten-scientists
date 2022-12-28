import { SettingTrigger } from "../../../settings/Settings";
import { UserScript } from "../../../UserScript";
import { SettingsSectionUi } from "../../SettingsSectionUi";
import { IconButton } from "../IconButton";

export type TriggerButtonBehavior = "integer" | "percentage";

export class TriggerButton extends IconButton {
  readonly behavior: TriggerButtonBehavior;
  readonly setting: SettingTrigger;

  constructor(
    host: UserScript,
    label: string,
    setting: SettingTrigger,
    behavior: TriggerButtonBehavior = "percentage",
    handler: { onClick?: () => void } = {}
  ) {
    super(
      host,
      "M19.95 42 22 27.9h-7.3q-.55 0-.8-.5t0-.95L26.15 6h2.05l-2.05 14.05h7.2q.55 0 .825.5.275.5.025.95L22 42Z",
      ""
    );

    this.behavior = behavior;

    this.element.on("click", () => {
      const value =
        this.behavior === "percentage"
          ? SettingsSectionUi.promptPercentage(
              host.engine.i18n("ui.trigger.setpercentage", [label]),
              SettingsSectionUi.renderPercentage(setting.trigger)
            )
          : SettingsSectionUi.promptLimit(
              host.engine.i18n("ui.trigger.setinteger", [label]),
              setting.trigger.toFixed()
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
    super.refreshUi();

    this.element[0].title = this._host.engine.i18n("ui.trigger", [
      this.behavior === "percentage"
        ? SettingsSectionUi.renderPercentage(this.setting.trigger)
        : SettingsSectionUi.renderLimit(this.setting.trigger, this._host),
    ]);
  }
}
