import { KittenScientists } from "../../KittenScientists.js";
import { Setting } from "../../settings/Settings.js";
import { Season } from "../../types/index.js";
import { SettingListItem } from "./SettingListItem.js";
import { SettingsList, SettingsListOptions } from "./SettingsList.js";

export type SettingWithSeasons = Record<Season, Setting>;

export type SeasonsListOptions = SettingsListOptions & {
  /**
   * Called when a season is checked.
   *
   * @param label The label on the season element.
   * @param setting The setting associated with the season.
   */
  readonly onCheck: (label: string, setting: Setting) => void;

  /**
   * Called when a season is unchecked.
   *
   * @param label The label on the season element.
   * @param setting The setting associated with the season.
   */
  readonly onUnCheck: (label: string, setting: Setting) => void;
};

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
   * @param options Options for this list
   */
  constructor(
    host: KittenScientists,
    setting: SettingWithSeasons,
    options?: Partial<SeasonsListOptions>,
  ) {
    super(host, options);
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
      options,
    );
    this.summer = this._makeSeason(
      this._host.engine.i18n(`$calendar.season.summer`),
      this.setting.summer,
      options,
    );
    this.autumn = this._makeSeason(
      this._host.engine.i18n(`$calendar.season.autumn`),
      this.setting.autumn,
      options,
    );
    this.winter = this._makeSeason(
      this._host.engine.i18n(`$calendar.season.winter`),
      this.setting.winter,
      options,
    );

    this.addChildren([this.spring, this.summer, this.autumn, this.winter]);
  }

  private _makeSeason(
    label: string,
    setting: Setting,
    handler?: Partial<{
      onCheck: (label: string, setting: Setting) => void;
      onUnCheck: (label: string, setting: Setting) => void;
    }>,
  ) {
    return new SettingListItem(this._host, setting, label, {
      onCheck: () => handler?.onCheck?.(label, setting),
      onUnCheck: () => handler?.onUnCheck?.(label, setting),
    });
  }
}
