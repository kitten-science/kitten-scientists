import { SettingTrigger } from "../options/Settings";
import {
  CycleIndices,
  TimeControlResourcesSettingsItem,
  TimeControlSettings,
  TimeControlTimeSkipSettings,
} from "../options/TimeControlSettings";
import { objectEntries } from "../tools/Entries";
import { ucfirst } from "../tools/Format";
import { Maybe, mustExist } from "../tools/Maybe";
import { Season } from "../types";
import { UserScript } from "../UserScript";
import { SettingsSectionUi } from "./SettingsSectionUi";
import { SettingTriggerUi } from "./SettingTriggerUi";
import { SettingUi } from "./SettingUi";

export class TimeControlSettingsUi extends SettingsSectionUi {
  readonly element: JQuery<HTMLElement>;

  private readonly _settings: TimeControlSettings;

  private _resourcesList: Maybe<JQuery<HTMLElement>>;

  constructor(host: UserScript, settings: TimeControlSettings) {
    super(host);

    this._settings = settings;

    const toggleName = "timeCtrl";
    const label = ucfirst(this._host.i18n("ui.timeCtrl"));

    // Create build items.
    // We create these in a list that is displayed when the user clicks the "items" button.
    const list = this._getItemsList(toggleName);

    // Our main element is a list item.
    const element = this._getSettingsPanel(toggleName, label, this._settings, list);
    this._settings.$enabled = element.checkbox;

    const optionButtons = [
      this._getOptionAccelerateTime(
        "accelerateTime",
        this._settings.accelerateTime,
        this._host.i18n("option.accelerate")
      ),

      this._getOptionTimeSkip(
        "timeSkip",
        this._settings.timeSkip,
        this._host.i18n("option.time.skip")
      ),

      this._getOptionReset("reset", this._settings.reset, this._host.i18n("option.time.reset")),
    ];

    list.append(...optionButtons);

    element.panel.append(list);

    this.element = element.panel;
  }

  private _getOptionTimeSkip(
    name: string,
    option: TimeControlSettings["timeSkip"],
    label: string
  ): JQuery<HTMLElement> {
    const element = SettingTriggerUi.make(this._host, name, option, label);

    const maximumButton = $('<div class="ks-icon-button"/>', {
      id: "set-timeSkip-maximum",
      title: this._host.i18n("ui.maximum"),
    })
      .text("⍐")
      .data("option", option);
    option.$maximum = maximumButton;

    maximumButton.on("click", () => {
      const value = SettingsSectionUi.promptLimit(
        this._host.i18n("ui.max.set", [this._host.i18n("option.time.skip")]),
        option.maximum.toFixed(0)
      );

      if (value !== null) {
        this._host.updateOptions(() => (option.maximum = value));
        maximumButton[0].title = option.maximum.toFixed(0);
      }
    });

    const cyclesButton = $('<div class="ks-icon-button"/>', {
      id: `toggle-cycle-${name}`,
      title: this._host.i18n("ui.cycles"),
    }).text("↻");

    const cyclesList = SettingsSectionUi.getList(`cycles-list-${name}`);

    for (
      let cycleIndex = 0;
      cycleIndex < this._host.gamePage.calendar.cycles.length;
      ++cycleIndex
    ) {
      cyclesList.append(this._getCycle(cycleIndex as CycleIndices, option));
    }

    const seasonsButton = $('<div class="ks-icon-button"/>', {
      id: `toggle-seasons-${name}`,
      title: this._host.i18n("trade.seasons"),
    }).text("🗓");

    const seasonsList = SettingsSectionUi.getList(`seasons-list-${name}`);

    // fill out the list with seasons
    seasonsList.append(this._getSeasonForTimeSkip("spring", option));
    seasonsList.append(this._getSeasonForTimeSkip("summer", option));
    seasonsList.append(this._getSeasonForTimeSkip("autumn", option));
    seasonsList.append(this._getSeasonForTimeSkip("winter", option));

    cyclesButton.on("click", function () {
      cyclesList.toggle();
      seasonsList.toggle(false);
    });

    seasonsButton.on("click", function () {
      cyclesList.toggle(false);
      seasonsList.toggle();
    });

    element.append(cyclesButton, seasonsButton, maximumButton, cyclesList, seasonsList);

    return element;
  }

  private _getOptionReset(
    name: string,
    option: TimeControlSettings["reset"],
    label: string
  ): JQuery<HTMLElement> {
    const element = SettingUi.make(this._host, name, option, label);

    // Bonfire reset options
    const resetBuildList = this._getItemsList("reset-build");
    resetBuildList.append(
      this._getResetOption(
        "hut",
        "build",
        this._settings.buildItems.hut,
        this._host.i18n("$buildings.hut.label")
      ),
      this._getResetOption(
        "logHouse",
        "build",
        this._settings.buildItems.logHouse,
        this._host.i18n("$buildings.logHouse.label")
      ),
      this._getResetOption(
        "mansion",
        "build",
        this._settings.buildItems.mansion,
        this._host.i18n("$buildings.mansion.label"),
        true
      ),

      this._getResetOption(
        "workshop",
        "build",
        this._settings.buildItems.workshop,
        this._host.i18n("$buildings.workshop.label")
      ),
      this._getResetOption(
        "factory",
        "build",
        this._settings.buildItems.factory,
        this._host.i18n("$buildings.factory.label"),
        true
      ),

      this._getResetOption(
        "field",
        "build",
        this._settings.buildItems.field,
        this._host.i18n("$buildings.field.label")
      ),
      this._getResetOption(
        "pasture",
        "build",
        this._settings.buildItems.pasture,
        this._host.i18n("$buildings.pasture.label")
      ),
      this._getResetOption(
        "solarFarm",
        "build",
        this._settings.buildItems.solarFarm,
        this._host.i18n("$buildings.solarfarm.label")
      ),
      this._getResetOption(
        "mine",
        "build",
        this._settings.buildItems.mine,
        this._host.i18n("$buildings.mine.label")
      ),
      this._getResetOption(
        "lumberMill",
        "build",
        this._settings.buildItems.lumberMill,
        this._host.i18n("$buildings.lumberMill.label")
      ),
      this._getResetOption(
        "aqueduct",
        "build",
        this._settings.buildItems.aqueduct,
        this._host.i18n("$buildings.aqueduct.label")
      ),
      this._getResetOption(
        "hydroPlant",
        "build",
        this._settings.buildItems.hydroPlant,
        this._host.i18n("$buildings.hydroplant.label")
      ),
      this._getResetOption(
        "oilWell",
        "build",
        this._settings.buildItems.oilWell,
        this._host.i18n("$buildings.oilWell.label")
      ),
      this._getResetOption(
        "quarry",
        "build",
        this._settings.buildItems.quarry,
        this._host.i18n("$buildings.quarry.label"),
        true
      ),

      this._getResetOption(
        "smelter",
        "build",
        this._settings.buildItems.smelter,
        this._host.i18n("$buildings.smelter.label")
      ),
      this._getResetOption(
        "biolab",
        "build",
        this._settings.buildItems.biolab,
        this._host.i18n("$buildings.biolab.label")
      ),
      this._getResetOption(
        "calciner",
        "build",
        this._settings.buildItems.calciner,
        this._host.i18n("$buildings.calciner.label")
      ),
      this._getResetOption(
        "reactor",
        "build",
        this._settings.buildItems.reactor,
        this._host.i18n("$buildings.reactor.label")
      ),
      this._getResetOption(
        "accelerator",
        "build",
        this._settings.buildItems.accelerator,
        this._host.i18n("$buildings.accelerator.label")
      ),
      this._getResetOption(
        "steamworks",
        "build",
        this._settings.buildItems.steamworks,
        this._host.i18n("$buildings.steamworks.label")
      ),
      this._getResetOption(
        "magneto",
        "build",
        this._settings.buildItems.magneto,
        this._host.i18n("$buildings.magneto.label"),
        true
      ),

      this._getResetOption(
        "library",
        "build",
        this._settings.buildItems.library,
        this._host.i18n("$buildings.library.label")
      ),
      this._getResetOption(
        "dataCenter",
        "build",
        this._settings.buildItems.dataCenter,
        this._host.i18n("$buildings.dataCenter.label")
      ),
      this._getResetOption(
        "academy",
        "build",
        this._settings.buildItems.academy,
        this._host.i18n("$buildings.academy.label")
      ),
      this._getResetOption(
        "observatory",
        "build",
        this._settings.buildItems.observatory,
        this._host.i18n("$buildings.observatory.label"),
        true
      ),

      this._getResetOption(
        "amphitheatre",
        "build",
        this._settings.buildItems.amphitheatre,
        this._host.i18n("$buildings.amphitheatre.label")
      ),
      this._getResetOption(
        "broadcastTower",
        "build",
        this._settings.buildItems.broadcastTower,
        this._host.i18n("$buildings.broadcasttower.label")
      ),
      this._getResetOption(
        "tradepost",
        "build",
        this._settings.buildItems.tradepost,
        this._host.i18n("$buildings.tradepost.label")
      ),
      this._getResetOption(
        "chapel",
        "build",
        this._settings.buildItems.chapel,
        this._host.i18n("$buildings.chapel.label")
      ),
      this._getResetOption(
        "temple",
        "build",
        this._settings.buildItems.temple,
        this._host.i18n("$buildings.temple.label")
      ),
      this._getResetOption(
        "mint",
        "build",
        this._settings.buildItems.mint,
        this._host.i18n("$buildings.mint.label")
      ),
      this._getResetOption(
        "ziggurat",
        "build",
        this._settings.buildItems.ziggurat,
        this._host.i18n("$buildings.ziggurat.label")
      ),
      this._getResetOption(
        "chronosphere",
        "build",
        this._settings.buildItems.chronosphere,
        this._host.i18n("$buildings.chronosphere.label")
      ),
      this._getResetOption(
        "aiCore",
        "build",
        this._settings.buildItems.aiCore,
        this._host.i18n("$buildings.aicore.label")
      ),
      this._getResetOption(
        "brewery",
        "build",
        this._settings.buildItems.brewery,
        this._host.i18n("$buildings.brewery.label"),
        true
      ),

      this._getResetOption(
        "barn",
        "build",
        this._settings.buildItems.barn,
        this._host.i18n("$buildings.barn.label")
      ),
      this._getResetOption(
        "harbor",
        "build",
        this._settings.buildItems.harbor,
        this._host.i18n("$buildings.harbor.label")
      ),
      this._getResetOption(
        "warehouse",
        "build",
        this._settings.buildItems.warehouse,
        this._host.i18n("$buildings.warehouse.label"),
        true
      ),

      this._getResetOption(
        "zebraOutpost",
        "build",
        this._settings.buildItems.zebraOutpost,
        this._host.i18n("$buildings.zebraOutpost.label")
      ),
      this._getResetOption(
        "zebraWorkshop",
        "build",
        this._settings.buildItems.zebraWorkshop,
        this._host.i18n("$buildings.zebraWorkshop.label")
      ),
      this._getResetOption(
        "zebraForge",
        "build",
        this._settings.buildItems.zebraForge,
        this._host.i18n("$buildings.zebraForge.label")
      )
    );

    // Space reset options
    const resetSpaceList = this._getItemsList("reset-space");
    resetSpaceList.append(
      this._getResetOption(
        "spaceElevator",
        "space",
        this._settings.spaceItems.spaceElevator,
        this._host.i18n("$space.planet.cath.spaceElevator.label")
      ),
      this._getResetOption(
        "sattelite",
        "space",
        this._settings.spaceItems.sattelite,
        this._host.i18n("$space.planet.cath.sattelite.label")
      ),
      this._getResetOption(
        "spaceStation",
        "space",
        this._settings.spaceItems.spaceStation,
        this._host.i18n("$space.planet.cath.spaceStation.label"),
        true
      ),

      this._getResetOption(
        "moonOutpost",
        "space",
        this._settings.spaceItems.moonOutpost,
        this._host.i18n("$space.planet.moon.moonOutpost.label")
      ),
      this._getResetOption(
        "moonBase",
        "space",
        this._settings.spaceItems.moonBase,
        this._host.i18n("$space.planet.moon.moonBase.label"),
        true
      ),

      this._getResetOption(
        "planetCracker",
        "space",
        this._settings.spaceItems.planetCracker,
        this._host.i18n("$space.planet.dune.planetCracker.label")
      ),
      this._getResetOption(
        "hydrofracturer",
        "space",
        this._settings.spaceItems.hydrofracturer,
        this._host.i18n("$space.planet.dune.hydrofracturer.label")
      ),
      this._getResetOption(
        "spiceRefinery",
        "space",
        this._settings.spaceItems.spiceRefinery,
        this._host.i18n("$space.planet.dune.spiceRefinery.label"),
        true
      ),

      this._getResetOption(
        "researchVessel",
        "space",
        this._settings.spaceItems.researchVessel,
        this._host.i18n("$space.planet.piscine.researchVessel.label")
      ),
      this._getResetOption(
        "orbitalArray",
        "space",
        this._settings.spaceItems.orbitalArray,
        this._host.i18n("$space.planet.piscine.orbitalArray.label"),
        true
      ),

      this._getResetOption(
        "sunlifter",
        "space",
        this._settings.spaceItems.sunlifter,
        this._host.i18n("$space.planet.helios.sunlifter.label")
      ),
      this._getResetOption(
        "containmentChamber",
        "space",
        this._settings.spaceItems.containmentChamber,
        this._host.i18n("$space.planet.helios.containmentChamber.label")
      ),
      this._getResetOption(
        "heatsink",
        "space",
        this._settings.spaceItems.heatsink,
        this._host.i18n("$space.planet.helios.heatsink.label")
      ),
      this._getResetOption(
        "sunforge",
        "space",
        this._settings.spaceItems.sunforge,
        this._host.i18n("$space.planet.helios.sunforge.label"),
        true
      ),

      this._getResetOption(
        "cryostation",
        "space",
        this._settings.spaceItems.cryostation,
        this._host.i18n("$space.planet.terminus.cryostation.label"),
        true
      ),

      this._getResetOption(
        "spaceBeacon",
        "space",
        this._settings.spaceItems.spaceBeacon,
        this._host.i18n("$space.planet.kairo.spaceBeacon.label"),
        true
      ),

      this._getResetOption(
        "terraformingStation",
        "space",
        this._settings.spaceItems.terraformingStation,
        this._host.i18n("$space.planet.yarn.terraformingStation.label")
      ),
      this._getResetOption(
        "hydroponics",
        "space",
        this._settings.spaceItems.hydroponics,
        this._host.i18n("$space.planet.yarn.hydroponics.label"),
        true
      ),

      this._getResetOption(
        "hrHarvester",
        "space",
        this._settings.spaceItems.hrHarvester,
        this._host.i18n("$space.planet.umbra.hrHarvester.label"),
        true
      ),

      this._getResetOption(
        "entangler",
        "space",
        this._settings.spaceItems.entangler,
        this._host.i18n("$space.planet.charon.entangler.label"),
        true
      ),

      this._getResetOption(
        "tectonic",
        "space",
        this._settings.spaceItems.tectonic,
        this._host.i18n("$space.planet.centaurusSystem.tectonic.label")
      ),
      this._getResetOption(
        "moltenCore",
        "space",
        this._settings.spaceItems.moltenCore,
        this._host.i18n("$space.planet.centaurusSystem.moltenCore.label")
      )
    );

    // Resources list
    const resetResourcesList = this._getResourceOptions();
    for (const [item, resource] of objectEntries(this._settings.resources)) {
      resetResourcesList.append(
        this._addNewResourceOptionForReset(item, item, resource, (_name, _resource) => {
          delete this._settings.resources[_name];
        })
      );
      this._setStockValue(item, resource.stock, true);
    }

    // Religion reset options.
    const resetReligionList = this._getItemsList("reset-religion");
    resetReligionList.append(
      this._getResetOption(
        "unicornPasture",
        "faith",
        this._settings.religionItems.unicornPasture,
        this._host.i18n("$buildings.unicornPasture.label")
      ),
      this._getResetOption(
        "unicornTomb",
        "faith",
        this._settings.religionItems.unicornTomb,
        this._host.i18n("$religion.zu.unicornTomb.label")
      ),
      this._getResetOption(
        "ivoryTower",
        "faith",
        this._settings.religionItems.ivoryTower,
        this._host.i18n("$religion.zu.ivoryTower.label")
      ),
      this._getResetOption(
        "ivoryCitadel",
        "faith",
        this._settings.religionItems.ivoryCitadel,
        this._host.i18n("$religion.zu.ivoryCitadel.label")
      ),
      this._getResetOption(
        "skyPalace",
        "faith",
        this._settings.religionItems.skyPalace,
        this._host.i18n("$religion.zu.skyPalace.label")
      ),
      this._getResetOption(
        "unicornUtopia",
        "faith",
        this._settings.religionItems.unicornUtopia,
        this._host.i18n("$religion.zu.unicornUtopia.label")
      ),
      this._getResetOption(
        "sunspire",
        "faith",
        this._settings.religionItems.sunspire,
        this._host.i18n("$religion.zu.sunspire.label"),
        true
      ),

      this._getResetOption(
        "marker",
        "faith",
        this._settings.religionItems.marker,
        this._host.i18n("$religion.zu.marker.label")
      ),
      this._getResetOption(
        "unicornGraveyard",
        "faith",
        this._settings.religionItems.unicornGraveyard,
        this._host.i18n("$religion.zu.unicornGraveyard.label")
      ),
      this._getResetOption(
        "unicornNecropolis",
        "faith",
        this._settings.religionItems.unicornNecropolis,
        this._host.i18n("$religion.zu.unicornNecropolis.label")
      ),
      this._getResetOption(
        "blackPyramid",
        "faith",
        this._settings.religionItems.blackPyramid,
        this._host.i18n("$religion.zu.blackPyramid.label"),
        true
      ),

      this._getResetOption(
        "solarchant",
        "faith",
        this._settings.religionItems.solarchant,
        this._host.i18n("$religion.ru.solarchant.label")
      ),
      this._getResetOption(
        "scholasticism",
        "faith",
        this._settings.religionItems.scholasticism,
        this._host.i18n("$religion.ru.scholasticism.label")
      ),
      this._getResetOption(
        "goldenSpire",
        "faith",
        this._settings.religionItems.goldenSpire,
        this._host.i18n("$religion.ru.goldenSpire.label")
      ),
      this._getResetOption(
        "sunAltar",
        "faith",
        this._settings.religionItems.sunAltar,
        this._host.i18n("$religion.ru.sunAltar.label")
      ),
      this._getResetOption(
        "stainedGlass",
        "faith",
        this._settings.religionItems.stainedGlass,
        this._host.i18n("$religion.ru.stainedGlass.label")
      ),
      this._getResetOption(
        "solarRevolution",
        "faith",
        this._settings.religionItems.solarRevolution,
        this._host.i18n("$religion.ru.solarRevolution.label")
      ),
      this._getResetOption(
        "basilica",
        "faith",
        this._settings.religionItems.basilica,
        this._host.i18n("$religion.ru.basilica.label")
      ),
      this._getResetOption(
        "templars",
        "faith",
        this._settings.religionItems.templars,
        this._host.i18n("$religion.ru.templars.label")
      ),
      this._getResetOption(
        "apocripha",
        "faith",
        this._settings.religionItems.apocripha,
        this._host.i18n("$religion.ru.apocripha.label")
      ),
      this._getResetOption(
        "transcendence",
        "faith",
        this._settings.religionItems.transcendence,
        this._host.i18n("$religion.ru.transcendence.label"),
        true
      ),

      this._getResetOption(
        "blackObelisk",
        "faith",
        this._settings.religionItems.blackObelisk,
        this._host.i18n("$religion.tu.blackObelisk.label")
      ),
      this._getResetOption(
        "blackNexus",
        "faith",
        this._settings.religionItems.blackNexus,
        this._host.i18n("$religion.tu.blackNexus.label")
      ),
      this._getResetOption(
        "blackCore",
        "faith",
        this._settings.religionItems.blackCore,
        this._host.i18n("$religion.tu.blackCore.label")
      ),
      this._getResetOption(
        "singularity",
        "faith",
        this._settings.religionItems.singularity,
        this._host.i18n("$religion.tu.singularity.label")
      ),
      this._getResetOption(
        "blackLibrary",
        "faith",
        this._settings.religionItems.blackLibrary,
        this._host.i18n("$religion.tu.blackLibrary.label")
      ),
      this._getResetOption(
        "blackRadiance",
        "faith",
        this._settings.religionItems.blackRadiance,
        this._host.i18n("$religion.tu.blackRadiance.label")
      ),
      this._getResetOption(
        "blazar",
        "faith",
        this._settings.religionItems.blazar,
        this._host.i18n("$religion.tu.blazar.label")
      ),
      this._getResetOption(
        "darkNova",
        "faith",
        this._settings.religionItems.darkNova,
        this._host.i18n("$religion.tu.darkNova.label")
      ),
      this._getResetOption(
        "holyGenocide",
        "faith",
        this._settings.religionItems.holyGenocide,
        this._host.i18n("$religion.tu.holyGenocide.label")
      )
    );

    const resetTimeList = this._getItemsList("reset-time");
    resetTimeList.append(
      this._getResetOption(
        "temporalBattery",
        "time",
        this._settings.timeItems.temporalBattery,
        this._host.i18n("$time.cfu.temporalBattery.label")
      ),
      this._getResetOption(
        "blastFurnace",
        "time",
        this._settings.timeItems.blastFurnace,
        this._host.i18n("$time.cfu.blastFurnace.label")
      ),
      this._getResetOption(
        "timeBoiler",
        "time",
        this._settings.timeItems.timeBoiler,
        this._host.i18n("$time.cfu.timeBoiler.label")
      ),
      this._getResetOption(
        "temporalAccelerator",
        "time",
        this._settings.timeItems.temporalAccelerator,
        this._host.i18n("$time.cfu.temporalAccelerator.label")
      ),
      this._getResetOption(
        "temporalImpedance",
        "time",
        this._settings.timeItems.temporalImpedance,
        this._host.i18n("$time.cfu.temporalImpedance.label")
      ),
      this._getResetOption(
        "ressourceRetrieval",
        "time",
        this._settings.timeItems.ressourceRetrieval,
        this._host.i18n("$time.cfu.ressourceRetrieval.label"),
        true
      ),

      this._getResetOption(
        "cryochambers",
        "time",
        this._settings.timeItems.cryochambers,
        this._host.i18n("$time.vsu.cryochambers.label")
      ),
      this._getResetOption(
        "voidHoover",
        "time",
        this._settings.timeItems.voidHoover,
        this._host.i18n("$time.vsu.voidHoover.label")
      ),
      this._getResetOption(
        "voidRift",
        "time",
        this._settings.timeItems.voidRift,
        this._host.i18n("$time.vsu.voidRift.label")
      ),
      this._getResetOption(
        "chronocontrol",
        "time",
        this._settings.timeItems.chronocontrol,
        this._host.i18n("$time.vsu.chronocontrol.label")
      ),
      this._getResetOption(
        "voidResonator",
        "time",
        this._settings.timeItems.voidResonator,
        this._host.i18n("$time.vsu.voidResonator.label")
      )
    );

    const buildButton = $("<div/>", {
      id: "toggle-reset-build",
      text: "🔥",
      title: this._host.i18n("ui.build"),
      css: {
        cursor: "pointer",
        display: "inline-block",
        filter: "grayscale(100%)",
        float: "right",
        paddingRight: "5px",
      },
    });
    const spaceButton = $("<div/>", {
      id: "toggle-reset-space",
      text: "🚀",
      title: this._host.i18n("ui.space"),
      css: {
        cursor: "pointer",
        display: "inline-block",
        filter: "grayscale(100%)",
        float: "right",
        paddingRight: "5px",
      },
    });
    const resourcesButton = $('<div class="ks-icon-button"/>', {
      id: "toggle-reset-resources",
      title: this._host.i18n("ui.craft.resources"),
    }).text("🛠");
    const religionButton = $("<div/>", {
      id: "toggle-reset-religion",
      text: "🐈",
      title: this._host.i18n("ui.faith"),
      css: {
        cursor: "pointer",
        display: "inline-block",
        filter: "grayscale(100%)",
        float: "right",
        paddingRight: "5px",
      },
    });
    const timeButton = $("<div/>", {
      id: "toggle-reset-time",
      text: "🕙",
      title: this._host.i18n("ui.time"),
      css: {
        cursor: "pointer",
        display: "inline-block",
        filter: "grayscale(100%)",
        float: "right",
        paddingRight: "5px",
      },
    });

    buildButton.on("click", () => {
      resetBuildList.toggle();
      resetSpaceList.toggle(false);
      resetResourcesList.toggle(false);
      resetReligionList.toggle(false);
      resetTimeList.toggle(false);
    });
    spaceButton.on("click", () => {
      resetBuildList.toggle(false);
      resetSpaceList.toggle();
      resetResourcesList.toggle(false);
      resetReligionList.toggle(false);
      resetTimeList.toggle(false);
    });
    resourcesButton.on("click", () => {
      resetBuildList.toggle(false);
      resetSpaceList.toggle(false);
      resetResourcesList.toggle();
      resetReligionList.toggle(false);
      resetTimeList.toggle(false);
    });
    religionButton.on("click", () => {
      resetBuildList.toggle(false);
      resetSpaceList.toggle(false);
      resetResourcesList.toggle(false);
      resetReligionList.toggle();
      resetTimeList.toggle(false);
    });
    timeButton.on("click", () => {
      resetBuildList.toggle(false);
      resetSpaceList.toggle(false);
      resetResourcesList.toggle(false);
      resetReligionList.toggle(false);
      resetTimeList.toggle();
    });

    element.append(
      buildButton,
      spaceButton,
      resourcesButton,
      religionButton,
      timeButton,
      resetBuildList,
      resetSpaceList,
      resetResourcesList,
      resetReligionList,
      resetTimeList
    );

    return element;
  }

  private _getOptionAccelerateTime(
    name: string,
    option: TimeControlSettings["accelerateTime"],
    label: string
  ): JQuery<HTMLElement> {
    return SettingTriggerUi.make(this._host, name, option, label);
  }

  private _getCycle(
    index: CycleIndices,
    option: TimeControlSettings["timeSkip"]
  ): JQuery<HTMLElement> {
    const cycle = this._host.gamePage.calendar.cycles[index];

    const element = $("<li/>");

    const label = $("<label/>", {
      for: `toggle-timeSkip-${index}`,
      text: cycle.title,
    });

    const input = $("<input/>", {
      id: `toggle-timeSkip-${index}`,
      type: "checkbox",
    }).data("option", option);
    option[`$${index}` as const] = input;

    input.on("change", () => {
      if (input.is(":checked") && option[index] === false) {
        this._host.updateOptions(() => (option[index] = true));
        this._host.imessage("time.skip.cycle.enable", [cycle.title]);
      } else if (!input.is(":checked") && option[index] === true) {
        this._host.updateOptions(() => (option[index] = false));
        this._host.imessage("time.skip.cycle.disable", [cycle.title]);
      }
    });

    element.append(input, label);

    return element;
  }

  private _getResetOption(
    name: string,
    type: "build" | "faith" | "space" | "time",
    option: SettingTrigger,
    i18nName: string,
    delimiter = false,
    upgradeIndicator = false
  ): JQuery<HTMLElement> {
    return SettingTriggerUi.make(
      this._host,
      `toggle-reset-${type}-${name}`,
      option,
      i18nName,
      delimiter,
      upgradeIndicator,
      {
        onCheck: () => {
          this._host.updateOptions(() => (option.enabled = true));
          this._host.imessage("status.reset.check.enable", [i18nName]);
        },
        onUnCheck: () => {
          this._host.updateOptions(() => (option.enabled = false));
          this._host.imessage("status.reset.check.disable", [i18nName]);
        },
      }
    );
  }

  private _getSeasonForTimeSkip(
    season: Season,
    option: TimeControlTimeSkipSettings
  ): JQuery<HTMLElement> {
    const iseason = ucfirst(this._host.i18n(`$calendar.season.${season}` as const));

    const element = $("<li/>");

    const label = $("<label/>", {
      for: `toggle-timeSkip-${season}`,
      text: ucfirst(iseason),
    });

    const input = $("<input/>", {
      id: `toggle-timeSkip-${season}`,
      type: "checkbox",
    }).data("option", option);
    option[`$${season}` as const] = input;

    input.on("change", () => {
      if (input.is(":checked") && option[season] === false) {
        this._host.updateOptions(() => (option[season] = true));
        this._host.imessage("time.skip.season.enable", [iseason]);
      } else if (!input.is(":checked") && option[season] === true) {
        this._host.updateOptions(() => (option[season] = false));
        this._host.imessage("time.skip.season.disable", [iseason]);
      }
    });

    element.append(input, label);

    return element;
  }

  private _getResourceOptions(): JQuery<HTMLElement> {
    this._resourcesList = SettingsSectionUi.getList("toggle-reset-list-resources");

    const add = $("<div/>", {
      id: "resources-add",
      text: this._host.i18n("resources.add"),
      css: {
        border: "1px solid grey",
        cursor: "pointer",
        display: "inline-block",
        padding: "1px 2px",
      },
    });

    const allresources = SettingsSectionUi.getList("available-resources-list");

    add.on("click", () => {
      allresources.toggle();
      allresources.empty();
      allresources.append(
        this._getAllAvailableResourceOptions(true, res => {
          if (!this._settings.resources[res.name]) {
            const option = new TimeControlResourcesSettingsItem(true, Number.POSITIVE_INFINITY);
            this._host.updateOptions(() => (this._settings.resources[res.name] = option));
            $("#toggle-reset-list-resources").append(
              this._addNewResourceOptionForReset(
                res.name,
                res.title,
                option,
                (_name, _resource) => {
                  delete this._settings.resources[_name];
                }
              )
            );
          }
        })
      );
    });

    this._resourcesList.append(add, allresources);

    return this._resourcesList;
  }

  setState(state: TimeControlSettings): void {
    this._settings.enabled = state.enabled;

    this._settings.accelerateTime.enabled = state.accelerateTime.enabled;
    this._settings.accelerateTime.trigger = state.accelerateTime.trigger;

    this._settings.reset.enabled = state.reset.enabled;

    this._settings.timeSkip.enabled = state.timeSkip.enabled;
    this._settings.timeSkip.trigger = state.timeSkip.trigger;
    this._settings.timeSkip.autumn = state.timeSkip.autumn;
    this._settings.timeSkip.spring = state.timeSkip.spring;
    this._settings.timeSkip.summer = state.timeSkip.summer;
    this._settings.timeSkip.winter = state.timeSkip.winter;
    this._settings.timeSkip[0] = state.timeSkip[0];
    this._settings.timeSkip[1] = state.timeSkip[1];
    this._settings.timeSkip[2] = state.timeSkip[2];
    this._settings.timeSkip[3] = state.timeSkip[3];
    this._settings.timeSkip[4] = state.timeSkip[4];
    this._settings.timeSkip[5] = state.timeSkip[5];
    this._settings.timeSkip[6] = state.timeSkip[6];
    this._settings.timeSkip[7] = state.timeSkip[7];
    this._settings.timeSkip[8] = state.timeSkip[8];
    this._settings.timeSkip[9] = state.timeSkip[9];

    for (const [name, option] of objectEntries(this._settings.buildItems)) {
      option.enabled = state.buildItems[name].enabled;
      option.trigger = state.buildItems[name].trigger;
    }
    for (const [name, option] of objectEntries(this._settings.religionItems)) {
      option.enabled = state.religionItems[name].enabled;
      option.trigger = state.religionItems[name].trigger;
    }
    for (const [name, option] of objectEntries(this._settings.spaceItems)) {
      option.enabled = state.spaceItems[name].enabled;
      option.trigger = state.spaceItems[name].trigger;
    }
    for (const [name, option] of objectEntries(this._settings.timeItems)) {
      option.enabled = state.timeItems[name].enabled;
      option.trigger = state.timeItems[name].trigger;
    }

    // Remove old resource options.
    for (const [name] of objectEntries(this._settings.resources)) {
      this._removeResourceOptionForReset(name);
    }
    // Add new resource options.
    const resourcesList = this._getResourceOptions();
    for (const [name, option] of objectEntries(state.resources)) {
      resourcesList.append(
        this._addNewResourceOptionForReset(name, name, option, (_name, _resource) => {
          delete this._settings.resources[_name];
        })
      );
    }
  }

  refreshUi(): void {
    this.setState(this._settings);

    mustExist(this._settings.$enabled).prop("checked", this._settings.enabled);

    mustExist(this._settings.accelerateTime.$enabled).prop(
      "checked",
      this._settings.accelerateTime.enabled
    );
    mustExist(this._settings.accelerateTime.$trigger)[0].title = SettingsSectionUi.renderPercentage(
      this._settings.accelerateTime.trigger
    );

    mustExist(this._settings.reset.$enabled).prop("checked", this._settings.reset.enabled);

    mustExist(this._settings.timeSkip.$enabled).prop("checked", this._settings.timeSkip.enabled);
    mustExist(this._settings.timeSkip.$trigger)[0].title = SettingsSectionUi.renderPercentage(
      this._settings.timeSkip.trigger
    );
    mustExist(this._settings.timeSkip.$autumn).prop("checked", this._settings.timeSkip.autumn);
    mustExist(this._settings.timeSkip.$spring).prop("checked", this._settings.timeSkip.spring);
    mustExist(this._settings.timeSkip.$summer).prop("checked", this._settings.timeSkip.summer);
    mustExist(this._settings.timeSkip.$winter).prop("checked", this._settings.timeSkip.winter);
    mustExist(this._settings.timeSkip.$0).prop("checked", this._settings.timeSkip[0]);
    mustExist(this._settings.timeSkip.$1).prop("checked", this._settings.timeSkip[1]);
    mustExist(this._settings.timeSkip.$2).prop("checked", this._settings.timeSkip[2]);
    mustExist(this._settings.timeSkip.$3).prop("checked", this._settings.timeSkip[3]);
    mustExist(this._settings.timeSkip.$4).prop("checked", this._settings.timeSkip[4]);
    mustExist(this._settings.timeSkip.$5).prop("checked", this._settings.timeSkip[5]);
    mustExist(this._settings.timeSkip.$6).prop("checked", this._settings.timeSkip[6]);
    mustExist(this._settings.timeSkip.$7).prop("checked", this._settings.timeSkip[7]);
    mustExist(this._settings.timeSkip.$8).prop("checked", this._settings.timeSkip[8]);
    mustExist(this._settings.timeSkip.$9).prop("checked", this._settings.timeSkip[9]);

    for (const [name, option] of objectEntries(this._settings.buildItems)) {
      mustExist(option.$enabled).prop("checked", this._settings.buildItems[name].enabled);
      mustExist(option.$trigger).text(
        this._host.i18n("ui.min", [this._renderLimit(this._settings.buildItems[name].trigger)])
      );
    }
    for (const [name, option] of objectEntries(this._settings.religionItems)) {
      mustExist(option.$enabled).prop("checked", this._settings.religionItems[name].enabled);
      mustExist(option.$trigger).text(
        this._host.i18n("ui.min", [this._renderLimit(this._settings.religionItems[name].trigger)])
      );
    }
    for (const [name, option] of objectEntries(this._settings.spaceItems)) {
      mustExist(option.$enabled).prop("checked", this._settings.spaceItems[name].enabled);
      mustExist(option.$trigger).text(
        this._host.i18n("ui.min", [this._renderLimit(this._settings.spaceItems[name].trigger)])
      );
    }
    for (const [name, option] of objectEntries(this._settings.timeItems)) {
      mustExist(option.$enabled).prop("checked", this._settings.timeItems[name].enabled);
      mustExist(option.$trigger).text(
        this._host.i18n("ui.min", [this._renderLimit(this._settings.timeItems[name].trigger)])
      );
    }

    for (const [name, option] of objectEntries(this._settings.resources)) {
      mustExist(option.$stock).text(
        this._host.i18n("resources.stock", [
          this._renderLimit(mustExist(this._settings.resources[name]).stock),
        ])
      );
    }
  }
}
