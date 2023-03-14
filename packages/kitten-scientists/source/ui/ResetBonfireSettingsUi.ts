import { Icons } from "../images/Icons";
import { ResetBonfireSettings } from "../settings/ResetBonfireSettings";
import { SettingTrigger } from "../settings/Settings";
import { UserScript } from "../UserScript";
import { IconSettingsPanel } from "./components/IconSettingsPanel";
import { SettingsList } from "./components/SettingsList";
import { SettingTriggerLimitListItem } from "./components/SettingTriggerLimitListItem";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem";

export class ResetBonfireSettingsUi extends IconSettingsPanel<ResetBonfireSettings> {
  private readonly _buildings: Array<SettingTriggerListItem>;

  constructor(host: UserScript, settings: ResetBonfireSettings) {
    const label = host.engine.i18n("ui.build");
    super(host, label, settings, {
      icon: Icons.Bonfire,
    });

    this._buildings = [
      this._getResetOption(
        this.setting.buildings.hut,
        this._host.engine.i18n("$buildings.hut.label")
      ),
      this._getResetOption(
        this.setting.buildings.logHouse,
        this._host.engine.i18n("$buildings.logHouse.label")
      ),
      this._getResetOption(
        this.setting.buildings.mansion,
        this._host.engine.i18n("$buildings.mansion.label"),
        true
      ),

      this._getResetOption(
        this.setting.buildings.workshop,
        this._host.engine.i18n("$buildings.workshop.label")
      ),
      this._getResetOption(
        this.setting.buildings.factory,
        this._host.engine.i18n("$buildings.factory.label"),
        true
      ),

      this._getResetOption(
        this.setting.buildings.field,
        this._host.engine.i18n("$buildings.field.label")
      ),
      this._getResetOption(
        this.setting.buildings.pasture,
        this._host.engine.i18n("$buildings.pasture.label")
      ),
      this._getResetOption(
        this.setting.buildings.solarFarm,
        this._host.engine.i18n("$buildings.solarfarm.label")
      ),
      this._getResetOption(
        this.setting.buildings.mine,
        this._host.engine.i18n("$buildings.mine.label")
      ),
      this._getResetOption(
        this.setting.buildings.lumberMill,
        this._host.engine.i18n("$buildings.lumberMill.label")
      ),
      this._getResetOption(
        this.setting.buildings.aqueduct,
        this._host.engine.i18n("$buildings.aqueduct.label")
      ),
      this._getResetOption(
        this.setting.buildings.hydroPlant,
        this._host.engine.i18n("$buildings.hydroplant.label")
      ),
      this._getResetOption(
        this.setting.buildings.oilWell,
        this._host.engine.i18n("$buildings.oilWell.label")
      ),
      this._getResetOption(
        this.setting.buildings.quarry,
        this._host.engine.i18n("$buildings.quarry.label"),
        true
      ),

      this._getResetOption(
        this.setting.buildings.smelter,
        this._host.engine.i18n("$buildings.smelter.label")
      ),
      this._getResetOption(
        this.setting.buildings.biolab,
        this._host.engine.i18n("$buildings.biolab.label")
      ),
      this._getResetOption(
        this.setting.buildings.calciner,
        this._host.engine.i18n("$buildings.calciner.label")
      ),
      this._getResetOption(
        this.setting.buildings.reactor,
        this._host.engine.i18n("$buildings.reactor.label")
      ),
      this._getResetOption(
        this.setting.buildings.accelerator,
        this._host.engine.i18n("$buildings.accelerator.label")
      ),
      this._getResetOption(
        this.setting.buildings.steamworks,
        this._host.engine.i18n("$buildings.steamworks.label")
      ),
      this._getResetOption(
        this.setting.buildings.magneto,
        this._host.engine.i18n("$buildings.magneto.label"),
        true
      ),

      this._getResetOption(
        this.setting.buildings.library,
        this._host.engine.i18n("$buildings.library.label")
      ),
      this._getResetOption(
        this.setting.buildings.dataCenter,
        this._host.engine.i18n("$buildings.dataCenter.label")
      ),
      this._getResetOption(
        this.setting.buildings.academy,
        this._host.engine.i18n("$buildings.academy.label")
      ),
      this._getResetOption(
        this.setting.buildings.observatory,
        this._host.engine.i18n("$buildings.observatory.label"),
        true
      ),

      this._getResetOption(
        this.setting.buildings.amphitheatre,
        this._host.engine.i18n("$buildings.amphitheatre.label")
      ),
      this._getResetOption(
        this.setting.buildings.broadcastTower,
        this._host.engine.i18n("$buildings.broadcasttower.label")
      ),
      this._getResetOption(
        this.setting.buildings.tradepost,
        this._host.engine.i18n("$buildings.tradepost.label")
      ),
      this._getResetOption(
        this.setting.buildings.chapel,
        this._host.engine.i18n("$buildings.chapel.label")
      ),
      this._getResetOption(
        this.setting.buildings.temple,
        this._host.engine.i18n("$buildings.temple.label")
      ),
      this._getResetOption(
        this.setting.buildings.mint,
        this._host.engine.i18n("$buildings.mint.label")
      ),
      this._getResetOption(
        this.setting.buildings.ziggurat,
        this._host.engine.i18n("$buildings.ziggurat.label")
      ),
      this._getResetOption(
        this.setting.buildings.chronosphere,
        this._host.engine.i18n("$buildings.chronosphere.label")
      ),
      this._getResetOption(
        this.setting.buildings.aiCore,
        this._host.engine.i18n("$buildings.aicore.label")
      ),
      this._getResetOption(
        this.setting.buildings.brewery,
        this._host.engine.i18n("$buildings.brewery.label"),
        true
      ),

      this._getResetOption(
        this.setting.buildings.barn,
        this._host.engine.i18n("$buildings.barn.label")
      ),
      this._getResetOption(
        this.setting.buildings.harbor,
        this._host.engine.i18n("$buildings.harbor.label")
      ),
      this._getResetOption(
        this.setting.buildings.warehouse,
        this._host.engine.i18n("$buildings.warehouse.label"),
        true
      ),

      this._getResetOption(
        this.setting.buildings.zebraOutpost,
        this._host.engine.i18n("$buildings.zebraOutpost.label")
      ),
      this._getResetOption(
        this.setting.buildings.zebraWorkshop,
        this._host.engine.i18n("$buildings.zebraWorkshop.label")
      ),
      this._getResetOption(
        this.setting.buildings.zebraForge,
        this._host.engine.i18n("$buildings.zebraForge.label")
      ),
    ];

    const listBuildings = new SettingsList(this._host);
    listBuildings.addChildren(this._buildings);
    this.addChild(listBuildings);
  }

  private _getResetOption(
    option: SettingTrigger,
    i18nName: string,
    delimiter = false,
    upgradeIndicator = false
  ) {
    return new SettingTriggerLimitListItem(this._host, i18nName, option, {
      delimiter,
      onCheck: () => this._host.engine.imessage("status.reset.check.enable", [i18nName]),
      onUnCheck: () => this._host.engine.imessage("status.reset.check.disable", [i18nName]),
      upgradeIndicator,
    });
  }
}
