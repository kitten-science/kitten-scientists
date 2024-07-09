import { Icons } from "../../../images/Icons.js";
import { KittenScientists } from "../../../KittenScientists.js";
import { SettingTrigger } from "../../../settings/Settings.js";
import { SettingsSectionUi } from "../../SettingsSectionUi.js";
import { IconButton } from "../IconButton.js";

export type TriggerButtonBehavior = "integer" | "percentage";

export class TriggerButton extends IconButton {
  readonly behavior: TriggerButtonBehavior;
  readonly setting: SettingTrigger;

  constructor(
    host: KittenScientists,
    label: string,
    setting: SettingTrigger,
    behavior: TriggerButtonBehavior = "percentage",
    handler: { onClick?: () => void } = {},
  ) {
    super(host, Icons.Trigger, "");

    this.behavior = behavior;

    this.element.on("click", () => {
      const value =
        this.behavior === "percentage"
          ? SettingsSectionUi.promptPercentage(
              host.engine.i18n("ui.trigger.setpercentage", [label]),
              SettingsSectionUi.renderPercentage(setting.trigger),
            )
          : SettingsSectionUi.promptLimit(
              host.engine.i18n("ui.trigger.setinteger", [label]),
              setting.trigger.toFixed(),
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
