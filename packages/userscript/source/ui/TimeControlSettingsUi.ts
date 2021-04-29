import { TimeControlBuildSettingsItem, TimeControlSettings } from "../options/TimeControlSettings";
import { objectEntries } from "../tools/Entries";
import { ucfirst } from "../tools/Format";
import { mustExist } from "../tools/Maybe";
import { Season } from "../types";
import { UserScript } from "../UserScript";
import { SettingsSectionUi } from "./SettingsSectionUi";

export class TimeControlSettingsUi extends SettingsSectionUi<TimeControlSettings> {
  readonly element: JQuery<HTMLElement>;

  private readonly _options: TimeControlSettings;

  private readonly _itemsButton: JQuery<HTMLElement>;

  private readonly _optionButtons = new Array<JQuery<HTMLElement>>();

  constructor(host: UserScript, religionOptions: TimeControlSettings = host.options.auto.timeCtrl) {
    super(host);

    this._options = religionOptions;

    const toggleName = "timeCtrl";

    const itext = ucfirst(this._host.i18n("ui.timeCtrl"));

    // Our main element is a list item.
    const element = $("<li/>", { id: "ks-" + toggleName });

    const label = $("<label/>", {
      for: "toggle-" + toggleName,
      text: itext,
    });

    const input = $("<input/>", {
      id: "toggle-" + toggleName,
      type: "checkbox",
    });
    this._options.$enabled = input;

    element.append(input, label);

    // Create build items.
    // We create these in a list that is displayed when the user clicks the "items" button.
    const list = this.getOptionHead(toggleName);

    // Add a border on the element
    element.css("borderBottom", "1px  solid rgba(185, 185, 185, 0.7)");

    this._itemsButton = $("<div/>", {
      id: "toggle-items-" + toggleName,
      text: this._host.i18n("ui.items"),
      css: {
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        paddingRight: "5px",
        textShadow: "3px 3px 4px gray",
      },
    });

    this._itemsButton.on("click", () => {
      list.toggle();
    });

    this._optionButtons = [
      this._getOptionAccelerateTime(
        "accelerateTime",
        this._options.items.accelerateTime,
        this._host.i18n("option.accelerate")
      ),

      this._getOptionTimeSkip(
        "timeSkip",
        this._options.items.timeSkip,
        this._host.i18n("option.time.skip")
      ),

      this._getOptionReset(
        "reset",
        this._options.items.reset,
        this._host.i18n("option.time.reset")
      ),
    ];

    list.append(...this._optionButtons);

    element.append(this._itemsButton);
    element.append(list);

    this.element = element;
  }

  private _getOptionTimeSkip(
    name: string,
    option: TimeControlSettings["items"]["timeSkip"],
    label: string
  ): JQuery<HTMLElement> {
    const element = this.getOption(name, option, label);

    const triggerButton = $("<div/>", {
      id: "set-timeSkip-subTrigger",
      text: this._host.i18n("ui.trigger"),
      //title: option.subTrigger,
      css: {
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        paddingRight: "5px",
        textShadow: "3px 3px 4px gray",
      },
    }).data("option", option);
    option.$subTrigger = triggerButton;

    triggerButton.on("click", () => {
      const value = window.prompt(
        this._host.i18n("time.skip.trigger.set", []),
        option.subTrigger.toFixed(2)
      );

      if (value !== null) {
        option.subTrigger = parseFloat(value);
        //kittenStorage.items[triggerButton.attr("id")] = option.subTrigger;
        //this._host.saveToKittenStorage();
        triggerButton[0].title = option.subTrigger.toFixed(2);
      }
    });

    const maximunButton = $("<div/>", {
      id: "set-timeSkip-maximum",
      text: this._host.i18n("ui.maximum"),
      //title: option.max,
      css: {
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        paddingRight: "5px",
        textShadow: "3px 3px 4px gray",
      },
    }).data("option", option);
    option.$maximum = maximunButton;

    maximunButton.on("click", () => {
      const value = window.prompt(
        this._host.i18n("ui.max.set", [this._host.i18n("option.time.skip")]),
        option.maximum.toFixed(0)
      );

      if (value !== null) {
        option.maximum = parseFloat(value);
        //kittenStorage.items[maximunButton.attr("id")] = option.maximum;
        //this._host.saveToKittenStorage();
        maximunButton[0].title = option.maximum.toFixed(0);
      }
    });

    const cyclesButton = $("<div/>", {
      id: "toggle-cycle-" + name,
      text: this._host.i18n("ui.cycles"),
      css: {
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        paddingRight: "5px",
        textShadow: "3px 3px 4px gray",
      },
    });

    const cyclesList = $("<ul/>", {
      id: "cycles-list-" + name,
      css: { display: "none", paddingLeft: "20px" },
    });

    for (let i = 0; i < this._host.gamePage.calendar.cycles.length; ++i) {
      cyclesList.append(this._getCycle(i, option));
    }

    const seasonsButton = $("<div/>", {
      id: "toggle-seasons-" + name,
      text: this._host.i18n("trade.seasons"),
      css: {
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        paddingRight: "5px",
        textShadow: "3px 3px 4px gray",
      },
    });

    const seasonsList = $("<ul/>", {
      id: "seasons-list-" + name,
      css: { display: "none", paddingLeft: "20px" },
    });

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

    element.append(
      cyclesButton,
      seasonsButton,
      maximunButton,
      triggerButton,
      cyclesList,
      seasonsList
    );

    return element;
  }

  private _getOptionReset(
    name: string,
    option: TimeControlSettings["items"]["reset"],
    label: string
  ): JQuery<HTMLElement> {
    const element = this.getOption(name, option, label);

    // Bonfire reset options
    const resetBuildList = this.getOptionHead("reset-build");
    resetBuildList.append(
      this._getResetOption(
        "hut",
        "build",
        this._options.buildItems.hut,
        this._host.i18n("$buildings.hut.label")
      ),
      this._getResetOption(
        "logHouse",
        "build",
        this._options.buildItems.logHouse,
        this._host.i18n("$buildings.logHouse.label")
      ),
      this._getResetOption(
        "mansion",
        "build",
        this._options.buildItems.mansion,
        this._host.i18n("$buildings.mansion.label"),
        true
      ),

      this._getResetOption(
        "workshop",
        "build",
        this._options.buildItems.workshop,
        this._host.i18n("$buildings.workshop.label")
      ),
      this._getResetOption(
        "factory",
        "build",
        this._options.buildItems.factory,
        this._host.i18n("$buildings.factory.label"),
        true
      ),

      this._getResetOption(
        "field",
        "build",
        this._options.buildItems.field,
        this._host.i18n("$buildings.field.label")
      ),
      this._getResetOption(
        "pasture",
        "build",
        this._options.buildItems.pasture,
        this._host.i18n("$buildings.pasture.label")
      ),
      this._getResetOption(
        "solarFarm",
        "build",
        this._options.buildItems.solarFarm,
        this._host.i18n("$buildings.solarfarm.label")
      ),
      this._getResetOption(
        "mine",
        "build",
        this._options.buildItems.mine,
        this._host.i18n("$buildings.mine.label")
      ),
      this._getResetOption(
        "lumberMill",
        "build",
        this._options.buildItems.lumberMill,
        this._host.i18n("$buildings.lumberMill.label")
      ),
      this._getResetOption(
        "aqueduct",
        "build",
        this._options.buildItems.aqueduct,
        this._host.i18n("$buildings.aqueduct.label")
      ),
      this._getResetOption(
        "hydroPlant",
        "build",
        this._options.buildItems.hydroPlant,
        this._host.i18n("$buildings.hydroplant.label")
      ),
      this._getResetOption(
        "oilWell",
        "build",
        this._options.buildItems.oilWell,
        this._host.i18n("$buildings.oilWell.label")
      ),
      this._getResetOption(
        "quarry",
        "build",
        this._options.buildItems.quarry,
        this._host.i18n("$buildings.quarry.label"),
        true
      ),

      this._getResetOption(
        "smelter",
        "build",
        this._options.buildItems.smelter,
        this._host.i18n("$buildings.smelter.label")
      ),
      this._getResetOption(
        "biolab",
        "build",
        this._options.buildItems.biolab,
        this._host.i18n("$buildings.biolab.label")
      ),
      this._getResetOption(
        "calciner",
        "build",
        this._options.buildItems.calciner,
        this._host.i18n("$buildings.calciner.label")
      ),
      this._getResetOption(
        "reactor",
        "build",
        this._options.buildItems.reactor,
        this._host.i18n("$buildings.reactor.label")
      ),
      this._getResetOption(
        "accelerator",
        "build",
        this._options.buildItems.accelerator,
        this._host.i18n("$buildings.accelerator.label")
      ),
      this._getResetOption(
        "steamworks",
        "build",
        this._options.buildItems.steamworks,
        this._host.i18n("$buildings.steamworks.label")
      ),
      this._getResetOption(
        "magneto",
        "build",
        this._options.buildItems.magneto,
        this._host.i18n("$buildings.magneto.label"),
        true
      ),

      this._getResetOption(
        "library",
        "build",
        this._options.buildItems.library,
        this._host.i18n("$buildings.library.label")
      ),
      this._getResetOption(
        "dataCenter",
        "build",
        this._options.buildItems.dataCenter,
        this._host.i18n("$buildings.dataCenter.label")
      ),
      this._getResetOption(
        "academy",
        "build",
        this._options.buildItems.academy,
        this._host.i18n("$buildings.academy.label")
      ),
      this._getResetOption(
        "observatory",
        "build",
        this._options.buildItems.observatory,
        this._host.i18n("$buildings.observatory.label"),
        true
      ),

      this._getResetOption(
        "amphitheatre",
        "build",
        this._options.buildItems.amphitheatre,
        this._host.i18n("$buildings.amphitheatre.label")
      ),
      this._getResetOption(
        "broadcastTower",
        "build",
        this._options.buildItems.broadcastTower,
        this._host.i18n("$buildings.broadcasttower.label")
      ),
      this._getResetOption(
        "tradepost",
        "build",
        this._options.buildItems.tradepost,
        this._host.i18n("$buildings.tradepost.label")
      ),
      this._getResetOption(
        "chapel",
        "build",
        this._options.buildItems.chapel,
        this._host.i18n("$buildings.chapel.label")
      ),
      this._getResetOption(
        "temple",
        "build",
        this._options.buildItems.temple,
        this._host.i18n("$buildings.temple.label")
      ),
      this._getResetOption(
        "mint",
        "build",
        this._options.buildItems.mint,
        this._host.i18n("$buildings.mint.label")
      ),
      this._getResetOption(
        "ziggurat",
        "build",
        this._options.buildItems.ziggurat,
        this._host.i18n("$buildings.ziggurat.label")
      ),
      this._getResetOption(
        "chronosphere",
        "build",
        this._options.buildItems.chronosphere,
        this._host.i18n("$buildings.chronosphere.label")
      ),
      this._getResetOption(
        "aiCore",
        "build",
        this._options.buildItems.aiCore,
        this._host.i18n("$buildings.aicore.label")
      ),
      this._getResetOption(
        "brewery",
        "build",
        this._options.buildItems.brewery,
        this._host.i18n("$buildings.brewery.label"),
        true
      ),

      this._getResetOption(
        "barn",
        "build",
        this._options.buildItems.barn,
        this._host.i18n("$buildings.barn.label")
      ),
      this._getResetOption(
        "harbor",
        "build",
        this._options.buildItems.harbor,
        this._host.i18n("$buildings.harbor.label")
      ),
      this._getResetOption(
        "warehouse",
        "build",
        this._options.buildItems.warehouse,
        this._host.i18n("$buildings.warehouse.label"),
        true
      ),

      this._getResetOption(
        "zebraOutpost",
        "build",
        this._options.buildItems.zebraOutpost,
        this._host.i18n("$buildings.zebraOutpost.label")
      ),
      this._getResetOption(
        "zebraWorkshop",
        "build",
        this._options.buildItems.zebraWorkshop,
        this._host.i18n("$buildings.zebraWorkshop.label")
      ),
      this._getResetOption(
        "zebraForge",
        "build",
        this._options.buildItems.zebraForge,
        this._host.i18n("$buildings.zebraForge.label")
      )
    );

    // Space reset options
    const resetSpaceList = this.getOptionHead("reset-space");
    resetSpaceList.append(
      this._getResetOption(
        "spaceElevator",
        "space",
        this._options.spaceItems.spaceElevator,
        this._host.i18n("$space.planet.cath.spaceElevator.label")
      ),
      this._getResetOption(
        "sattelite",
        "space",
        this._options.spaceItems.sattelite,
        this._host.i18n("$space.planet.cath.sattelite.label")
      ),
      this._getResetOption(
        "spaceStation",
        "space",
        this._options.spaceItems.spaceStation,
        this._host.i18n("$space.planet.cath.spaceStation.label"),
        true
      ),

      this._getResetOption(
        "moonOutpost",
        "space",
        this._options.spaceItems.moonOutpost,
        this._host.i18n("$space.planet.moon.moonOutpost.label")
      ),
      this._getResetOption(
        "moonBase",
        "space",
        this._options.spaceItems.moonBase,
        this._host.i18n("$space.planet.moon.moonBase.label"),
        true
      ),

      this._getResetOption(
        "planetCracker",
        "space",
        this._options.spaceItems.planetCracker,
        this._host.i18n("$space.planet.dune.planetCracker.label")
      ),
      this._getResetOption(
        "hydrofracturer",
        "space",
        this._options.spaceItems.hydrofracturer,
        this._host.i18n("$space.planet.dune.hydrofracturer.label")
      ),
      this._getResetOption(
        "spiceRefinery",
        "space",
        this._options.spaceItems.spiceRefinery,
        this._host.i18n("$space.planet.dune.spiceRefinery.label"),
        true
      ),

      this._getResetOption(
        "researchVessel",
        "space",
        this._options.spaceItems.researchVessel,
        this._host.i18n("$space.planet.piscine.researchVessel.label")
      ),
      this._getResetOption(
        "orbitalArray",
        "space",
        this._options.spaceItems.orbitalArray,
        this._host.i18n("$space.planet.piscine.orbitalArray.label"),
        true
      ),

      this._getResetOption(
        "sunlifter",
        "space",
        this._options.spaceItems.sunlifter,
        this._host.i18n("$space.planet.helios.sunlifter.label")
      ),
      this._getResetOption(
        "containmentChamber",
        "space",
        this._options.spaceItems.containmentChamber,
        this._host.i18n("$space.planet.helios.containmentChamber.label")
      ),
      this._getResetOption(
        "heatsink",
        "space",
        this._options.spaceItems.heatsink,
        this._host.i18n("$space.planet.helios.heatsink.label")
      ),
      this._getResetOption(
        "sunforge",
        "space",
        this._options.spaceItems.sunforge,
        this._host.i18n("$space.planet.helios.sunforge.label"),
        true
      ),

      this._getResetOption(
        "cryostation",
        "space",
        this._options.spaceItems.cryostation,
        this._host.i18n("$space.planet.terminus.cryostation.label"),
        true
      ),

      this._getResetOption(
        "spaceBeacon",
        "space",
        this._options.spaceItems.spaceBeacon,
        this._host.i18n("$space.planet.kairo.spaceBeacon.label"),
        true
      ),

      this._getResetOption(
        "terraformingStation",
        "space",
        this._options.spaceItems.terraformingStation,
        this._host.i18n("$space.planet.yarn.terraformingStation.label")
      ),
      this._getResetOption(
        "hydroponics",
        "space",
        this._options.spaceItems.hydroponics,
        this._host.i18n("$space.planet.yarn.hydroponics.label"),
        true
      ),

      this._getResetOption(
        "hrHarvester",
        "space",
        this._options.spaceItems.hrHarvester,
        this._host.i18n("$space.planet.umbra.hrHarvester.label"),
        true
      ),

      this._getResetOption(
        "entangler",
        "space",
        this._options.spaceItems.entangler,
        this._host.i18n("$space.planet.charon.entangler.label"),
        true
      ),

      this._getResetOption(
        "tectonic",
        "space",
        this._options.spaceItems.tectonic,
        this._host.i18n("$space.planet.centaurusSystem.tectonic.label")
      ),
      this._getResetOption(
        "moltenCore",
        "space",
        this._options.spaceItems.moltenCore,
        this._host.i18n("$space.planet.centaurusSystem.moltenCore.label")
      )
    );

    // Resources list
    const resetResourcesList = this._getResourceOptions(true);
    for (const [item, itemValue] of objectEntries(this._options.resources)) {
      resetResourcesList.append(this.addNewResourceOption(item, item, true));
      this.setStockValue(item, itemValue.stockForReset, true);
    }

    // Religion reset options.
    const resetReligionList = this.getOptionHead("reset-religion");
    resetReligionList.append(
      this._getResetOption(
        "unicornPasture",
        "faith",
        this._options.religionItems.unicornPasture,
        this._host.i18n("$buildings.unicornPasture.label")
      ),
      this._getResetOption(
        "unicornTomb",
        "faith",
        this._options.religionItems.unicornTomb,
        this._host.i18n("$religion.zu.unicornTomb.label")
      ),
      this._getResetOption(
        "ivoryTower",
        "faith",
        this._options.religionItems.ivoryTower,
        this._host.i18n("$religion.zu.ivoryTower.label")
      ),
      this._getResetOption(
        "ivoryCitadel",
        "faith",
        this._options.religionItems.ivoryCitadel,
        this._host.i18n("$religion.zu.ivoryCitadel.label")
      ),
      this._getResetOption(
        "skyPalace",
        "faith",
        this._options.religionItems.skyPalace,
        this._host.i18n("$religion.zu.skyPalace.label")
      ),
      this._getResetOption(
        "unicornUtopia",
        "faith",
        this._options.religionItems.unicornUtopia,
        this._host.i18n("$religion.zu.unicornUtopia.label")
      ),
      this._getResetOption(
        "sunspire",
        "faith",
        this._options.religionItems.sunspire,
        this._host.i18n("$religion.zu.sunspire.label"),
        true
      ),

      this._getResetOption(
        "marker",
        "faith",
        this._options.religionItems.marker,
        this._host.i18n("$religion.zu.marker.label")
      ),
      this._getResetOption(
        "unicornGraveyard",
        "faith",
        this._options.religionItems.unicornGraveyard,
        this._host.i18n("$religion.zu.unicornGraveyard.label")
      ),
      this._getResetOption(
        "unicornNecropolis",
        "faith",
        this._options.religionItems.unicornNecropolis,
        this._host.i18n("$religion.zu.unicornNecropolis.label")
      ),
      this._getResetOption(
        "blackPyramid",
        "faith",
        this._options.religionItems.blackPyramid,
        this._host.i18n("$religion.zu.blackPyramid.label"),
        true
      ),

      this._getResetOption(
        "solarchant",
        "faith",
        this._options.religionItems.solarchant,
        this._host.i18n("$religion.ru.solarchant.label")
      ),
      this._getResetOption(
        "scholasticism",
        "faith",
        this._options.religionItems.scholasticism,
        this._host.i18n("$religion.ru.scholasticism.label")
      ),
      this._getResetOption(
        "goldenSpire",
        "faith",
        this._options.religionItems.goldenSpire,
        this._host.i18n("$religion.ru.goldenSpire.label")
      ),
      this._getResetOption(
        "sunAltar",
        "faith",
        this._options.religionItems.sunAltar,
        this._host.i18n("$religion.ru.sunAltar.label")
      ),
      this._getResetOption(
        "stainedGlass",
        "faith",
        this._options.religionItems.stainedGlass,
        this._host.i18n("$religion.ru.stainedGlass.label")
      ),
      this._getResetOption(
        "solarRevolution",
        "faith",
        this._options.religionItems.solarRevolution,
        this._host.i18n("$religion.ru.solarRevolution.label")
      ),
      this._getResetOption(
        "basilica",
        "faith",
        this._options.religionItems.basilica,
        this._host.i18n("$religion.ru.basilica.label")
      ),
      this._getResetOption(
        "templars",
        "faith",
        this._options.religionItems.templars,
        this._host.i18n("$religion.ru.templars.label")
      ),
      this._getResetOption(
        "apocripha",
        "faith",
        this._options.religionItems.apocripha,
        this._host.i18n("$religion.ru.apocripha.label")
      ),
      this._getResetOption(
        "transcendence",
        "faith",
        this._options.religionItems.transcendence,
        this._host.i18n("$religion.ru.transcendence.label"),
        true
      ),

      this._getResetOption(
        "blackObelisk",
        "faith",
        this._options.religionItems.blackObelisk,
        this._host.i18n("$religion.tu.blackObelisk.label")
      ),
      this._getResetOption(
        "blackNexus",
        "faith",
        this._options.religionItems.blackNexus,
        this._host.i18n("$religion.tu.blackNexus.label")
      ),
      this._getResetOption(
        "blackCore",
        "faith",
        this._options.religionItems.blackCore,
        this._host.i18n("$religion.tu.blackCore.label")
      ),
      this._getResetOption(
        "singularity",
        "faith",
        this._options.religionItems.singularity,
        this._host.i18n("$religion.tu.singularity.label")
      ),
      this._getResetOption(
        "blackLibrary",
        "faith",
        this._options.religionItems.blackLibrary,
        this._host.i18n("$religion.tu.blackLibrary.label")
      ),
      this._getResetOption(
        "blackRadiance",
        "faith",
        this._options.religionItems.blackRadiance,
        this._host.i18n("$religion.tu.blackRadiance.label")
      ),
      this._getResetOption(
        "blazar",
        "faith",
        this._options.religionItems.blazar,
        this._host.i18n("$religion.tu.blazar.label")
      ),
      this._getResetOption(
        "darkNova",
        "faith",
        this._options.religionItems.darkNova,
        this._host.i18n("$religion.tu.darkNova.label")
      ),
      this._getResetOption(
        "holyGenocide",
        "faith",
        this._options.religionItems.holyGenocide,
        this._host.i18n("$religion.tu.holyGenocide.label")
      )
    );

    const resetTimeList = this.getOptionHead("reset-time");
    resetTimeList.append(
      this._getResetOption(
        "temporalBattery",
        "time",
        this._options.timeItems.temporalBattery,
        this._host.i18n("$time.cfu.temporalBattery.label")
      ),
      this._getResetOption(
        "blastFurnace",
        "time",
        this._options.timeItems.blastFurnace,
        this._host.i18n("$time.cfu.blastFurnace.label")
      ),
      this._getResetOption(
        "timeBoiler",
        "time",
        this._options.timeItems.timeBoiler,
        this._host.i18n("$time.cfu.timeBoiler.label")
      ),
      this._getResetOption(
        "temporalAccelerator",
        "time",
        this._options.timeItems.temporalAccelerator,
        this._host.i18n("$time.cfu.temporalAccelerator.label")
      ),
      this._getResetOption(
        "temporalImpedance",
        "time",
        this._options.timeItems.temporalImpedance,
        this._host.i18n("$time.cfu.temporalImpedance.label")
      ),
      this._getResetOption(
        "ressourceRetrieval",
        "time",
        this._options.timeItems.ressourceRetrieval,
        this._host.i18n("$time.cfu.ressourceRetrieval.label"),
        true
      ),

      this._getResetOption(
        "cryochambers",
        "time",
        this._options.timeItems.cryochambers,
        this._host.i18n("$time.vsu.cryochambers.label")
      ),
      this._getResetOption(
        "voidHoover",
        "time",
        this._options.timeItems.voidHoover,
        this._host.i18n("$time.vsu.voidHoover.label")
      ),
      this._getResetOption(
        "voidRift",
        "time",
        this._options.timeItems.voidRift,
        this._host.i18n("$time.vsu.voidRift.label")
      ),
      this._getResetOption(
        "chronocontrol",
        "time",
        this._options.timeItems.chronocontrol,
        this._host.i18n("$time.vsu.chronocontrol.label")
      ),
      this._getResetOption(
        "voidResonator",
        "time",
        this._options.timeItems.voidResonator,
        this._host.i18n("$time.vsu.voidResonator.label")
      )
    );

    const buildButton = $("<div/>", {
      id: "toggle-reset-build",
      text: this._host.i18n("ui.build"),
      css: {
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        paddingRight: "5px",
        textShadow: "3px 3px 4px gray",
      },
    });
    const spaceButton = $("<div/>", {
      id: "toggle-reset-space",
      text: this._host.i18n("ui.space"),
      css: {
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        paddingRight: "5px",
        textShadow: "3px 3px 4px gray",
      },
    });
    const resourcesButton = $("<div/>", {
      id: "toggle-reset-resources",
      text: this._host.i18n("ui.craft.resources"),
      css: {
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        paddingRight: "5px",
        textShadow: "3px 3px 4px gray",
      },
    });
    const religionButton = $("<div/>", {
      id: "toggle-reset-religion",
      text: this._host.i18n("ui.faith"),
      css: {
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        paddingRight: "5px",
        textShadow: "3px 3px 4px gray",
      },
    });
    const timeButton = $("<div/>", {
      id: "toggle-reset-time",
      text: this._host.i18n("ui.time"),
      css: {
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        paddingRight: "5px",
        textShadow: "3px 3px 4px gray",
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
    option: TimeControlSettings["items"]["accelerateTime"],
    label: string
  ): JQuery<HTMLElement> {
    const element = this.getOption(name, option, label);

    const triggerButton = $("<div/>", {
      id: "set-" + name + "-subTrigger",
      text: this._host.i18n("ui.trigger"),
      //title: option.subTrigger,
      css: {
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        paddingRight: "5px",
        textShadow: "3px 3px 4px gray",
      },
    }).data("option", option);
    option.$subTrigger = triggerButton;

    triggerButton.on("click", () => {
      const value = window.prompt(
        this._host.i18n("ui.trigger.set", [label]),
        option.subTrigger.toFixed(2)
      );

      if (value !== null) {
        option.subTrigger = parseFloat(value);
        //kittenStorage.items[triggerButton.attr("id")] = option.subTrigger;
        //this._host.saveToKittenStorage();
        triggerButton[0].title = option.subTrigger.toFixed(2);
      }
    });
    element.append(triggerButton);

    return element;
  }

  private _getCycle(
    index: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9,
    option: TimeControlSettings["items"]["timeSkip"]
  ): JQuery<HTMLElement> {
    const cycle = this._host.gamePage.calendar.cycles[index];

    const element = $("<li/>");

    const label = $("<label/>", {
      for: "toggle-timeSkip-" + index,
      text: cycle.title,
    });

    const input = $("<input/>", {
      id: "toggle-timeSkip-" + index,
      type: "checkbox",
    }).data("option", option);
    option[`$${index}` as const] = input;

    /*
    if (option[index]) {
      input.prop("checked", true);
    }
    */
    input.on("change", () => {
      if (input.is(":checked") && option[index] == false) {
        option[index] = true;
        this._host.imessage("time.skip.cycle.enable", [cycle.title]);
      } else if (!input.is(":checked") && option[index] == true) {
        option[index] = false;
        this._host.imessage("time.skip.cycle.disable", [cycle.title]);
      }
      //kittenStorage.items[input.attr("id")] = option[index];
      //this._host.saveToKittenStorage();
    });

    element.append(input, label);

    return element;
  }

  // Ideally, this was replaced by using `getOption()`.
  private _getResetOption(
    name: string,
    type: "build" | "faith" | "space" | "time",
    option: TimeControlBuildSettingsItem,
    i18nName: string,
    delimiter = false
  ): JQuery<HTMLElement> {
    const element = $("<li/>");
    const elementLabel = i18nName;

    const label = $("<label/>", {
      for: "toggle-reset-" + type + "-" + name,
      text: elementLabel,
      css: {
        display: "inline-block",
        marginBottom: delimiter ? "10px" : undefined,
        minWidth: "80px",
      },
    });

    const input = $("<input/>", {
      id: "toggle-reset-" + type + "-" + name,
      type: "checkbox",
    }).data("option", option);
    option.$checkForReset = input;

    /*
    if (option.checkForReset) {
      input.prop("checked", true);
    }
    */

    input.on("change", () => {
      if (input.is(":checked") && option.checkForReset == false) {
        option.checkForReset = true;
        this._host.imessage("status.reset.check.enable", [elementLabel]);
      } else if (!input.is(":checked") && option.checkForReset == true) {
        option.checkForReset = false;
        this._host.imessage("status.reset.check.disable", [elementLabel]);
      }
      //kittenStorage.items[input.attr("id")] = option.checkForReset;
      //this._host.saveToKittenStorage();
    });

    const minButton = $("<div/>", {
      id: "set-reset-" + type + "-" + name + "-min",
      text: this._host.i18n("ui.min", [option.triggerForReset]),
      //title: option.triggerForReset,
      css: {
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        paddingRight: "5px",
        textShadow: "3px 3px 4px gray",
      },
    }).data("option", option);
    option.$triggerForReset = minButton;

    minButton.on("click", () => {
      const value = window.prompt(
        this._host.i18n("reset.check.trigger.set", [i18nName]),
        option.triggerForReset.toFixed(2)
      );

      if (value !== null) {
        option.triggerForReset = parseInt(value);
        //kittenStorage.items[minButton.attr("id")] = option.triggerForReset;
        //this._host.saveToKittenStorage();
        //minButton[0].title = option.triggerForReset;
        minButton.text(this._host.i18n("ui.min", [option.triggerForReset]));
      }
    });

    element.append(input, label, minButton);

    return element;
  }

  private _getSeasonForTimeSkip(
    season: Season,
    option: TimeControlSettings["items"]["timeSkip"]
  ): JQuery<HTMLElement> {
    const iseason = ucfirst(this._host.i18n(`$calendar.season.${season}` as const));

    const element = $("<li/>");

    const label = $("<label/>", {
      for: "toggle-timeSkip-" + season,
      text: ucfirst(iseason),
    });

    const input = $("<input/>", {
      id: "toggle-timeSkip-" + season,
      type: "checkbox",
    }).data("option", option);
    option[`$${season}` as const] = input;

    /*
    if (option[season]) {
      input.prop("checked", true);
    }
    */

    input.on("change", () => {
      if (input.is(":checked") && option[season] == false) {
        option[season] = true;
        this._host.imessage("time.skip.season.enable", [iseason]);
      } else if (!input.is(":checked") && option[season] == true) {
        option[season] = false;
        this._host.imessage("time.skip.season.disable", [iseason]);
      }
      //kittenStorage.items[input.attr("id")] = option[season];
      //this._host.saveToKittenStorage();
    });

    element.append(input, label);

    return element;
  }

  private _getResourceOptions(): JQuery<HTMLElement> {
    const list = $("<ul/>", {
      id: "toggle-reset-list-resources",
      css: { display: "none", paddingLeft: "20px" },
    });

    const add = $("<div/>", {
      id: "resources-add",
      text: this._host.i18n("resources.add"),
      css: {
        cursor: "pointer",
        display: "inline-block",
        textShadow: "3px 3px 4px gray",
        borderBottom: "1px solid rgba(185, 185, 185, 0.7)",
      },
    });

    const clearunused = $("<div/>", {
      id: "resources-clear-unused",
      text: this._host.i18n("resources.clear.unused"),
      css: {
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        paddingRight: "5px",
        textShadow: "3px 3px 4px gray",
      },
    });

    clearunused.on("click", () => {
      for (const name in this._host.options.auto.resources) {
        // Only delete resources with unmodified values. Require manual
        // removal of resources with non-standard values.
        if (
          (!this._host.options.auto.resources[name as Resource]!.stock &&
            this._host.options.auto.resources[name as Resource]!.consume ==
              this._host.options.consume) ||
          this._host.options.auto.resources[name as Resource]!.consume == undefined
        ) {
          $("#resource-" + name).remove();
        }
      }
    });

    const allresources = $("<ul/>", {
      id: "available-resources-list",
      css: { display: "none", paddingLeft: "20px" },
    });

    add.on("click", () => {
      allresources.toggle();
      allresources.empty();
      allresources.append(this.getAvailableResourceOptions(true));
    });

    list.append(add, allresources);

    // Add all the current resources
    for (const [name, res] of objectEntries(this._host.options.auto.timeCtrl.resources)) {
      //const res = mustExist(this._host.options.auto.resources[name]);
      if (res.checkForReset) {
        list.append(this.addNewResourceOption(name, undefined, true));
      }
    }

    return list;
  }

  setState(state: TimeControlSettings): void {
    mustExist(this._options.$enabled).prop("checked", state.enabled);

    mustExist(this._options.items.accelerateTime.$enabled).prop(
      "checked",
      state.items.accelerateTime.enabled
    );
    mustExist(
      this._options.items.accelerateTime.$subTrigger
    )[0].title = state.items.accelerateTime.subTrigger.toFixed(2);

    mustExist(this._options.items.reset.$enabled).prop("checked", state.items.reset.enabled);

    mustExist(this._options.items.timeSkip.$enabled).prop("checked", state.items.timeSkip.enabled);
    mustExist(
      this._options.items.timeSkip.$subTrigger
    )[0].title = state.items.timeSkip.subTrigger.toFixed(2);
    mustExist(this._options.items.timeSkip.$autumn).prop("checked", state.items.timeSkip.autumn);
    mustExist(this._options.items.timeSkip.$spring).prop("checked", state.items.timeSkip.spring);
    mustExist(this._options.items.timeSkip.$summer).prop("checked", state.items.timeSkip.summer);
    mustExist(this._options.items.timeSkip.$winter).prop("checked", state.items.timeSkip.winter);
    mustExist(this._options.items.timeSkip.$0).prop("checked", state.items.timeSkip[0]);
    mustExist(this._options.items.timeSkip.$1).prop("checked", state.items.timeSkip[1]);
    mustExist(this._options.items.timeSkip.$2).prop("checked", state.items.timeSkip[2]);
    mustExist(this._options.items.timeSkip.$3).prop("checked", state.items.timeSkip[3]);
    mustExist(this._options.items.timeSkip.$4).prop("checked", state.items.timeSkip[4]);
    mustExist(this._options.items.timeSkip.$5).prop("checked", state.items.timeSkip[5]);
    mustExist(this._options.items.timeSkip.$6).prop("checked", state.items.timeSkip[6]);
    mustExist(this._options.items.timeSkip.$7).prop("checked", state.items.timeSkip[7]);
    mustExist(this._options.items.timeSkip.$8).prop("checked", state.items.timeSkip[8]);
    mustExist(this._options.items.timeSkip.$9).prop("checked", state.items.timeSkip[9]);

    for (const [name, option] of objectEntries(this._options.buildItems)) {
      mustExist(option.$checkForReset).prop("checked", state.buildItems[name].checkForReset);
      mustExist(option.$triggerForReset).text(
        this._host.i18n("ui.min", [state.buildItems[name].triggerForReset])
      );
    }
    for (const [name, option] of objectEntries(this._options.religionItems)) {
      mustExist(option.$checkForReset).prop("checked", state.religionItems[name].checkForReset);
      mustExist(option.$triggerForReset).text(
        this._host.i18n("ui.min", [state.religionItems[name].triggerForReset])
      );
    }
    for (const [name, option] of objectEntries(this._options.spaceItems)) {
      mustExist(option.$checkForReset).prop("checked", state.spaceItems[name].checkForReset);
      mustExist(option.$triggerForReset).text(
        this._host.i18n("ui.min", [state.spaceItems[name].triggerForReset])
      );
    }
    for (const [name, option] of objectEntries(this._options.timeItems)) {
      mustExist(option.$checkForReset).prop("checked", state.timeItems[name].checkForReset);
      mustExist(option.$triggerForReset).text(
        this._host.i18n("ui.min", [state.timeItems[name].triggerForReset])
      );
    }
    for (const [name, option] of objectEntries(this._options.resources)) {
      mustExist(option.$checkForReset).prop(
        "checked",
        mustExist(state.resources[name]).checkForReset
      );
      mustExist(option.$stockForReset).text(
        this._host.i18n("resources.stock", [
          option.stockForReset === Infinity
            ? "∞"
            : this._host.gamePage.getDisplayValueExt(
                mustExist(state.resources[name]).stockForReset
              ),
        ])
      );
    }
  }
}
