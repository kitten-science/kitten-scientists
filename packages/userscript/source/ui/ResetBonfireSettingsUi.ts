import { ResetBonfireSettings } from "../options/ResetBonfireSettings";
import { SettingTrigger } from "../options/Settings";
import { UserScript } from "../UserScript";
import { IconSettingsPanel } from "./components/IconSettingsPanel";
import { SettingTriggerLimitListItem } from "./components/SettingTriggerLimitListItem";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem";

export class ResetBonfireSettingsUi extends IconSettingsPanel<ResetBonfireSettings> {
  private readonly _buildings: Array<SettingTriggerListItem>;

  constructor(host: UserScript, settings: ResetBonfireSettings) {
    const label = host.engine.i18n("ui.build");
    super(
      host,
      label,
      settings,
      "M4 44v-9.15L22.15 10.3 18.8 5.8l2.45-1.75L24 7.8l2.8-3.75 2.4 1.75-3.3 4.5L44 34.85V44Zm20-31.15-17 23V41h7.25L24 27.35 33.75 41H41v-5.15ZM17.95 41h12.1L24 32.5ZM24 27.35 33.75 41 24 27.35 14.25 41Z"
    );

    this._list.addEventListener("enableAll", () => {
      this._buildings.forEach(item => (item.setting.enabled = true));
      this.refreshUi();
    });
    this._list.addEventListener("disableAll", () => {
      this._buildings.forEach(item => (item.setting.enabled = false));
      this.refreshUi();
    });
    this._list.addEventListener("reset", () => {
      this.settings.load(new ResetBonfireSettings());
      this.refreshUi();
    });

    this._buildings = [
      this._getResetOption(this.settings.items.hut, this._host.engine.i18n("$buildings.hut.label")),
      this._getResetOption(
        this.settings.items.logHouse,
        this._host.engine.i18n("$buildings.logHouse.label")
      ),
      this._getResetOption(
        this.settings.items.mansion,
        this._host.engine.i18n("$buildings.mansion.label"),
        true
      ),

      this._getResetOption(
        this.settings.items.workshop,
        this._host.engine.i18n("$buildings.workshop.label")
      ),
      this._getResetOption(
        this.settings.items.factory,
        this._host.engine.i18n("$buildings.factory.label"),
        true
      ),

      this._getResetOption(
        this.settings.items.field,
        this._host.engine.i18n("$buildings.field.label")
      ),
      this._getResetOption(
        this.settings.items.pasture,
        this._host.engine.i18n("$buildings.pasture.label")
      ),
      this._getResetOption(
        this.settings.items.solarFarm,
        this._host.engine.i18n("$buildings.solarfarm.label")
      ),
      this._getResetOption(
        this.settings.items.mine,
        this._host.engine.i18n("$buildings.mine.label")
      ),
      this._getResetOption(
        this.settings.items.lumberMill,
        this._host.engine.i18n("$buildings.lumberMill.label")
      ),
      this._getResetOption(
        this.settings.items.aqueduct,
        this._host.engine.i18n("$buildings.aqueduct.label")
      ),
      this._getResetOption(
        this.settings.items.hydroPlant,
        this._host.engine.i18n("$buildings.hydroplant.label")
      ),
      this._getResetOption(
        this.settings.items.oilWell,
        this._host.engine.i18n("$buildings.oilWell.label")
      ),
      this._getResetOption(
        this.settings.items.quarry,
        this._host.engine.i18n("$buildings.quarry.label"),
        true
      ),

      this._getResetOption(
        this.settings.items.smelter,
        this._host.engine.i18n("$buildings.smelter.label")
      ),
      this._getResetOption(
        this.settings.items.biolab,
        this._host.engine.i18n("$buildings.biolab.label")
      ),
      this._getResetOption(
        this.settings.items.calciner,
        this._host.engine.i18n("$buildings.calciner.label")
      ),
      this._getResetOption(
        this.settings.items.reactor,
        this._host.engine.i18n("$buildings.reactor.label")
      ),
      this._getResetOption(
        this.settings.items.accelerator,
        this._host.engine.i18n("$buildings.accelerator.label")
      ),
      this._getResetOption(
        this.settings.items.steamworks,
        this._host.engine.i18n("$buildings.steamworks.label")
      ),
      this._getResetOption(
        this.settings.items.magneto,
        this._host.engine.i18n("$buildings.magneto.label"),
        true
      ),

      this._getResetOption(
        this.settings.items.library,
        this._host.engine.i18n("$buildings.library.label")
      ),
      this._getResetOption(
        this.settings.items.dataCenter,
        this._host.engine.i18n("$buildings.dataCenter.label")
      ),
      this._getResetOption(
        this.settings.items.academy,
        this._host.engine.i18n("$buildings.academy.label")
      ),
      this._getResetOption(
        this.settings.items.observatory,
        this._host.engine.i18n("$buildings.observatory.label"),
        true
      ),

      this._getResetOption(
        this.settings.items.amphitheatre,
        this._host.engine.i18n("$buildings.amphitheatre.label")
      ),
      this._getResetOption(
        this.settings.items.broadcastTower,
        this._host.engine.i18n("$buildings.broadcasttower.label")
      ),
      this._getResetOption(
        this.settings.items.tradepost,
        this._host.engine.i18n("$buildings.tradepost.label")
      ),
      this._getResetOption(
        this.settings.items.chapel,
        this._host.engine.i18n("$buildings.chapel.label")
      ),
      this._getResetOption(
        this.settings.items.temple,
        this._host.engine.i18n("$buildings.temple.label")
      ),
      this._getResetOption(
        this.settings.items.mint,
        this._host.engine.i18n("$buildings.mint.label")
      ),
      this._getResetOption(
        this.settings.items.ziggurat,
        this._host.engine.i18n("$buildings.ziggurat.label")
      ),
      this._getResetOption(
        this.settings.items.chronosphere,
        this._host.engine.i18n("$buildings.chronosphere.label")
      ),
      this._getResetOption(
        this.settings.items.aiCore,
        this._host.engine.i18n("$buildings.aicore.label")
      ),
      this._getResetOption(
        this.settings.items.brewery,
        this._host.engine.i18n("$buildings.brewery.label"),
        true
      ),

      this._getResetOption(
        this.settings.items.barn,
        this._host.engine.i18n("$buildings.barn.label")
      ),
      this._getResetOption(
        this.settings.items.harbor,
        this._host.engine.i18n("$buildings.harbor.label")
      ),
      this._getResetOption(
        this.settings.items.warehouse,
        this._host.engine.i18n("$buildings.warehouse.label"),
        true
      ),

      this._getResetOption(
        this.settings.items.zebraOutpost,
        this._host.engine.i18n("$buildings.zebraOutpost.label")
      ),
      this._getResetOption(
        this.settings.items.zebraWorkshop,
        this._host.engine.i18n("$buildings.zebraWorkshop.label")
      ),
      this._getResetOption(
        this.settings.items.zebraForge,
        this._host.engine.i18n("$buildings.zebraForge.label")
      ),
    ];
    this.addChildren(this._buildings);
  }

  private _getResetOption(
    option: SettingTrigger,
    i18nName: string,
    delimiter = false,
    upgradeIndicator = false
  ) {
    return new SettingTriggerLimitListItem(
      this._host,
      i18nName,
      option,
      {
        onCheck: () => this._host.engine.imessage("status.reset.check.enable", [i18nName]),
        onUnCheck: () => this._host.engine.imessage("status.reset.check.disable", [i18nName]),
      },
      delimiter,
      upgradeIndicator
    );
  }
}
