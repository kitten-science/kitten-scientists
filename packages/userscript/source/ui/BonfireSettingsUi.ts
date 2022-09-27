import { BonfireSettings } from "../options/BonfireSettings";
import { objectEntries } from "../tools/Entries";
import { ucfirst } from "../tools/Format";
import { mustExist } from "../tools/Maybe";
import { UserScript } from "../UserScript";
import { SettingsSectionUi } from "./SettingsSectionUi";

export class BonfireSettingsUi extends SettingsSectionUi<BonfireSettings> {
  readonly element: JQuery<HTMLElement>;

  private readonly _settings: BonfireSettings;

  private _buildingUpgradesExpanded = false;

  constructor(host: UserScript, settings: BonfireSettings) {
    super(host);

    this._settings = settings;

    const toggleName = "build";
    const label = ucfirst(this._host.i18n("ui.build"));

    // Create build items.
    // We create these in a list that is displayed when the user clicks the "items" button.
    const list = this._getOptionList(toggleName);

    // Our main element is a list item.
    const element = this._getSettingsPanel(toggleName, label, this._settings, list);
    this._settings.$enabled = element.checkbox;

    // Create "trigger" button in the item.
    this._settings.$trigger = this._registerTriggerButton(toggleName, label, this._settings);

    const optionButtons = [
      this._getHeader(this._host.i18n("$buildings.group.food")),
      this._getBuildOption(
        "field",
        this._settings.items.field,
        this._host.i18n("$buildings.field.label")
      ),
      this._getBuildOption(
        "pasture",
        this._settings.items.pasture,
        this._host.i18n("$buildings.pasture.label")
      ),
      this._getBuildOption(
        "solarFarm",
        this._settings.items.solarFarm,
        this._host.i18n("$buildings.solarfarm.label"),
        false,
        true
      ),
      this._getBuildOption(
        "aqueduct",
        this._settings.items.aqueduct,
        this._host.i18n("$buildings.aqueduct.label")
      ),
      this._getBuildOption(
        "hydroPlant",
        this._settings.items.hydroPlant,
        this._host.i18n("$buildings.hydroplant.label"),
        true,
        true
      ),

      this._getHeader(this._host.i18n("$buildings.group.population")),
      this._getBuildOption(
        "hut",
        this._settings.items.hut,
        this._host.i18n("$buildings.hut.label")
      ),
      this._getBuildOption(
        "logHouse",
        this._settings.items.logHouse,
        this._host.i18n("$buildings.logHouse.label")
      ),
      this._getBuildOption(
        "mansion",
        this._settings.items.mansion,
        this._host.i18n("$buildings.mansion.label"),
        true
      ),

      this._getHeader(this._host.i18n("$buildings.group.science")),
      this._getBuildOption(
        "library",
        this._settings.items.library,
        this._host.i18n("$buildings.library.label")
      ),
      this._getBuildOption(
        "dataCenter",
        this._settings.items.dataCenter,
        this._host.i18n("$buildings.dataCenter.label"),
        false,
        true
      ),
      this._getBuildOption(
        "academy",
        this._settings.items.academy,
        this._host.i18n("$buildings.academy.label")
      ),
      this._getBuildOption(
        "observatory",
        this._settings.items.observatory,
        `${this._host.i18n("$buildings.observatory.label")}`
      ),
      this._getBuildOption(
        "biolab",
        this._settings.items.biolab,
        this._host.i18n("$buildings.biolab.label"),
        true
      ),

      this._getHeader(this._host.i18n("$buildings.group.storage")),
      this._getBuildOption(
        "barn",
        this._settings.items.barn,
        this._host.i18n("$buildings.barn.label")
      ),
      this._getBuildOption(
        "harbor",
        this._settings.items.harbor,
        this._host.i18n("$buildings.harbor.label")
      ),
      this._getBuildOption(
        "warehouse",
        this._settings.items.warehouse,
        this._host.i18n("$buildings.warehouse.label"),
        true
      ),

      this._getHeader(this._host.i18n("$buildings.group.resource")),
      this._getBuildOption(
        "mine",
        this._settings.items.mine,
        this._host.i18n("$buildings.mine.label")
      ),
      this._getBuildOption(
        "quarry",
        this._settings.items.quarry,
        this._host.i18n("$buildings.quarry.label")
      ),
      this._getBuildOption(
        "lumberMill",
        this._settings.items.lumberMill,
        this._host.i18n("$buildings.lumberMill.label")
      ),
      this._getBuildOption(
        "oilWell",
        this._settings.items.oilWell,
        this._host.i18n("$buildings.oilWell.label")
      ),
      this._getBuildOption(
        "accelerator",
        this._settings.items.accelerator,
        this._host.i18n("$buildings.accelerator.label"),
        true
      ),

      this._getHeader(this._host.i18n("$buildings.group.industry")),
      this._getBuildOption(
        "steamworks",
        this._settings.items.steamworks,
        this._host.i18n("$buildings.steamworks.label")
      ),
      this._getBuildOption(
        "magneto",
        this._settings.items.magneto,
        this._host.i18n("$buildings.magneto.label")
      ),
      this._getBuildOption(
        "smelter",
        this._settings.items.smelter,
        this._host.i18n("$buildings.smelter.label")
      ),
      this._getBuildOption(
        "calciner",
        this._settings.items.calciner,
        this._host.i18n("$buildings.calciner.label")
      ),
      this._getBuildOption(
        "factory",
        this._settings.items.factory,
        this._host.i18n("$buildings.factory.label")
      ),
      this._getBuildOption(
        "reactor",
        this._settings.items.reactor,
        this._host.i18n("$buildings.reactor.label"),
        true
      ),

      this._getHeader(this._host.i18n("$buildings.group.culture")),
      this._getBuildOption(
        "amphitheatre",
        this._settings.items.amphitheatre,
        this._host.i18n("$buildings.amphitheatre.label")
      ),
      this._getBuildOption(
        "broadcastTower",
        this._settings.items.broadcastTower,
        this._host.i18n("$buildings.broadcasttower.label"),
        false,
        true
      ),
      this._getBuildOption(
        "chapel",
        this._settings.items.chapel,
        this._host.i18n("$buildings.chapel.label")
      ),
      this._getBuildOption(
        "temple",
        this._settings.items.temple,
        this._host.i18n("$buildings.temple.label"),
        true
      ),

      this._getHeader(this._host.i18n("$buildings.group.other")),
      this._getBuildOption(
        "workshop",
        this._settings.items.workshop,
        this._host.i18n("$buildings.workshop.label")
      ),
      this._getBuildOption(
        "tradepost",
        this._settings.items.tradepost,
        this._host.i18n("$buildings.tradepost.label")
      ),
      this._getBuildOption(
        "mint",
        this._settings.items.mint,
        this._host.i18n("$buildings.mint.label")
      ),
      this._getBuildOption(
        "brewery",
        this._settings.items.brewery,
        this._host.i18n("$buildings.brewery.label"),
        true
      ),

      this._getHeader(this._host.i18n("$buildings.group.megastructures")),
      this._getBuildOption(
        "ziggurat",
        this._settings.items.ziggurat,
        this._host.i18n("$buildings.ziggurat.label")
      ),
      this._getBuildOption(
        "chronosphere",
        this._settings.items.chronosphere,
        this._host.i18n("$buildings.chronosphere.label")
      ),
      this._getBuildOption(
        "aiCore",
        this._settings.items.aiCore,
        this._host.i18n("$buildings.aicore.label"),
        true
      ),

      this._getHeader(this._host.i18n("$buildings.group.zebraBuildings")),
      this._getBuildOption(
        "zebraOutpost",
        this._settings.items.zebraOutpost,
        this._host.i18n("$buildings.zebraOutpost.label")
      ),
      this._getBuildOption(
        "zebraWorkshop",
        this._settings.items.zebraWorkshop,
        this._host.i18n("$buildings.zebraWorkshop.label")
      ),
      this._getBuildOption(
        "zebraForge",
        this._settings.items.zebraForge,
        this._host.i18n("$buildings.zebraForge.label"),
        true
      ),
    ];
    list.append(optionButtons);

    const additionOptions = this._getAdditionOptions();

    element.panel.append(this._settings.$trigger);
    element.panel.append(list);
    list.append(additionOptions);

    this.element = element.panel;
  }

  private _getAdditionOptions(): Array<JQuery<HTMLElement>> {
    const header = this._getHeader("Additional options");

    const upgradeBuildingsButton = this._getOption(
      "buildings",
      this._settings.upgradeBuildings,
      this._host.i18n("ui.upgrade.buildings"),
      false,
      false,
      {
        onCheck: () => {
          this._host.updateOptions(() => (this._settings.upgradeBuildings.enabled = true));
          this._host.imessage("status.auto.enable", [this._host.i18n("ui.upgrade.buildings")]);
        },
        onUnCheck: () => {
          this._host.updateOptions(() => (this._settings.upgradeBuildings.enabled = false));
          this._host.imessage("status.auto.disable", [this._host.i18n("ui.upgrade.buildings")]);
        },
      }
    );

    const upgradeBuildingsList = $("<ul/>", {
      id: "items-list-buildings",
      css: { display: "none", paddingLeft: "20px" },
    });

    const upgradeBuildingsButtons = [];
    for (const [upgradeName, upgrade] of objectEntries(this._settings.upgradeBuildings.items)) {
      const label = this._host.i18n(`$buildings.${upgradeName}.label`);
      const button = this._getOption(`building-${upgradeName}`, upgrade, label, false, false, {
        onCheck: () => {
          this._host.updateOptions(() => (upgrade.enabled = true));
          this._host.imessage("status.auto.enable", [label]);
        },
        onUnCheck: () => {
          this._host.updateOptions(() => (upgrade.enabled = false));
          this._host.imessage("status.auto.disable", [label]);
        },
      });

      upgradeBuildingsButtons.push({ label: label, button: button });
    }
    // Ensure buttons are added into UI with their labels alphabetized.
    upgradeBuildingsButtons.sort((a, b) => a.label.localeCompare(b.label));
    upgradeBuildingsButtons.forEach(button => upgradeBuildingsList.append(button.button));

    const upgradeBuildingsItemsButton = this._getItemsToggle("buildings-show");
    upgradeBuildingsItemsButton.on("click", () => {
      upgradeBuildingsList.toggle();

      this._buildingUpgradesExpanded = !this._buildingUpgradesExpanded;

      upgradeBuildingsItemsButton.text(this._buildingUpgradesExpanded ? "-" : "+");
      upgradeBuildingsItemsButton.prop(
        "title",
        this._buildingUpgradesExpanded
          ? this._host.i18n("ui.itemsHide")
          : this._host.i18n("ui.itemsShow")
      );
    });
    upgradeBuildingsButton.append(upgradeBuildingsItemsButton, upgradeBuildingsList);

    const nodeTurnOnSteamworks = this._getOption(
      "_steamworks",
      this._settings.turnOnSteamworks,
      this._host.i18n("option.steamworks"),
      false,
      false,
      {
        onCheck: () => {
          this._host.updateOptions(() => (this._settings.turnOnSteamworks.enabled = true));
          this._host.imessage("status.auto.enable", [this._host.i18n("option.steamworks")]);
        },
        onUnCheck: () => {
          this._host.updateOptions(() => (this._settings.turnOnSteamworks.enabled = false));
          this._host.imessage("status.auto.disable", [this._host.i18n("option.steamworks")]);
        },
      }
    );

    return [header, upgradeBuildingsButton, nodeTurnOnSteamworks];
  }

  getState(): BonfireSettings {
    return new BonfireSettings(
      this._settings.enabled,
      this._settings.trigger,
      this._settings.items,
      this._settings.turnOnSteamworks,
      this._settings.upgradeBuildings
    );
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
    mustExist(this._settings.$enabled).prop("checked", this._settings.enabled);
    mustExist(this._settings.$trigger)[0].title = this._renderPercentage(this._settings.trigger);
    mustExist(this._settings.upgradeBuildings.$enabled).prop(
      "checked",
      this._settings.upgradeBuildings.enabled
    );
    mustExist(this._settings.turnOnSteamworks.$enabled).prop(
      "checked",
      this._settings.turnOnSteamworks.enabled
    );

    for (const [name, option] of objectEntries(this._settings.items)) {
      mustExist(option.$enabled).prop("checked", this._settings.items[name].enabled);
      mustExist(option.$max).text(
        this._host.i18n("ui.max", [this._renderLimit(this._settings.items[name].max)])
      );
    }

    // Building upgrades.
    for (const [name, option] of objectEntries(this._settings.upgradeBuildings.items)) {
      mustExist(option.$enabled).prop(
        "checked",
        this._settings.upgradeBuildings.items[name].enabled
      );
    }
  }
}
