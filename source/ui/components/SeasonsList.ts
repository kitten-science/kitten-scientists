import type { Setting } from "../../settings/Settings.js";
import type { Season } from "../../types/index.js";
import { SettingListItem } from "./SettingListItem.js";
import { SettingsList, type SettingsListOptions } from "./SettingsList.js";
import type { UiComponent } from "./UiComponent.js";

export type SettingWithSeasons = Record<Season, Setting>;

export type SeasonsListOptions = ThisType<SeasonsList> &
  SettingsListOptions & {
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
  declare readonly options: SeasonsListOptions;
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
  constructor(parent: UiComponent, setting: SettingWithSeasons, options?: SeasonsListOptions) {
    super(parent, options);
    this.setting = setting;

    this.element[0].addEventListener("enableAll", () => {
      this.autumn.check(true);
      this.spring.check(true);
      this.summer.check(true);
      this.winter.check(true);
    });
    this.element[0].addEventListener("disableAll", () => {
      this.autumn.uncheck(true);
      this.spring.uncheck(true);
      this.summer.uncheck(true);
      this.winter.uncheck(true);
    });

    const makeSeason = (label: string, setting: Setting) => {
      return new SettingListItem(parent, setting, label, {
        onCheck: (isBatchProcess?: boolean) => {
          options?.onCheckSeason?.(label, setting, isBatchProcess);
          this.requestRefresh();
        },
        onUnCheck: (isBatchProcess?: boolean) => {
          options?.onUnCheckSeason?.(label, setting, isBatchProcess);
          this.requestRefresh();
        },
      });
    };

    this.spring = makeSeason(this.host.engine.i18n("$calendar.season.spring"), this.setting.spring);
    this.summer = makeSeason(this.host.engine.i18n("$calendar.season.summer"), this.setting.summer);
    this.autumn = makeSeason(this.host.engine.i18n("$calendar.season.autumn"), this.setting.autumn);
    this.winter = makeSeason(this.host.engine.i18n("$calendar.season.winter"), this.setting.winter);

    this.addChildren([this.spring, this.summer, this.autumn, this.winter]);
  }

  toString(): string {
    return `[${SeasonsList.name}#${this.componentId}]`;
  }
}
