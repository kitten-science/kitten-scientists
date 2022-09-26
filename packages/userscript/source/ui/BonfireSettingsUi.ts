import { BonfireAdditionSettings, BonfireSettings } from "../options/BonfireSettings";
import { objectEntries } from "../tools/Entries";
import { ucfirst } from "../tools/Format";
import { mustExist } from "../tools/Maybe";
import { UserScript } from "../UserScript";
import { SettingsSectionUi } from "./SettingsSectionUi";

export class BonfireSettingsUi extends SettingsSectionUi<BonfireSettings> {
  readonly element: JQuery<HTMLElement>;

  private readonly _options: BonfireSettings;

  private _buildingUpgradesExpanded = false;

  constructor(host: UserScript, options: BonfireSettings = host.options.auto.bonfire) {
    super(host);

    this._options = options;

    const toggleName = "build";
    const label = ucfirst(this._host.i18n("ui.build"));

    // Create build items.
    // We create these in a list that is displayed when the user clicks the "items" button.
    const list = this._getOptionList(toggleName);

    // Our main element is a list item.
    const element = this._getSettingsPanel(toggleName, label, this._options, list);
    this._options.$enabled = element.checkbox;

    // Create "trigger" button in the item.
    this._options.$trigger = this._registerTriggerButton(toggleName, label, this._options);

    const optionButtons = [
      this._getHeader(this._host.i18n("$buildings.group.food")),
      this._getBuildOption(
        "field",
        this._options.items.field,
        this._host.i18n("$buildings.field.label")
      ),
      this._getBuildOption(
        "pasture",
        this._options.items.pasture,
        this._host.i18n("$buildings.pasture.label")
      ),
      this._getBuildOption(
        "solarFarm",
        this._options.items.solarFarm,
        this._host.i18n("$buildings.solarfarm.label"),
        false,
        true
      ),
      this._getBuildOption(
        "aqueduct",
        this._options.items.aqueduct,
        this._host.i18n("$buildings.aqueduct.label")
      ),
      this._getBuildOption(
        "hydroPlant",
        this._options.items.hydroPlant,
        this._host.i18n("$buildings.hydroplant.label"),
        true,
        true
      ),

      this._getHeader(this._host.i18n("$buildings.group.population")),
      this._getBuildOption("hut", this._options.items.hut, this._host.i18n("$buildings.hut.label")),
      this._getBuildOption(
        "logHouse",
        this._options.items.logHouse,
        this._host.i18n("$buildings.logHouse.label")
      ),
      this._getBuildOption(
        "mansion",
        this._options.items.mansion,
        this._host.i18n("$buildings.mansion.label"),
        true
      ),

      this._getHeader(this._host.i18n("$buildings.group.science")),
      this._getBuildOption(
        "library",
        this._options.items.library,
        this._host.i18n("$buildings.library.label")
      ),
      this._getBuildOption(
        "dataCenter",
        this._options.items.dataCenter,
        this._host.i18n("$buildings.dataCenter.label"),
        false,
        true
      ),
      this._getBuildOption(
        "academy",
        this._options.items.academy,
        this._host.i18n("$buildings.academy.label")
      ),
      this._getBuildOption(
        "observatory",
        this._options.items.observatory,
        `${this._host.i18n("$buildings.observatory.label")}`
      ),
      this._getBuildOption(
        "biolab",
        this._options.items.biolab,
        this._host.i18n("$buildings.biolab.label"),
        true
      ),

      this._getHeader(this._host.i18n("$buildings.group.storage")),
      this._getBuildOption(
        "barn",
        this._options.items.barn,
        this._host.i18n("$buildings.barn.label")
      ),
      this._getBuildOption(
        "harbor",
        this._options.items.harbor,
        this._host.i18n("$buildings.harbor.label")
      ),
      this._getBuildOption(
        "warehouse",
        this._options.items.warehouse,
        this._host.i18n("$buildings.warehouse.label"),
        true
      ),

      this._getHeader(this._host.i18n("$buildings.group.resource")),
      this._getBuildOption(
        "mine",
        this._options.items.mine,
        this._host.i18n("$buildings.mine.label")
      ),
      this._getBuildOption(
        "quarry",
        this._options.items.quarry,
        this._host.i18n("$buildings.quarry.label")
      ),
      this._getBuildOption(
        "lumberMill",
        this._options.items.lumberMill,
        this._host.i18n("$buildings.lumberMill.label")
      ),
      this._getBuildOption(
        "oilWell",
        this._options.items.oilWell,
        this._host.i18n("$buildings.oilWell.label")
      ),
      this._getBuildOption(
        "accelerator",
        this._options.items.accelerator,
        this._host.i18n("$buildings.accelerator.label"),
        true
      ),

      this._getHeader(this._host.i18n("$buildings.group.industry")),
      this._getBuildOption(
        "steamworks",
        this._options.items.steamworks,
        this._host.i18n("$buildings.steamworks.label")
      ),
      this._getBuildOption(
        "magneto",
        this._options.items.magneto,
        this._host.i18n("$buildings.magneto.label")
      ),
      this._getBuildOption(
        "smelter",
        this._options.items.smelter,
        this._host.i18n("$buildings.smelter.label")
      ),
      this._getBuildOption(
        "calciner",
        this._options.items.calciner,
        this._host.i18n("$buildings.calciner.label")
      ),
      this._getBuildOption(
        "factory",
        this._options.items.factory,
        this._host.i18n("$buildings.factory.label")
      ),
      this._getBuildOption(
        "reactor",
        this._options.items.reactor,
        this._host.i18n("$buildings.reactor.label"),
        true
      ),

      this._getHeader(this._host.i18n("$buildings.group.culture")),
      this._getBuildOption(
        "amphitheatre",
        this._options.items.amphitheatre,
        this._host.i18n("$buildings.amphitheatre.label")
      ),
      this._getBuildOption(
        "broadcastTower",
        this._options.items.broadcastTower,
        this._host.i18n("$buildings.broadcasttower.label"),
        false,
        true
      ),
      this._getBuildOption(
        "chapel",
        this._options.items.chapel,
        this._host.i18n("$buildings.chapel.label")
      ),
      this._getBuildOption(
        "temple",
        this._options.items.temple,
        this._host.i18n("$buildings.temple.label"),
        true
      ),

      this._getHeader(this._host.i18n("$buildings.group.other")),
      this._getBuildOption(
        "workshop",
        this._options.items.workshop,
        this._host.i18n("$buildings.workshop.label")
      ),
      this._getBuildOption(
        "tradepost",
        this._options.items.tradepost,
        this._host.i18n("$buildings.tradepost.label")
      ),
      this._getBuildOption(
        "mint",
        this._options.items.mint,
        this._host.i18n("$buildings.mint.label")
      ),
      this._getBuildOption(
        "brewery",
        this._options.items.brewery,
        this._host.i18n("$buildings.brewery.label"),
        true
      ),

      this._getHeader(this._host.i18n("$buildings.group.megastructures")),
      this._getBuildOption(
        "ziggurat",
        this._options.items.ziggurat,
        this._host.i18n("$buildings.ziggurat.label")
      ),
      this._getBuildOption(
        "chronosphere",
        this._options.items.chronosphere,
        this._host.i18n("$buildings.chronosphere.label")
      ),
      this._getBuildOption(
        "aiCore",
        this._options.items.aiCore,
        this._host.i18n("$buildings.aicore.label"),
        true
      ),

      this._getHeader(this._host.i18n("$buildings.group.zebraBuildings")),
      this._getBuildOption(
        "zebraOutpost",
        this._options.items.zebraOutpost,
        this._host.i18n("$buildings.zebraOutpost.label")
      ),
      this._getBuildOption(
        "zebraWorkshop",
        this._options.items.zebraWorkshop,
        this._host.i18n("$buildings.zebraWorkshop.label")
      ),
      this._getBuildOption(
        "zebraForge",
        this._options.items.zebraForge,
        this._host.i18n("$buildings.zebraForge.label"),
        true
      ),
    ];
    list.append(optionButtons);

    const additionOptions = this.getAdditionOptions(this._options.addition);

    element.panel.append(this._options.$trigger);
    element.panel.append(list);
    list.append(additionOptions);

    this.element = element.panel;
  }

  getAdditionOptions(addition: BonfireAdditionSettings): Array<JQuery<HTMLElement>> {
    const header = this._getHeader("Additional options");

    const upgradeBuildingsButton = this._getOption(
      "buildings",
      addition.upgradeBuildings,
      this._host.i18n("ui.upgrade.buildings"),
      false,
      false,
      {
        onCheck: () => {
          this._host.updateOptions(() => (addition.upgradeBuildings.enabled = true));
          this._host.imessage("status.auto.enable", [this._host.i18n("ui.upgrade.buildings")]);
        },
        onUnCheck: () => {
          this._host.updateOptions(() => (addition.upgradeBuildings.enabled = false));
          this._host.imessage("status.auto.disable", [this._host.i18n("ui.upgrade.buildings")]);
        },
      }
    );

    const upgradeBuildingsList = $("<ul/>", {
      id: "items-list-buildings",
      css: { display: "none", paddingLeft: "20px" },
    });

    const upgradeBuildingsButtons = [];
    for (const [upgradeName, upgrade] of objectEntries(
      this._options.addition.upgradeBuildings.items
    )) {
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
      addition.turnOnSteamworks,
      this._host.i18n("option.steamworks"),
      false,
      false,
      {
        onCheck: () => {
          this._host.updateOptions(() => (addition.turnOnSteamworks.enabled = true));
          this._host.imessage("status.auto.enable", [this._host.i18n("option.steamworks")]);
        },
        onUnCheck: () => {
          this._host.updateOptions(() => (addition.turnOnSteamworks.enabled = false));
          this._host.imessage("status.auto.disable", [this._host.i18n("option.steamworks")]);
        },
      }
    );

    return [header, upgradeBuildingsButton, nodeTurnOnSteamworks];
  }

  getState(): BonfireSettings {
    return new BonfireSettings(
      this._options.enabled,
      this._options.trigger,
      this._options.items,
      this._options.addition.turnOnSteamworks,
      this._options.addition.upgradeBuildings
    );
  }

  setState(state: BonfireSettings): void {
    this._options.enabled = state.enabled;
    this._options.trigger = state.trigger;
    this._options.addition.upgradeBuildings.enabled = state.addition.upgradeBuildings.enabled;
    this._options.addition.turnOnSteamworks.enabled = state.addition.turnOnSteamworks.enabled;

    for (const [name, option] of objectEntries(this._options.items)) {
      option.enabled = state.items[name].enabled;
      option.max = state.items[name].max;
    }

    // Building upgrades.
    for (const [name, option] of objectEntries(this._options.addition.upgradeBuildings.items)) {
      option.enabled = state.addition.upgradeBuildings.items[name].enabled;
    }
  }

  refreshUi(): void {
    mustExist(this._options.$enabled).prop("checked", this._options.enabled);
    mustExist(this._options.$trigger)[0].title = this._renderPercentage(this._options.trigger);
    mustExist(this._options.addition.upgradeBuildings.$enabled).prop(
      "checked",
      this._options.addition.upgradeBuildings.enabled
    );
    mustExist(this._options.addition.turnOnSteamworks.$enabled).prop(
      "checked",
      this._options.addition.turnOnSteamworks.enabled
    );

    for (const [name, option] of objectEntries(this._options.items)) {
      mustExist(option.$enabled).prop("checked", this._options.items[name].enabled);
      mustExist(option.$max).text(
        this._host.i18n("ui.max", [this._renderLimit(this._options.items[name].max)])
      );
    }

    // Building upgrades.
    for (const [name, option] of objectEntries(this._options.addition.upgradeBuildings.items)) {
      mustExist(option.$enabled).prop(
        "checked",
        this._options.addition.upgradeBuildings.items[name].enabled
      );
    }
  }
}
