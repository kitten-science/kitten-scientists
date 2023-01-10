import { BonfireSettings } from "../settings/BonfireSettings";
import { UserScript } from "../UserScript";
import { BuildingUpgradeSettingsUi } from "./BuildingUpgradeSettingsUi";
import { TriggerButton } from "./components/buttons-icon/TriggerButton";
import { HeaderListItem } from "./components/HeaderListItem";
import { SettingListItem } from "./components/SettingListItem";
import { SettingsList } from "./components/SettingsList";
import { SettingsSectionUi } from "./SettingsSectionUi";

export class BonfireSettingsUi extends SettingsSectionUi<BonfireSettings> {
  private readonly _trigger: TriggerButton;
  private readonly _buildingUpgradeUi: BuildingUpgradeSettingsUi;
  private readonly _turnOnSteamworks: SettingListItem;
  private readonly _turnOnMagnetos: SettingListItem;

  constructor(host: UserScript, settings: BonfireSettings) {
    const label = host.engine.i18n("ui.build");
    super(host, label, settings);

    this._trigger = new TriggerButton(host, label, settings);
    this._trigger.element.insertAfter(this._expando.element);
    this.children.add(this._trigger);

    const listBuildings = new SettingsList(this._host, {
      children: [
        new HeaderListItem(this._host, this._host.engine.i18n("$buildings.group.food")),
        this._getBuildOption(
          this.setting.buildings.field,
          this._host.engine.i18n("$buildings.field.label")
        ),
        this._getBuildOption(
          this.setting.buildings.pasture,
          this._host.engine.i18n("$buildings.pasture.label")
        ),
        this._getBuildOption(
          this.setting.buildings.solarFarm,
          this._host.engine.i18n("$buildings.solarfarm.label"),
          false,
          true
        ),
        this._getBuildOption(
          this.setting.buildings.aqueduct,
          this._host.engine.i18n("$buildings.aqueduct.label")
        ),
        this._getBuildOption(
          this.setting.buildings.hydroPlant,
          this._host.engine.i18n("$buildings.hydroplant.label"),
          true,
          true
        ),

        new HeaderListItem(this._host, this._host.engine.i18n("$buildings.group.population")),
        this._getBuildOption(
          this.setting.buildings.hut,
          this._host.engine.i18n("$buildings.hut.label")
        ),
        this._getBuildOption(
          this.setting.buildings.logHouse,
          this._host.engine.i18n("$buildings.logHouse.label")
        ),
        this._getBuildOption(
          this.setting.buildings.mansion,
          this._host.engine.i18n("$buildings.mansion.label"),
          true
        ),

        new HeaderListItem(this._host, this._host.engine.i18n("$buildings.group.science")),
        this._getBuildOption(
          this.setting.buildings.library,
          this._host.engine.i18n("$buildings.library.label")
        ),
        this._getBuildOption(
          this.setting.buildings.dataCenter,
          this._host.engine.i18n("$buildings.dataCenter.label"),
          false,
          true
        ),
        this._getBuildOption(
          this.setting.buildings.academy,
          this._host.engine.i18n("$buildings.academy.label")
        ),
        this._getBuildOption(
          this.setting.buildings.observatory,
          this._host.engine.i18n("$buildings.observatory.label")
        ),
        this._getBuildOption(
          this.setting.buildings.biolab,
          this._host.engine.i18n("$buildings.biolab.label"),
          true
        ),

        new HeaderListItem(this._host, this._host.engine.i18n("$buildings.group.storage")),
        this._getBuildOption(
          this.setting.buildings.barn,
          this._host.engine.i18n("$buildings.barn.label")
        ),
        this._getBuildOption(
          this.setting.buildings.harbor,
          this._host.engine.i18n("$buildings.harbor.label")
        ),
        this._getBuildOption(
          this.setting.buildings.warehouse,
          this._host.engine.i18n("$buildings.warehouse.label"),
          true
        ),

        new HeaderListItem(this._host, this._host.engine.i18n("$buildings.group.resource")),
        this._getBuildOption(
          this.setting.buildings.mine,
          this._host.engine.i18n("$buildings.mine.label")
        ),
        this._getBuildOption(
          this.setting.buildings.quarry,
          this._host.engine.i18n("$buildings.quarry.label")
        ),
        this._getBuildOption(
          this.setting.buildings.lumberMill,
          this._host.engine.i18n("$buildings.lumberMill.label")
        ),
        this._getBuildOption(
          this.setting.buildings.oilWell,
          this._host.engine.i18n("$buildings.oilWell.label")
        ),
        this._getBuildOption(
          this.setting.buildings.accelerator,
          this._host.engine.i18n("$buildings.accelerator.label"),
          true
        ),

        new HeaderListItem(this._host, this._host.engine.i18n("$buildings.group.industry")),
        this._getBuildOption(
          this.setting.buildings.steamworks,
          this._host.engine.i18n("$buildings.steamworks.label")
        ),
        this._getBuildOption(
          this.setting.buildings.magneto,
          this._host.engine.i18n("$buildings.magneto.label")
        ),
        this._getBuildOption(
          this.setting.buildings.smelter,
          this._host.engine.i18n("$buildings.smelter.label")
        ),
        this._getBuildOption(
          this.setting.buildings.calciner,
          this._host.engine.i18n("$buildings.calciner.label")
        ),
        this._getBuildOption(
          this.setting.buildings.factory,
          this._host.engine.i18n("$buildings.factory.label")
        ),
        this._getBuildOption(
          this.setting.buildings.reactor,
          this._host.engine.i18n("$buildings.reactor.label"),
          true
        ),

        new HeaderListItem(this._host, this._host.engine.i18n("$buildings.group.culture")),
        this._getBuildOption(
          this.setting.buildings.amphitheatre,
          this._host.engine.i18n("$buildings.amphitheatre.label")
        ),
        this._getBuildOption(
          this.setting.buildings.broadcastTower,
          this._host.engine.i18n("$buildings.broadcasttower.label"),
          false,
          true
        ),
        this._getBuildOption(
          this.setting.buildings.chapel,
          this._host.engine.i18n("$buildings.chapel.label")
        ),
        this._getBuildOption(
          this.setting.buildings.temple,
          this._host.engine.i18n("$buildings.temple.label"),
          true
        ),

        new HeaderListItem(this._host, this._host.engine.i18n("$buildings.group.other")),
        this._getBuildOption(
          this.setting.buildings.workshop,
          this._host.engine.i18n("$buildings.workshop.label")
        ),
        this._getBuildOption(
          this.setting.buildings.tradepost,
          this._host.engine.i18n("$buildings.tradepost.label")
        ),
        this._getBuildOption(
          this.setting.buildings.mint,
          this._host.engine.i18n("$buildings.mint.label")
        ),
        this._getBuildOption(
          this.setting.buildings.brewery,
          this._host.engine.i18n("$buildings.brewery.label"),
          true
        ),

        new HeaderListItem(this._host, this._host.engine.i18n("$buildings.group.megastructures")),
        this._getBuildOption(
          this.setting.buildings.ziggurat,
          this._host.engine.i18n("$buildings.ziggurat.label")
        ),
        this._getBuildOption(
          this.setting.buildings.chronosphere,
          this._host.engine.i18n("$buildings.chronosphere.label")
        ),
        this._getBuildOption(
          this.setting.buildings.aiCore,
          this._host.engine.i18n("$buildings.aicore.label"),
          true
        ),

        new HeaderListItem(this._host, this._host.engine.i18n("$buildings.group.zebraBuildings")),
        this._getBuildOption(
          this.setting.buildings.zebraOutpost,
          this._host.engine.i18n("$buildings.zebraOutpost.label")
        ),
        this._getBuildOption(
          this.setting.buildings.zebraWorkshop,
          this._host.engine.i18n("$buildings.zebraWorkshop.label")
        ),
        this._getBuildOption(
          this.setting.buildings.zebraForge,
          this._host.engine.i18n("$buildings.zebraForge.label")
        ),
      ],
      onReset: () => {
        this.setting.load({ buildings: new BonfireSettings().buildings });
        this.refreshUi();
      },
    });
    this.addChild(listBuildings);

    const listAddition = new SettingsList(this._host, {
      hasDisableAll: false,
      hasEnableAll: false,
    });
    listAddition.addChild(new HeaderListItem(this._host, "Additional options"));

    this._buildingUpgradeUi = new BuildingUpgradeSettingsUi(
      this._host,
      this.setting.upgradeBuildings
    );
    listAddition.addChild(this._buildingUpgradeUi);

    this._turnOnSteamworks = new SettingListItem(
      this._host,
      this._host.engine.i18n("option.steamworks"),
      this.setting.turnOnSteamworks,
      {
        onCheck: () =>
          this._host.engine.imessage("status.sub.enable", [
            this._host.engine.i18n("option.steamworks"),
          ]),
        onUnCheck: () =>
          this._host.engine.imessage("status.sub.disable", [
            this._host.engine.i18n("option.steamworks"),
          ]),
      }
    );
    listAddition.addChild(this._turnOnSteamworks);

    this._turnOnMagnetos = new SettingListItem(
      this._host,
      this._host.engine.i18n("option.magnetos"),
      this.setting.turnOnMagnetos,
      {
        onCheck: () =>
          this._host.engine.imessage("status.sub.enable", [
            this._host.engine.i18n("option.magnetos"),
          ]),
        onUnCheck: () =>
          this._host.engine.imessage("status.sub.disable", [
            this._host.engine.i18n("option.magnetos"),
          ]),
      }
    );
    listAddition.addChild(this._turnOnMagnetos);

    this.addChild(listAddition);
  }
}
