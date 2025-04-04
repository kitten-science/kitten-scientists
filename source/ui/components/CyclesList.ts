import type { KittenScientists } from "../../KittenScientists.js";
import type { Setting } from "../../settings/Settings.js";
import type { Cycle } from "../../types/index.js";
import { SettingListItem } from "./SettingListItem.js";
import { SettingsList, type SettingsListOptions } from "./SettingsList.js";

export type SettingWithCycles = Record<Cycle, Setting>;

export type CyclesListOptions = ThisType<CyclesList> &
  SettingsListOptions & {
    /**
     * Called when a cycle is checked.
     *
     * @param label The label on the cycle element.
     * @param setting The setting associated with the cycle.
     */
    readonly onCheckCycle?: (label: string, setting: Setting, isBatchProcess?: boolean) => void;

    /**
     * Called when a cycle is unchecked.
     *
     * @param label The label on the cycle element.
     * @param setting The setting associated with the cycle.
     */
    readonly onUnCheckCycle?: (label: string, setting: Setting, isBatchProcess?: boolean) => void;
  };

/**
 * A list of settings correlating to the planetary cycles in the game.
 */
export class CyclesList extends SettingsList {
  declare readonly _options: CyclesListOptions;
  readonly setting: SettingWithCycles;

  /**
   * Constructs a `SeasonsList`.
   *
   * @param host A reference to the host.
   * @param setting The settings that correlate to this list.
   * @param behavior Control cycle check box log output
   * @param options Options for this list.
   */
  constructor(host: KittenScientists, setting: SettingWithCycles, options?: CyclesListOptions) {
    super(host, options);
    this.setting = setting;

    const makeCycle = (cycle: Cycle, setting: Setting) => {
      const label = host.engine.labelForCycle(cycle);
      return new SettingListItem(host, setting, label, {
        onCheck: (isBatchProcess?: boolean) =>
          options?.onCheckCycle?.(label, setting, isBatchProcess),
        onUnCheck: (isBatchProcess?: boolean) =>
          options?.onUnCheckCycle?.(label, setting, isBatchProcess),
      });
    };

    const cycles = [
      makeCycle("charon", this.setting.charon),
      makeCycle("umbra", this.setting.umbra),
      makeCycle("yarn", this.setting.yarn),
      makeCycle("helios", this.setting.helios),
      makeCycle("cath", this.setting.cath),
      makeCycle("redmoon", this.setting.redmoon),
      makeCycle("dune", this.setting.dune),
      makeCycle("piscine", this.setting.piscine),
      makeCycle("terminus", this.setting.terminus),
      makeCycle("kairo", this.setting.kairo),
    ];
    this.addChildren(cycles);

    this.addEventListener("enableAll", () => {
      for (const cycle of cycles) {
        cycle.check(true);
      }
      this.refreshUi();
    });
    this.addEventListener("disableAll", () => {
      for (const cycle of cycles) {
        cycle.uncheck(true);
      }
      this.refreshUi();
    });
  }
}
