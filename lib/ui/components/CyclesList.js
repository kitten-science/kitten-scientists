import { SettingListItem } from "./SettingListItem.js";
import { SettingsList } from "./SettingsList.js";
/**
 * A list of settings correlating to the planetary cycles in the game.
 */
export class CyclesList extends SettingsList {
  setting;
  /**
   * Constructs a `SeasonsList`.
   *
   * @param host A reference to the host.
   * @param setting The settings that correlate to this list.
   * @param behavior Control cycle check box log output
   * @param options Options for this list.
   */
  constructor(host, setting, options) {
    super(host, options);
    this.setting = setting;
    this.addEventListener("enableAll", () => {
      for (const child of this.children) {
        child.check();
      }
      this.refreshUi();
    });
    this.addEventListener("disableAll", () => {
      for (const child of this.children) {
        child.uncheck();
      }
      this.refreshUi();
    });
    this.addChildren([
      this._makeCycle("charon", this.setting.charon, options),
      this._makeCycle("umbra", this.setting.umbra, options),
      this._makeCycle("yarn", this.setting.yarn, options),
      this._makeCycle("helios", this.setting.helios, options),
      this._makeCycle("cath", this.setting.cath, options),
      this._makeCycle("redmoon", this.setting.redmoon, options),
      this._makeCycle("dune", this.setting.dune, options),
      this._makeCycle("piscine", this.setting.piscine, options),
      this._makeCycle("terminus", this.setting.terminus, options),
      this._makeCycle("kairo", this.setting.kairo, options),
    ]);
  }
  _makeCycle(cycle, setting, handler) {
    const label = this._host.engine.labelForCycle(cycle);
    return new SettingListItem(this._host, setting, label, {
      onCheck: () => handler?.onCheck?.(label, setting),
      onUnCheck: () => handler?.onUnCheck?.(label, setting),
    });
  }
}
//# sourceMappingURL=CyclesList.js.map
