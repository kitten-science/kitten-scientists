import { Setting } from "../../settings/Settings";
import { Cycle } from "../../types";
import { UserScript } from "../../UserScript";
import { SettingListItem } from "./SettingListItem";
import { SettingsList } from "./SettingsList";

export type SettingWithCycles = Record<Cycle, Setting>;

/**
 * A list of settings correlating to the planetary cycles in the game.
 */
export class CyclesList extends SettingsList {
  readonly setting: SettingWithCycles;

  readonly charon: SettingListItem;
  readonly umbra: SettingListItem;
  readonly yarn: SettingListItem;
  readonly helios: SettingListItem;
  readonly cath: SettingListItem;
  readonly redmoon: SettingListItem;
  readonly dune: SettingListItem;
  readonly piscine: SettingListItem;
  readonly terminus: SettingListItem;
  readonly kairo: SettingListItem;

  /**
   * Constructs a `SeasonsList`.
   *
   * @param host A reference to the host.
   * @param setting The settings that correlate to this list.
   */
  constructor(host: UserScript, setting: SettingWithCycles) {
    super(host);
    this.setting = setting;

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

    this.charon = this._makeCycle(
      `⍙ ${this._host.engine.i18n("$space.planet.charon.label")}`,
      this.setting.charon
    );
    this.umbra = this._makeCycle(
      `⍦ ${this._host.engine.i18n("$space.planet.umbra.label")}`,
      this.setting.umbra
    );
    this.yarn = this._makeCycle(
      `⍧ ${this._host.engine.i18n("$space.planet.yarn.label")}`,
      this.setting.yarn
    );
    this.helios = this._makeCycle(
      `⌒ ${this._host.engine.i18n("$space.planet.helios.label")}`,
      this.setting.helios
    );
    this.cath = this._makeCycle(
      `⌾ ${this._host.engine.i18n("$space.planet.cath.label")}`,
      this.setting.cath
    );
    this.redmoon = this._makeCycle(
      `⍜ ${this._host.engine.i18n("$space.planet.moon.label")}`,
      this.setting.redmoon
    );
    this.dune = this._makeCycle(
      `⍫ ${this._host.engine.i18n("$space.planet.dune.label")}`,
      this.setting.dune
    );
    this.piscine = this._makeCycle(
      `⎈ ${this._host.engine.i18n("$space.planet.piscine.label")}`,
      this.setting.piscine
    );
    this.terminus = this._makeCycle(
      `⍝ ${this._host.engine.i18n("$space.planet.terminus.label")}`,
      this.setting.terminus
    );
    this.kairo = this._makeCycle(
      `℣ ${this._host.engine.i18n("$space.planet.kairo.label")}`,
      this.setting.kairo
    );

    this.addChildren([
      this.charon,
      this.umbra,
      this.yarn,
      this.helios,
      this.cath,
      this.redmoon,
      this.dune,
      this.piscine,
      this.terminus,
      this.kairo,
    ]);
  }

  private _makeCycle(label: string, setting: Setting) {
    return new SettingListItem(this._host, label, setting, {
      onCheck: () => this._host.engine.imessage("time.skip.cycle.enable", [label]),
      onUnCheck: () => this._host.engine.imessage("time.skip.cycle.disable", [label]),
    });
  }

  refreshUi() {
    super.refreshUi();

    this.charon.refreshUi();
    this.umbra.refreshUi();
    this.yarn.refreshUi();
    this.helios.refreshUi();
    this.cath.refreshUi();
    this.redmoon.refreshUi();
    this.dune.refreshUi();
    this.piscine.refreshUi();
    this.terminus.refreshUi();
    this.kairo.refreshUi();
  }
}
