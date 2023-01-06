import { Setting } from "../../settings/Settings";
import { Season } from "../../types";
import { UserScript } from "../../UserScript";
import { SettingListItem } from "./SettingListItem";
import { SettingsList } from "./SettingsList";

export type SettingWithSeasons = Record<Season, Setting>;

/**
 * A list of 4 settings correlating to the 4 seasons.
 */
export class SeasonsList extends SettingsList {
  readonly setting: SettingWithSeasons;

  readonly spring: SettingListItem;
  readonly summer: SettingListItem;
  readonly autumn: SettingListItem;
  readonly winter: SettingListItem;

  /**
   * Constructs a `SeasonsList`.
   *
   * @param host A reference to the host.
   * @param setting The settings that correlate to this list.
   * @param handler Callbacks to invoke when a season is checked/unchecked.
   * @param handler.onCheck Called when a season is checked.
   * @param handler.onUnCheck Called when a season is unchecked.
   */
  constructor(
    host: UserScript,
    setting: SettingWithSeasons,
    handler: {
      onCheck: (label: string, setting: Setting) => void;
      onUnCheck: (label: string, setting: Setting) => void;
    }
  ) {
    super(host);
    this.setting = setting;

    this.addEventListener("enableAll", () => {
      this.setting.autumn.enabled = true;
      this.setting.spring.enabled = true;
      this.setting.summer.enabled = true;
      this.setting.winter.enabled = true;
      this.refreshUi();
    });
    this.addEventListener("disableAll", () => {
      this.setting.autumn.enabled = false;
      this.setting.spring.enabled = false;
      this.setting.summer.enabled = false;
      this.setting.winter.enabled = false;
      this.refreshUi();
    });

    this.spring = this._makeSeason(
      this._host.engine.i18n(`$calendar.season.spring`),
      this.setting.spring,
      handler
    );
    this.summer = this._makeSeason(
      this._host.engine.i18n(`$calendar.season.summer`),
      this.setting.summer,
      handler
    );
    this.autumn = this._makeSeason(
      this._host.engine.i18n(`$calendar.season.autumn`),
      this.setting.autumn,
      handler
    );
    this.winter = this._makeSeason(
      this._host.engine.i18n(`$calendar.season.winter`),
      this.setting.winter,
      handler
    );

    this.addChildren([this.spring, this.summer, this.autumn, this.winter]);
  }

  private _makeSeason(
    label: string,
    setting: Setting,
    handler: {
      onCheck: (label: string, setting: Setting) => void;
      onUnCheck: (label: string, setting: Setting) => void;
    }
  ) {
    return new SettingListItem(this._host, label, setting, {
      onCheck: () => handler.onCheck(label, setting),
      onUnCheck: () => handler.onUnCheck(label, setting),
    });
  }
}
