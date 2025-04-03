import type { KittenScientists } from "../../KittenScientists.js";
import type { Setting } from "../../settings/Settings.js";
import type { Season } from "../../types/index.js";
import { SettingListItem } from "./SettingListItem.js";
import { SettingsList, type SettingsListOptions } from "./SettingsList.js";

export type SettingWithSeasons = Record<Season, Setting>;

export type SeasonsListOptions = SettingsListOptions & {
  /**
   * Called when a season is checked.
   *
   * @param label The label on the season element.
   * @param setting The setting associated with the season.
   */
  readonly onCheckSeason?: (label: string, setting: Setting, isBatchProcess?: boolean) => void;

  /**
   * Called when a season is unchecked.
   *
   * @param label The label on the season element.
   * @param setting The setting associated with the season.
   */
  readonly onUnCheckSeason?: (label: string, setting: Setting, isBatchProcess?: boolean) => void;
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
  constructor(host: KittenScientists, setting: SettingWithSeasons, options?: SeasonsListOptions) {
    super(host, options);
    this.setting = setting;

    this.addEventListener("enableAll", () => {
      this.autumn.check(true);
      this.spring.check(true);
      this.summer.check(true);
      this.winter.check(true);
      this.refreshUi();
    });
    this.addEventListener("disableAll", () => {
      this.autumn.uncheck(true);
      this.spring.uncheck(true);
      this.summer.uncheck(true);
      this.winter.uncheck(true);
      this.refreshUi();
    });

    const makeSeason = (label: string, setting: Setting) => {
      return new SettingListItem(host, setting, label, {
        onCheck: (isBatchProcess?: boolean) =>
          options?.onCheckSeason?.(label, setting, isBatchProcess),
        onUnCheck: (isBatchProcess?: boolean) =>
          options?.onUnCheckSeason?.(label, setting, isBatchProcess),
      });
    };

    this.spring = makeSeason(
      this._host.engine.i18n("$calendar.season.spring"),
      this.setting.spring,
    );
    this.summer = makeSeason(
      this._host.engine.i18n("$calendar.season.summer"),
      this.setting.summer,
    );
    this.autumn = makeSeason(
      this._host.engine.i18n("$calendar.season.autumn"),
      this.setting.autumn,
    );
    this.winter = makeSeason(
      this._host.engine.i18n("$calendar.season.winter"),
      this.setting.winter,
    );

    this.addChildren([this.spring, this.summer, this.autumn, this.winter]);
  }
}
