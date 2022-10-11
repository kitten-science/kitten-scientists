import { ucfirst } from "../../tools/Format";
import { Season } from "../../types";
import { UserScript } from "../../UserScript";
import { SettingsList } from "./SettingsList";

export type SettingWithSeasons = {
  summer: boolean;
  autumn: boolean;
  winter: boolean;
  spring: boolean;
};

/**
 * A list of 4 settings correlating to the 4 seasons.
 */
export class SeasonsList extends SettingsList {
  readonly setting: SettingWithSeasons;

  readonly _spring: JQuery<HTMLElement>;
  readonly _summer: JQuery<HTMLElement>;
  readonly _autumn: JQuery<HTMLElement>;
  readonly _winter: JQuery<HTMLElement>;

  /**
   * Constructs a `SeasonsList`.
   *
   * @param host A reference to the host.
   * @param setting The settings that correlate to this list.
   */
  constructor(host: UserScript, setting: SettingWithSeasons) {
    super(host);
    this.setting = setting;

    this._spring = this._getSeason("spring", this.setting);
    this._summer = this._getSeason("summer", this.setting);
    this._autumn = this._getSeason("autumn", this.setting);
    this._winter = this._getSeason("winter", this.setting);
    this.element.append(this._spring, this._summer, this._autumn, this._winter);
  }

  private _getSeason(season: Season, option: SettingWithSeasons): JQuery<HTMLElement> {
    const iseason = ucfirst(this._host.engine.i18n(`$calendar.season.${season}` as const));

    const element = $("<li/>");

    const label = $("<label/>").text(ucfirst(iseason));

    const input = $("<input/>", {
      type: "checkbox",
    });
    label.prepend(input);

    input.on("change", () => {
      if (input.is(":checked") && option[season] === false) {
        this._host.updateOptions(() => (option[season] = true));
        //this._host.engine.imessage("trade.season.enable", [iname, iseason]);
      } else if (!input.is(":checked") && option[season] === true) {
        this._host.updateOptions(() => (option[season] = false));
        //this._host.engine.imessage("trade.season.disable", [iname, iseason]);
      }
    });

    element.append(label);

    return element;
  }

  refreshUi() {
    /* intentionally left blank */
  }
}
