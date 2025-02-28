import type { KittenScientists } from "../../KittenScientists.js";
import type { Setting } from "../../settings/Settings.js";
import type { Season } from "../../types/index.js";
import { SettingListItem } from "./SettingListItem.js";
import { SettingsList, type SettingsListOptions } from "./SettingsList.js";
export type SettingWithSeasons = Record<Season, Setting>;
export type SeasonsListOptions = SettingsListOptions<SettingListItem> & {
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
export declare class SeasonsList extends SettingsList {
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
  );
  private _makeSeason;
}
//# sourceMappingURL=SeasonsList.d.ts.map
