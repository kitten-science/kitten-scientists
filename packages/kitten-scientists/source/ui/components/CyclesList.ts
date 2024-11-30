import { KittenScientists } from "../../KittenScientists.js";
import { Setting } from "../../settings/Settings.js";
import { Cycle } from "../../types/index.js";
import { SettingListItem } from "./SettingListItem.js";
import { SettingsList } from "./SettingsList.js";
import { UiComponentOptions } from "./UiComponent.js";

export type SettingWithCycles = Record<Cycle, Setting>;

export type CycleCheckboxBehavior = "skip" | "heatTransfer";

/**
 * A list of settings correlating to the planetary cycles in the game.
 */
export class CyclesList extends SettingsList {
  readonly behavior: CycleCheckboxBehavior;
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
    behavior: CycleCheckboxBehavior = "skip",
    options?: Partial<UiComponentOptions>,
  ) {
    super(host, options);
    this.setting = setting;
    this.behavior = behavior;

    this.addEventListener("enableAll", () => {
      this.setting.charon.enabled = true;
      this.setting.umbra.enabled = true;
      this.setting.yarn.enabled = true;
      this.setting.helios.enabled = true;
      this.setting.cath.enabled = true;
      this.setting.redmoon.enabled = true;
      this.setting.dune.enabled = true;
      this.setting.piscine.enabled = true;
      this.setting.terminus.enabled = true;
      this.setting.kairo.enabled = true;
      this.refreshUi();
    });
    this.addEventListener("disableAll", () => {
      this.setting.charon.enabled = false;
      this.setting.umbra.enabled = false;
      this.setting.yarn.enabled = false;
      this.setting.helios.enabled = false;
      this.setting.cath.enabled = false;
      this.setting.redmoon.enabled = false;
      this.setting.dune.enabled = false;
      this.setting.piscine.enabled = false;
      this.setting.terminus.enabled = false;
      this.setting.kairo.enabled = false;
      this.refreshUi();
    });

    this.addChildren([
      this._makeCycle("charon", this.setting.charon),
      this._makeCycle("umbra", this.setting.umbra),
      this._makeCycle("yarn", this.setting.yarn),
      this._makeCycle("helios", this.setting.helios),
      this._makeCycle("cath", this.setting.cath),
      this._makeCycle("redmoon", this.setting.redmoon),
      this._makeCycle("dune", this.setting.dune),
      this._makeCycle("piscine", this.setting.piscine),
      this._makeCycle("terminus", this.setting.terminus),
      this._makeCycle("kairo", this.setting.kairo),
    ]);
  }

  private _makeCycle(cycle: Cycle, setting: Setting) {
    const label = this._host.engine.labelForCycle(cycle);
    return new SettingListItem(this._host, label, setting, {
      onCheck: () => {
        this._host.engine.imessage(
          this.behavior === "heatTransfer"
            ? "time.HeatTransfer.cycle.enable"
            : "time.skip.cycle.enable",
          [label],
        );
      },
      onUnCheck: () => {
        this._host.engine.imessage(
          this.behavior === "heatTransfer"
            ? "time.HeatTransfer.cycle.disable"
            : "time.skip.cycle.disable",
          [label],
        );
      },
    });
  }
}
