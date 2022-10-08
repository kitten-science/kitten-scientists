import { SettingLimited } from "../../options/Settings";
import { mustExist } from "../../tools/Maybe";
import { UserScript } from "../../UserScript";

export class LimitedButton {
  readonly host: UserScript;
  readonly setting: SettingLimited;
  readonly element: JQuery<HTMLElement>;

  constructor(
    host: UserScript,
    id: string,
    setting: SettingLimited,
    handler: { onLimitedCheck: () => void; onLimitedUnCheck: () => void }
  ) {
    const element = $("<label/>", {
      for: `toggle-limited-${id}`,
      text: host.engine.i18n("ui.limit"),
    });

    const input = $("<input/>", {
      id: `toggle-limited-${id}`,
      type: "checkbox",
    });

    input.on("change", () => {
      if (input.is(":checked") && setting.limited === false) {
        setting.limited = true;
        host.updateOptions();
        handler.onLimitedCheck();
      } else if (!input.is(":checked") && setting.limited === true) {
        setting.limited = false;
        host.updateOptions();
        handler.onLimitedUnCheck();
      }
    });

    setting.$limited = this;

    this.element = element;
    this.host = host;
    this.setting = setting;
  }

  refreshUi() {
    mustExist(this.element).prop("checked", this.setting.limited);
  }
}
