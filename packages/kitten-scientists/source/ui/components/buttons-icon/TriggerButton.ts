import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { Icons } from "../../../images/Icons.js";
import { KittenScientists } from "../../../KittenScientists.js";
import { SettingThreshold, SettingTrigger } from "../../../settings/Settings.js";
import { IconButton } from "../IconButton.js";
import { UiComponent, UiComponentOptions } from "../UiComponent.js";

export type TriggerButtonBehavior = "integer" | "percentage";

export type TriggerButtonOptions = UiComponentOptions & {
  readonly onRefreshTitle: (subject: TriggerButton) => void;
};

export class TriggerButton extends IconButton {
  readonly behavior: TriggerButtonBehavior;
  readonly setting: SettingTrigger | SettingThreshold;
  protected readonly _onRefreshTitle?: (subject: TriggerButton) => void;

  constructor(
    host: KittenScientists,
    label: string,
    setting: SettingTrigger | SettingThreshold,
    options?: Partial<TriggerButtonOptions>,
  ) {
    super(host, Icons.Trigger, "", { ...options, onClick: undefined });

    this._onRefreshTitle = options?.onRefreshTitle;

    this.behavior = setting instanceof SettingTrigger ? "percentage" : "integer";

    this.element.on("click", () => {
      if (!isNil(options?.onClick)) {
        options.onClick(this);
        return;
      }

      const value =
        this.setting instanceof SettingTrigger
          ? UiComponent.promptPercentage(
              host.engine.i18n("ui.trigger.setpercentage", [label]),
              setting.trigger,
            )
          : UiComponent.promptLimit(
              host.engine.i18n("ui.trigger.setinteger", [label]),
              setting.trigger.toFixed(),
            );

      if (value !== null) {
        setting.trigger = value;
        this.refreshUi();
      }
    });
    this.setting = setting;
  }

  refreshUi() {
    super.refreshUi();

    if (this._onRefreshTitle) {
      this._onRefreshTitle(this);
      return;
    }

    this.element[0].title = this._host.engine.i18n("ui.trigger", [
      this.behavior === "percentage"
        ? this.setting.trigger < 0
          ? this._host.engine.i18n("ui.infinity")
          : `${UiComponent.renderPercentage(this.setting.trigger)}%`
        : UiComponent.renderLimit(this.setting.trigger, this._host),
    ]);
  }
}
