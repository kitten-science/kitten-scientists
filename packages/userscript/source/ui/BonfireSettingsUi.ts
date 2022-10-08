import { BonfireSettings } from "../options/BonfireSettings";
import { objectEntries } from "../tools/Entries";
import { ucfirst } from "../tools/Format";
import { mustExist } from "../tools/Maybe";
import { UserScript } from "../UserScript";
import { SettingListItem } from "./components/SettingListItem";
import { TriggerButton } from "./components/TriggerButton";
import { SettingsListUi } from "./SettingsListUi";
import { SettingsPanelUi } from "./SettingsPanelUi";
import { SettingsSectionUi } from "./SettingsSectionUi";

export class BonfireSettingsUi extends SettingsSectionUi {
  private readonly _trigger: TriggerButton;
  private readonly _settings: BonfireSettings;

  constructor(host: UserScript, settings: BonfireSettings) {
    const toggleName = "build";
    const label = ucfirst(host.engine.i18n("ui.build"));
    const list = SettingsListUi.getSettingsList(host.engine, toggleName);
    const panel = SettingsPanelUi.make(host, toggleName, label, settings, list);
    super(host, panel, list);

    this._settings = settings;

    // Create "trigger" button in the item.
    this._trigger = new TriggerButton(host, toggleName, label, settings);
    panel.element.append(this._trigger.element);

    const optionButtons = [
      this._getHeader(this._host.engine.i18n("$buildings.group.food")),
      this._getBuildOption(
        "field",
        this._settings.items.field,
        this._host.engine.i18n("$buildings.field.label")
      ),
      this._getBuildOption(
        "pasture",
        this._settings.items.pasture,
        this._host.engine.i18n("$buildings.pasture.label")
      ),
      this._getBuildOption(
        "solarFarm",
        this._settings.items.solarFarm,
        this._host.engine.i18n("$buildings.solarfarm.label"),
        false,
        true
      ),
      this._getBuildOption(
        "aqueduct",
        this._settings.items.aqueduct,
        this._host.engine.i18n("$buildings.aqueduct.label")
      ),
      this._getBuildOption(
        "hydroPlant",
        this._settings.items.hydroPlant,
        this._host.engine.i18n("$buildings.hydroplant.label"),
        true,
        true
      ),

      this._getHeader(this._host.engine.i18n("$buildings.group.population")),
      this._getBuildOption(
        "hut",
        this._settings.items.hut,
        this._host.engine.i18n("$buildings.hut.label")
      ),
      this._getBuildOption(
        "logHouse",
        this._settings.items.logHouse,
        this._host.engine.i18n("$buildings.logHouse.label")
      ),
      this._getBuildOption(
        "mansion",
        this._settings.items.mansion,
        this._host.engine.i18n("$buildings.mansion.label"),
        true
      ),

      this._getHeader(this._host.engine.i18n("$buildings.group.science")),
      this._getBuildOption(
        "library",
        this._settings.items.library,
        this._host.engine.i18n("$buildings.library.label")
      ),
      this._getBuildOption(
        "dataCenter",
        this._settings.items.dataCenter,
        this._host.engine.i18n("$buildings.dataCenter.label"),
        false,
        true
      ),
      this._getBuildOption(
        "academy",
        this._settings.items.academy,
        this._host.engine.i18n("$buildings.academy.label")
      ),
      this._getBuildOption(
        "observatory",
        this._settings.items.observatory,
        this._host.engine.i18n("$buildings.observatory.label")
      ),
      this._getBuildOption(
        "biolab",
        this._settings.items.biolab,
        this._host.engine.i18n("$buildings.biolab.label"),
        true
      ),

      this._getHeader(this._host.engine.i18n("$buildings.group.storage")),
      this._getBuildOption(
        "barn",
        this._settings.items.barn,
        this._host.engine.i18n("$buildings.barn.label")
      ),
      this._getBuildOption(
        "harbor",
        this._settings.items.harbor,
        this._host.engine.i18n("$buildings.harbor.label")
      ),
      this._getBuildOption(
        "warehouse",
        this._settings.items.warehouse,
        this._host.engine.i18n("$buildings.warehouse.label"),
        true
      ),

      this._getHeader(this._host.engine.i18n("$buildings.group.resource")),
      this._getBuildOption(
        "mine",
        this._settings.items.mine,
        this._host.engine.i18n("$buildings.mine.label")
      ),
      this._getBuildOption(
        "quarry",
        this._settings.items.quarry,
        this._host.engine.i18n("$buildings.quarry.label")
      ),
      this._getBuildOption(
        "lumberMill",
        this._settings.items.lumberMill,
        this._host.engine.i18n("$buildings.lumberMill.label")
      ),
      this._getBuildOption(
        "oilWell",
        this._settings.items.oilWell,
        this._host.engine.i18n("$buildings.oilWell.label")
      ),
      this._getBuildOption(
        "accelerator",
        this._settings.items.accelerator,
        this._host.engine.i18n("$buildings.accelerator.label"),
        true
      ),

      this._getHeader(this._host.engine.i18n("$buildings.group.industry")),
      this._getBuildOption(
        "steamworks",
        this._settings.items.steamworks,
        this._host.engine.i18n("$buildings.steamworks.label")
      ),
      this._getBuildOption(
        "magneto",
        this._settings.items.magneto,
        this._host.engine.i18n("$buildings.magneto.label")
      ),
      this._getBuildOption(
        "smelter",
        this._settings.items.smelter,
        this._host.engine.i18n("$buildings.smelter.label")
      ),
      this._getBuildOption(
        "calciner",
        this._settings.items.calciner,
        this._host.engine.i18n("$buildings.calciner.label")
      ),
      this._getBuildOption(
        "factory",
        this._settings.items.factory,
        this._host.engine.i18n("$buildings.factory.label")
      ),
      this._getBuildOption(
        "reactor",
        this._settings.items.reactor,
        this._host.engine.i18n("$buildings.reactor.label"),
        true
      ),

      this._getHeader(this._host.engine.i18n("$buildings.group.culture")),
      this._getBuildOption(
        "amphitheatre",
        this._settings.items.amphitheatre,
        this._host.engine.i18n("$buildings.amphitheatre.label")
      ),
      this._getBuildOption(
        "broadcastTower",
        this._settings.items.broadcastTower,
        this._host.engine.i18n("$buildings.broadcasttower.label"),
        false,
        true
      ),
      this._getBuildOption(
        "chapel",
        this._settings.items.chapel,
        this._host.engine.i18n("$buildings.chapel.label")
      ),
      this._getBuildOption(
        "temple",
        this._settings.items.temple,
        this._host.engine.i18n("$buildings.temple.label"),
        true
      ),

      this._getHeader(this._host.engine.i18n("$buildings.group.other")),
      this._getBuildOption(
        "workshop",
        this._settings.items.workshop,
        this._host.engine.i18n("$buildings.workshop.label")
      ),
      this._getBuildOption(
        "tradepost",
        this._settings.items.tradepost,
        this._host.engine.i18n("$buildings.tradepost.label")
      ),
      this._getBuildOption(
        "mint",
        this._settings.items.mint,
        this._host.engine.i18n("$buildings.mint.label")
      ),
      this._getBuildOption(
        "brewery",
        this._settings.items.brewery,
        this._host.engine.i18n("$buildings.brewery.label"),
        true
      ),

      this._getHeader(this._host.engine.i18n("$buildings.group.megastructures")),
      this._getBuildOption(
        "ziggurat",
        this._settings.items.ziggurat,
        this._host.engine.i18n("$buildings.ziggurat.label")
      ),
      this._getBuildOption(
        "chronosphere",
        this._settings.items.chronosphere,
        this._host.engine.i18n("$buildings.chronosphere.label")
      ),
      this._getBuildOption(
        "aiCore",
        this._settings.items.aiCore,
        this._host.engine.i18n("$buildings.aicore.label"),
        true
      ),

      this._getHeader(this._host.engine.i18n("$buildings.group.zebraBuildings")),
      this._getBuildOption(
        "zebraOutpost",
        this._settings.items.zebraOutpost,
        this._host.engine.i18n("$buildings.zebraOutpost.label")
      ),
      this._getBuildOption(
        "zebraWorkshop",
        this._settings.items.zebraWorkshop,
        this._host.engine.i18n("$buildings.zebraWorkshop.label")
      ),
      this._getBuildOption(
        "zebraForge",
        this._settings.items.zebraForge,
        this._host.engine.i18n("$buildings.zebraForge.label"),
        true
      ),
    ];
    list.append(optionButtons);

    const additionOptions = this._getAdditionOptions();

    panel.element.append(list);
    list.append(additionOptions);
  }

  private _getAdditionOptions(): Array<JQuery<HTMLElement>> {
    const header = this._getHeader("Additional options");

    const upgradeBuildingsList = SettingsListUi.getSettingsList(this._host.engine, "buildings");
    const upgradeBuildingsElement = SettingsPanelUi.make(
      this._host,
      "buildings",
      this._host.engine.i18n("ui.upgrade.buildings"),
      this._settings.upgradeBuildings,
      upgradeBuildingsList
    );

    const upgradeBuildingsButtons = [];
    for (const [upgradeName, upgrade] of objectEntries(this._settings.upgradeBuildings.items)) {
      const label = this._host.engine.i18n(`$buildings.${upgradeName}.label`);
      const button = new SettingListItem(
        this._host,
        `building-${upgradeName}`,
        label,
        upgrade,
        {
          onCheck: () => this._host.engine.imessage("status.auto.enable", [label]),
          onUnCheck: () => this._host.engine.imessage("status.auto.disable", [label]),
        },
        false,
        false,
        []
      );

      upgradeBuildingsButtons.push({ label: label, button: button });
    }
    // Ensure buttons are added into UI with their labels alphabetized.
    upgradeBuildingsButtons.sort((a, b) => a.label.localeCompare(b.label));
    upgradeBuildingsButtons.forEach(button => upgradeBuildingsList.append(button.button.element));

    const nodeTurnOnSteamworks = new SettingListItem(
      this._host,
      "_steamworks",
      this._host.engine.i18n("option.steamworks"),
      this._settings.turnOnSteamworks,
      {
        onCheck: () =>
          this._host.engine.imessage("status.auto.enable", [
            this._host.engine.i18n("option.steamworks"),
          ]),
        onUnCheck: () =>
          this._host.engine.imessage("status.auto.disable", [
            this._host.engine.i18n("option.steamworks"),
          ]),
      }
    );

    return [
      header,
      upgradeBuildingsElement.element,
      upgradeBuildingsList,
      nodeTurnOnSteamworks.element,
    ];
  }

  setState(state: BonfireSettings): void {
    this._settings.enabled = state.enabled;
    this._settings.trigger = state.trigger;
    this._settings.upgradeBuildings.enabled = state.upgradeBuildings.enabled;
    this._settings.turnOnSteamworks.enabled = state.turnOnSteamworks.enabled;

    for (const [name, option] of objectEntries(this._settings.items)) {
      option.enabled = state.items[name].enabled;
      option.max = state.items[name].max;
    }

    // Building upgrades.
    for (const [name, option] of objectEntries(this._settings.upgradeBuildings.items)) {
      option.enabled = state.upgradeBuildings.items[name].enabled;
    }
  }

  refreshUi(): void {
    this.setState(this._settings);

    mustExist(this._settings.$enabled).refreshUi();
    mustExist(this._settings.$trigger).refreshUi();
    mustExist(this._settings.upgradeBuildings.$enabled).refreshUi();
    mustExist(this._settings.turnOnSteamworks.$enabled).refreshUi();

    for (const [, option] of objectEntries(this._settings.items)) {
      mustExist(option.$enabled).refreshUi();
      mustExist(option.$max).refreshUi();
    }

    // Building upgrades.
    for (const [, option] of objectEntries(this._settings.upgradeBuildings.items)) {
      mustExist(option.$enabled).refreshUi();
    }
  }
}
