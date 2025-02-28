import type { KittenScientists } from "../../KittenScientists.js";
import type { Setting } from "../../settings/Settings.js";
import type { Cycle } from "../../types/index.js";
import { SettingListItem } from "./SettingListItem.js";
import { SettingsList, type SettingsListOptions } from "./SettingsList.js";
export type SettingWithCycles = Record<Cycle, Setting>;
export type SeasonsListOptions = SettingsListOptions<SettingListItem> & {
  /**
   * Called when a cycle is checked.
   *
   * @param label The label on the cycle element.
   * @param setting The setting associated with the cycle.
   */
  readonly onCheck: (label: string, setting: Setting) => void;
  /**
   * Called when a cycle is unchecked.
   *
   * @param label The label on the cycle element.
   * @param setting The setting associated with the cycle.
   */
  readonly onUnCheck: (label: string, setting: Setting) => void;
};
/**
 * A list of settings correlating to the planetary cycles in the game.
 */
export declare class CyclesList extends SettingsList<SeasonsListOptions> {
  readonly setting: SettingWithCycles;
  /**
   * Constructs a `SeasonsList`.
   *
   * @param host A reference to the host.
   * @param setting The settings that correlate to this list.
   * @param behavior Control cycle check box log output
   * @param options Options for this list.
   */
  constructor(
    host: KittenScientists,
    setting: SettingWithCycles,
    options?: Partial<SeasonsListOptions>,
  );
  private _makeCycle;
}
//# sourceMappingURL=CyclesList.d.ts.map
