import { SettingMax } from "../../settings/Settings";
import { UserScript } from "../../UserScript";
import { SettingsSectionUi } from "../SettingsSectionUi";
import { UiComponent } from "./UiComponent";

export class MaxButton extends UiComponent {
  readonly setting: SettingMax;
  readonly element: JQuery<HTMLElement>;

  readOnly: boolean;

  constructor(
    host: UserScript,
    label: string,
    setting: SettingMax,
    handler: { onClick?: () => void } = {},
    readOnly = false
  ) {
    super(host);

    const element = $("<div/>").addClass("ks-text-button").addClass("ks-max-button");

    this.readOnly = readOnly;

    element.on("click", () => {
      if (this.readOnly) {
        return;
      }

      const value = SettingsSectionUi.promptLimit(
        host.engine.i18n("ui.max.set", [label]),
        setting.max.toString()
      );

      if (value !== null) {
        setting.max = value;
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

    this.element[0].title = this.setting.max.toFixed();
    this.element.text(
      this._host.engine.i18n("ui.max", [
        SettingsSectionUi.renderLimit(this.setting.max, this._host),
      ])
    );
  }
}
