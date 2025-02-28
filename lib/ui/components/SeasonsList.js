import { SettingListItem } from "./SettingListItem.js";
import { SettingsList } from "./SettingsList.js";
/**
 * A list of 4 settings correlating to the 4 seasons.
 */
export class SeasonsList extends SettingsList {
  setting;
  spring;
  summer;
  autumn;
  winter;
  /**
   * Constructs a `SeasonsList`.
   *
   * @param host A reference to the host.
   * @param setting The settings that correlate to this list.
   * @param options Options for this list
   */
  constructor(host, setting, options) {
    super(host, options);
    this.setting = setting;
    this.addEventListener("enableAll", () => {
      this.autumn.check();
      this.spring.check();
      this.summer.check();
      this.winter.check();
      this.refreshUi();
    });
    this.addEventListener("disableAll", () => {
      this.autumn.uncheck();
      this.spring.uncheck();
      this.summer.uncheck();
      this.winter.uncheck();
      this.refreshUi();
    });
    this.spring = this._makeSeason(
      this._host.engine.i18n("$calendar.season.spring"),
      this.setting.spring,
      options,
    );
    this.summer = this._makeSeason(
      this._host.engine.i18n("$calendar.season.summer"),
      this.setting.summer,
      options,
    );
    this.autumn = this._makeSeason(
      this._host.engine.i18n("$calendar.season.autumn"),
      this.setting.autumn,
      options,
    );
    this.winter = this._makeSeason(
      this._host.engine.i18n("$calendar.season.winter"),
      this.setting.winter,
      options,
    );
    this.addChildren([this.spring, this.summer, this.autumn, this.winter]);
  }
  _makeSeason(label, setting, handler) {
    return new SettingListItem(this._host, setting, label, {
      onCheck: () => handler?.onCheck?.(label, setting),
      onUnCheck: () => handler?.onUnCheck?.(label, setting),
    });
  }
}
//# sourceMappingURL=SeasonsList.js.map
