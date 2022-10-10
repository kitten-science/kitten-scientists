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
import { SettingListItem } from "./components/SettingListItem";
import { SettingsList } from "./components/SettingsList";
import { SettingsPanel } from "./components/SettingsPanel";
import { SettingTriggerListItem } from "./components/SettingTriggerListItem";
import { SettingsSectionUi } from "./SettingsSectionUi";

export class TimeControlSettingsUi extends SettingsSectionUi {
  protected readonly _items: Array<SettingListItem>;
  private readonly _settings: TimeControlSettings;

  private _resourcesList: Maybe<JQuery<HTMLElement>>;

  constructor(host: UserScript, settings: TimeControlSettings) {
    const label = ucfirst(host.engine.i18n("ui.timeCtrl"));
    const panel = new SettingsPanel(host, label, settings);
    super(host, panel);

    this._settings = settings;

    this.panel._list.addEventListener("enableAll", () => {
      this._items.forEach(item => (item.setting.enabled = true));
      this.refreshUi();
    });
    this.panel._list.addEventListener("disableAll", () => {
      this._items.forEach(item => (item.setting.enabled = false));
      this.refreshUi();
    });
    this.panel._list.addEventListener("reset", () => {
      this._settings.load(new TimeControlSettings());
      this.refreshUi();
    });

    this._items = [
      this._getOptionAccelerateTime(
        this._settings.accelerateTime,
        this._host.engine.i18n("option.accelerate")
      ),

      this._getOptionTimeSkip(this._settings.timeSkip, this._host.engine.i18n("option.time.skip")),

      this._getOptionReset(this._settings.reset, this._host.engine.i18n("option.time.reset")),
    ];

    for (const setting of this._items) {
      panel.list.append(setting.element);
    }
  }

  private _getOptionTimeSkip(
    option: TimeControlSettings["timeSkip"],
    label: string
  ): SettingTriggerListItem {
    const element = new SettingTriggerListItem(this._host, label, option, {
      onCheck: () => this._host.engine.imessage("status.auto.enable", [label]),
      onUnCheck: () => this._host.engine.imessage("status.auto.disable", [label]),
    });

    const maximumButton = $("<div/>", {
      html: '<svg style="width: 15px; height: 15px;" viewBox="0 0 48 48"><path fill="currentColor" d="m24 36.05-2.15-2.1 8.45-8.45H4v-3h26.3l-8.4-8.45 2.1-2.1L36.05 24ZM41 36V12h3v24Z"/></svg>',
      title: this._host.engine.i18n("ui.maximum"),
    }).addClass("ks-icon-button");
    option.$maximum = maximumButton;

    maximumButton.on("click", () => {
      const value = SettingsSectionUi.promptLimit(
        this._host.engine.i18n("ui.max.set", [this._host.engine.i18n("option.time.skip")]),
        option.maximum.toFixed(0)
      );

      if (value !== null) {
        this._host.updateOptions(() => (option.maximum = value));
        maximumButton[0].title = option.maximum.toFixed(0);
      }
    });

    const cyclesButton = $("<div/>", {
      html: '<svg style="width: 15px; height: 15px;" viewBox="0 0 48 48"><path fill="currentColor" d="M9 44q-1.2 0-2.1-.9Q6 42.2 6 41V10q0-1.2.9-2.1Q7.8 7 9 7h3.25V4h3.25v3h17V4h3.25v3H39q1.2 0 2.1.9.9.9.9 2.1v15h-3v-5.5H9V41h16.2v3Zm29 4q-3.65 0-6.375-2.275T28.2 40h3.1q.65 2.2 2.475 3.6Q35.6 45 38 45q2.9 0 4.95-2.05Q45 40.9 45 38q0-2.9-2.05-4.95Q40.9 31 38 31q-1.45 0-2.7.525-1.25.525-2.2 1.475H36v3h-8v-8h3v2.85q1.35-1.3 3.15-2.075Q35.95 28 38 28q4.15 0 7.075 2.925T48 38q0 4.15-2.925 7.075T38 48ZM9 16.5h30V10H9Zm0 0V10v6.5Z"/></svg>',
      title: this._host.engine.i18n("ui.cycles"),
    }).addClass("ks-icon-button");

    const cyclesList = new SettingsList(this._host);

    for (
      let cycleIndex = 0;
      cycleIndex < this._host.gamePage.calendar.cycles.length;
      ++cycleIndex
    ) {
      cyclesList.element.append(this._getCycle(cycleIndex as CycleIndices, option));
    }

    const seasonsButton = $("<div/>", {
      html: '<svg style="width: 15px; height: 15px;" viewBox="0 0 48 48"><path fill="currentColor" d="M15.3 28.3q-.85 0-1.425-.575-.575-.575-.575-1.425 0-.85.575-1.425.575-.575 1.425-.575.85 0 1.425.575.575.575.575 1.425 0 .85-.575 1.425-.575.575-1.425.575Zm8.85 0q-.85 0-1.425-.575-.575-.575-.575-1.425 0-.85.575-1.425.575-.575 1.425-.575.85 0 1.425.575.575.575.575 1.425 0 .85-.575 1.425-.575.575-1.425.575Zm8.5 0q-.85 0-1.425-.575-.575-.575-.575-1.425 0-.85.575-1.425.575-.575 1.425-.575.85 0 1.425.575.575.575.575 1.425 0 .85-.575 1.425-.575.575-1.425.575ZM9 44q-1.2 0-2.1-.9Q6 42.2 6 41V10q0-1.2.9-2.1Q7.8 7 9 7h3.25V4h3.25v3h17V4h3.25v3H39q1.2 0 2.1.9.9.9.9 2.1v31q0 1.2-.9 2.1-.9.9-2.1.9Zm0-3h30V19.5H9V41Zm0-24.5h30V10H9Zm0 0V10v6.5Z"/></svg>',
      title: this._host.engine.i18n("trade.seasons"),
    }).addClass("ks-icon-button");

    const seasonsList = new SettingsList(this._host);

    // fill out the list with seasons
    seasonsList.element.append(this._getSeasonForTimeSkip("spring", option));
    seasonsList.element.append(this._getSeasonForTimeSkip("summer", option));
    seasonsList.element.append(this._getSeasonForTimeSkip("autumn", option));
    seasonsList.element.append(this._getSeasonForTimeSkip("winter", option));

    cyclesButton.on("click", function () {
      cyclesList.element.toggle();
      seasonsList.element.toggle(false);
    });

    seasonsButton.on("click", function () {
      cyclesList.element.toggle(false);
      seasonsList.element.toggle();
    });

    element.element.append(
      cyclesButton,
      seasonsButton,
      maximumButton,
      cyclesList.element,
      seasonsList.element
    );

    return element;
  }

  private _getOptionReset(option: TimeControlSettings["reset"], label: string): SettingListItem {
    const element = new SettingListItem(this._host, label, option, {
      onCheck: () => this._host.engine.imessage("status.auto.enable", [label]),
      onUnCheck: () => this._host.engine.imessage("status.auto.disable", [label]),
    });

    // Bonfire reset options
    const resetBuildList = new SettingsList(this._host);
    resetBuildList.element.append(
      this._getResetOption(
        this._settings.buildItems.hut,
        this._host.engine.i18n("$buildings.hut.label")
      ),
      this._getResetOption(
        this._settings.buildItems.logHouse,
        this._host.engine.i18n("$buildings.logHouse.label")
      ),
      this._getResetOption(
        this._settings.buildItems.mansion,
        this._host.engine.i18n("$buildings.mansion.label"),
        true
      ),

      this._getResetOption(
        this._settings.buildItems.workshop,
        this._host.engine.i18n("$buildings.workshop.label")
      ),
      this._getResetOption(
        this._settings.buildItems.factory,
        this._host.engine.i18n("$buildings.factory.label"),
        true
      ),

      this._getResetOption(
        this._settings.buildItems.field,
        this._host.engine.i18n("$buildings.field.label")
      ),
      this._getResetOption(
        this._settings.buildItems.pasture,
        this._host.engine.i18n("$buildings.pasture.label")
      ),
      this._getResetOption(
        this._settings.buildItems.solarFarm,
        this._host.engine.i18n("$buildings.solarfarm.label")
      ),
      this._getResetOption(
        this._settings.buildItems.mine,
        this._host.engine.i18n("$buildings.mine.label")
      ),
      this._getResetOption(
        this._settings.buildItems.lumberMill,
        this._host.engine.i18n("$buildings.lumberMill.label")
      ),
      this._getResetOption(
        this._settings.buildItems.aqueduct,
        this._host.engine.i18n("$buildings.aqueduct.label")
      ),
      this._getResetOption(
        this._settings.buildItems.hydroPlant,
        this._host.engine.i18n("$buildings.hydroplant.label")
      ),
      this._getResetOption(
        this._settings.buildItems.oilWell,
        this._host.engine.i18n("$buildings.oilWell.label")
      ),
      this._getResetOption(
        this._settings.buildItems.quarry,
        this._host.engine.i18n("$buildings.quarry.label"),
        true
      ),

      this._getResetOption(
        this._settings.buildItems.smelter,
        this._host.engine.i18n("$buildings.smelter.label")
      ),
      this._getResetOption(
        this._settings.buildItems.biolab,
        this._host.engine.i18n("$buildings.biolab.label")
      ),
      this._getResetOption(
        this._settings.buildItems.calciner,
        this._host.engine.i18n("$buildings.calciner.label")
      ),
      this._getResetOption(
        this._settings.buildItems.reactor,
        this._host.engine.i18n("$buildings.reactor.label")
      ),
      this._getResetOption(
        this._settings.buildItems.accelerator,
        this._host.engine.i18n("$buildings.accelerator.label")
      ),
      this._getResetOption(
        this._settings.buildItems.steamworks,
        this._host.engine.i18n("$buildings.steamworks.label")
      ),
      this._getResetOption(
        this._settings.buildItems.magneto,
        this._host.engine.i18n("$buildings.magneto.label"),
        true
      ),

      this._getResetOption(
        this._settings.buildItems.library,
        this._host.engine.i18n("$buildings.library.label")
      ),
      this._getResetOption(
        this._settings.buildItems.dataCenter,
        this._host.engine.i18n("$buildings.dataCenter.label")
      ),
      this._getResetOption(
        this._settings.buildItems.academy,
        this._host.engine.i18n("$buildings.academy.label")
      ),
      this._getResetOption(
        this._settings.buildItems.observatory,
        this._host.engine.i18n("$buildings.observatory.label"),
        true
      ),

      this._getResetOption(
        this._settings.buildItems.amphitheatre,
        this._host.engine.i18n("$buildings.amphitheatre.label")
      ),
      this._getResetOption(
        this._settings.buildItems.broadcastTower,
        this._host.engine.i18n("$buildings.broadcasttower.label")
      ),
      this._getResetOption(
        this._settings.buildItems.tradepost,
        this._host.engine.i18n("$buildings.tradepost.label")
      ),
      this._getResetOption(
        this._settings.buildItems.chapel,
        this._host.engine.i18n("$buildings.chapel.label")
      ),
      this._getResetOption(
        this._settings.buildItems.temple,
        this._host.engine.i18n("$buildings.temple.label")
      ),
      this._getResetOption(
        this._settings.buildItems.mint,
        this._host.engine.i18n("$buildings.mint.label")
      ),
      this._getResetOption(
        this._settings.buildItems.ziggurat,
        this._host.engine.i18n("$buildings.ziggurat.label")
      ),
      this._getResetOption(
        this._settings.buildItems.chronosphere,
        this._host.engine.i18n("$buildings.chronosphere.label")
      ),
      this._getResetOption(
        this._settings.buildItems.aiCore,
        this._host.engine.i18n("$buildings.aicore.label")
      ),
      this._getResetOption(
        this._settings.buildItems.brewery,
        this._host.engine.i18n("$buildings.brewery.label"),
        true
      ),

      this._getResetOption(
        this._settings.buildItems.barn,
        this._host.engine.i18n("$buildings.barn.label")
      ),
      this._getResetOption(
        this._settings.buildItems.harbor,
        this._host.engine.i18n("$buildings.harbor.label")
      ),
      this._getResetOption(
        this._settings.buildItems.warehouse,
        this._host.engine.i18n("$buildings.warehouse.label"),
        true
      ),

      this._getResetOption(
        this._settings.buildItems.zebraOutpost,
        this._host.engine.i18n("$buildings.zebraOutpost.label")
      ),
      this._getResetOption(
        this._settings.buildItems.zebraWorkshop,
        this._host.engine.i18n("$buildings.zebraWorkshop.label")
      ),
      this._getResetOption(
        this._settings.buildItems.zebraForge,
        this._host.engine.i18n("$buildings.zebraForge.label")
      )
    );

    // Space reset options
    const resetSpaceList = new SettingsList(this._host);
    resetSpaceList.element.append(
      this._getResetOption(
        this._settings.spaceItems.spaceElevator,
        this._host.engine.i18n("$space.planet.cath.spaceElevator.label")
      ),
      this._getResetOption(
        this._settings.spaceItems.sattelite,
        this._host.engine.i18n("$space.planet.cath.sattelite.label")
      ),
      this._getResetOption(
        this._settings.spaceItems.spaceStation,
        this._host.engine.i18n("$space.planet.cath.spaceStation.label"),
        true
      ),

      this._getResetOption(
        this._settings.spaceItems.moonOutpost,
        this._host.engine.i18n("$space.planet.moon.moonOutpost.label")
      ),
      this._getResetOption(
        this._settings.spaceItems.moonBase,
        this._host.engine.i18n("$space.planet.moon.moonBase.label"),
        true
      ),

      this._getResetOption(
        this._settings.spaceItems.planetCracker,
        this._host.engine.i18n("$space.planet.dune.planetCracker.label")
      ),
      this._getResetOption(
        this._settings.spaceItems.hydrofracturer,
        this._host.engine.i18n("$space.planet.dune.hydrofracturer.label")
      ),
      this._getResetOption(
        this._settings.spaceItems.spiceRefinery,
        this._host.engine.i18n("$space.planet.dune.spiceRefinery.label"),
        true
      ),

      this._getResetOption(
        this._settings.spaceItems.researchVessel,
        this._host.engine.i18n("$space.planet.piscine.researchVessel.label")
      ),
      this._getResetOption(
        this._settings.spaceItems.orbitalArray,
        this._host.engine.i18n("$space.planet.piscine.orbitalArray.label"),
        true
      ),

      this._getResetOption(
        this._settings.spaceItems.sunlifter,
        this._host.engine.i18n("$space.planet.helios.sunlifter.label")
      ),
      this._getResetOption(
        this._settings.spaceItems.containmentChamber,
        this._host.engine.i18n("$space.planet.helios.containmentChamber.label")
      ),
      this._getResetOption(
        this._settings.spaceItems.heatsink,
        this._host.engine.i18n("$space.planet.helios.heatsink.label")
      ),
      this._getResetOption(
        this._settings.spaceItems.sunforge,
        this._host.engine.i18n("$space.planet.helios.sunforge.label"),
        true
      ),

      this._getResetOption(
        this._settings.spaceItems.cryostation,
        this._host.engine.i18n("$space.planet.terminus.cryostation.label"),
        true
      ),

      this._getResetOption(
        this._settings.spaceItems.spaceBeacon,
        this._host.engine.i18n("$space.planet.kairo.spaceBeacon.label"),
        true
      ),

      this._getResetOption(
        this._settings.spaceItems.terraformingStation,
        this._host.engine.i18n("$space.planet.yarn.terraformingStation.label")
      ),
      this._getResetOption(
        this._settings.spaceItems.hydroponics,
        this._host.engine.i18n("$space.planet.yarn.hydroponics.label"),
        true
      ),

      this._getResetOption(
        this._settings.spaceItems.hrHarvester,
        this._host.engine.i18n("$space.planet.umbra.hrHarvester.label"),
        true
      ),

      this._getResetOption(
        this._settings.spaceItems.entangler,
        this._host.engine.i18n("$space.planet.charon.entangler.label"),
        true
      ),

      this._getResetOption(
        this._settings.spaceItems.tectonic,
        this._host.engine.i18n("$space.planet.centaurusSystem.tectonic.label")
      ),
      this._getResetOption(
        this._settings.spaceItems.moltenCore,
        this._host.engine.i18n("$space.planet.centaurusSystem.moltenCore.label")
      )
    );

    // Resources list
    const resetResourcesList = new SettingsList(this._host);
    this._resourcesList = resetResourcesList.element;
    // Add all the current resources
    for (const [name, item] of objectEntries(this._settings.resources)) {
      this._resourcesList.append(
        this._addNewResourceOption(
          ucfirst(this._host.engine.i18n(`$resources.${name}.title`)),
          item
        )
      );
    }

    // Religion reset options.
    const resetReligionList = new SettingsList(this._host);
    resetReligionList.element.append(
      this._getResetOption(
        this._settings.religionItems.unicornPasture,
        this._host.engine.i18n("$buildings.unicornPasture.label")
      ),
      this._getResetOption(
        this._settings.religionItems.unicornTomb,
        this._host.engine.i18n("$religion.zu.unicornTomb.label")
      ),
      this._getResetOption(
        this._settings.religionItems.ivoryTower,
        this._host.engine.i18n("$religion.zu.ivoryTower.label")
      ),
      this._getResetOption(
        this._settings.religionItems.ivoryCitadel,
        this._host.engine.i18n("$religion.zu.ivoryCitadel.label")
      ),
      this._getResetOption(
        this._settings.religionItems.skyPalace,
        this._host.engine.i18n("$religion.zu.skyPalace.label")
      ),
      this._getResetOption(
        this._settings.religionItems.unicornUtopia,
        this._host.engine.i18n("$religion.zu.unicornUtopia.label")
      ),
      this._getResetOption(
        this._settings.religionItems.sunspire,
        this._host.engine.i18n("$religion.zu.sunspire.label"),
        true
      ),

      this._getResetOption(
        this._settings.religionItems.marker,
        this._host.engine.i18n("$religion.zu.marker.label")
      ),
      this._getResetOption(
        this._settings.religionItems.unicornGraveyard,
        this._host.engine.i18n("$religion.zu.unicornGraveyard.label")
      ),
      this._getResetOption(
        this._settings.religionItems.unicornNecropolis,
        this._host.engine.i18n("$religion.zu.unicornNecropolis.label")
      ),
      this._getResetOption(
        this._settings.religionItems.blackPyramid,
        this._host.engine.i18n("$religion.zu.blackPyramid.label"),
        true
      ),

      this._getResetOption(
        this._settings.religionItems.solarchant,
        this._host.engine.i18n("$religion.ru.solarchant.label")
      ),
      this._getResetOption(
        this._settings.religionItems.scholasticism,
        this._host.engine.i18n("$religion.ru.scholasticism.label")
      ),
      this._getResetOption(
        this._settings.religionItems.goldenSpire,
        this._host.engine.i18n("$religion.ru.goldenSpire.label")
      ),
      this._getResetOption(
        this._settings.religionItems.sunAltar,
        this._host.engine.i18n("$religion.ru.sunAltar.label")
      ),
      this._getResetOption(
        this._settings.religionItems.stainedGlass,
        this._host.engine.i18n("$religion.ru.stainedGlass.label")
      ),
      this._getResetOption(
        this._settings.religionItems.solarRevolution,
        this._host.engine.i18n("$religion.ru.solarRevolution.label")
      ),
      this._getResetOption(
        this._settings.religionItems.basilica,
        this._host.engine.i18n("$religion.ru.basilica.label")
      ),
      this._getResetOption(
        this._settings.religionItems.templars,
        this._host.engine.i18n("$religion.ru.templars.label")
      ),
      this._getResetOption(
        this._settings.religionItems.apocripha,
        this._host.engine.i18n("$religion.ru.apocripha.label")
      ),
      this._getResetOption(
        this._settings.religionItems.transcendence,
        this._host.engine.i18n("$religion.ru.transcendence.label"),
        true
      ),

      this._getResetOption(
        this._settings.religionItems.blackObelisk,
        this._host.engine.i18n("$religion.tu.blackObelisk.label")
      ),
      this._getResetOption(
        this._settings.religionItems.blackNexus,
        this._host.engine.i18n("$religion.tu.blackNexus.label")
      ),
      this._getResetOption(
        this._settings.religionItems.blackCore,
        this._host.engine.i18n("$religion.tu.blackCore.label")
      ),
      this._getResetOption(
        this._settings.religionItems.singularity,
        this._host.engine.i18n("$religion.tu.singularity.label")
      ),
      this._getResetOption(
        this._settings.religionItems.blackLibrary,
        this._host.engine.i18n("$religion.tu.blackLibrary.label")
      ),
      this._getResetOption(
        this._settings.religionItems.blackRadiance,
        this._host.engine.i18n("$religion.tu.blackRadiance.label")
      ),
      this._getResetOption(
        this._settings.religionItems.blazar,
        this._host.engine.i18n("$religion.tu.blazar.label")
      ),
      this._getResetOption(
        this._settings.religionItems.darkNova,
        this._host.engine.i18n("$religion.tu.darkNova.label")
      ),
      this._getResetOption(
        this._settings.religionItems.holyGenocide,
        this._host.engine.i18n("$religion.tu.holyGenocide.label")
      )
    );

    const resetTimeList = new SettingsList(this._host);
    resetTimeList.element.append(
      this._getResetOption(
        this._settings.timeItems.temporalBattery,
        this._host.engine.i18n("$time.cfu.temporalBattery.label")
      ),
      this._getResetOption(
        this._settings.timeItems.blastFurnace,
        this._host.engine.i18n("$time.cfu.blastFurnace.label")
      ),
      this._getResetOption(
        this._settings.timeItems.timeBoiler,
        this._host.engine.i18n("$time.cfu.timeBoiler.label")
      ),
      this._getResetOption(
        this._settings.timeItems.temporalAccelerator,
        this._host.engine.i18n("$time.cfu.temporalAccelerator.label")
      ),
      this._getResetOption(
        this._settings.timeItems.temporalImpedance,
        this._host.engine.i18n("$time.cfu.temporalImpedance.label")
      ),
      this._getResetOption(
        this._settings.timeItems.ressourceRetrieval,
        this._host.engine.i18n("$time.cfu.ressourceRetrieval.label"),
        true
      ),

      this._getResetOption(
        this._settings.timeItems.cryochambers,
        this._host.engine.i18n("$time.vsu.cryochambers.label")
      ),
      this._getResetOption(
        this._settings.timeItems.voidHoover,
        this._host.engine.i18n("$time.vsu.voidHoover.label")
      ),
      this._getResetOption(
        this._settings.timeItems.voidRift,
        this._host.engine.i18n("$time.vsu.voidRift.label")
      ),
      this._getResetOption(
        this._settings.timeItems.chronocontrol,
        this._host.engine.i18n("$time.vsu.chronocontrol.label")
      ),
      this._getResetOption(
        this._settings.timeItems.voidResonator,
        this._host.engine.i18n("$time.vsu.voidResonator.label")
      )
    );

    const buildButton = $("<div/>", {
      id: "toggle-reset-build",
      html: '<svg style="width: 15px; height: 15px;" viewBox="0 0 48 48"><path fill="currentColor" d="M4 44v-9.15L22.15 10.3 18.8 5.8l2.45-1.75L24 7.8l2.8-3.75 2.4 1.75-3.3 4.5L44 34.85V44Zm20-31.15-17 23V41h7.25L24 27.35 33.75 41H41v-5.15ZM17.95 41h12.1L24 32.5ZM24 27.35 33.75 41 24 27.35 14.25 41Z"/></svg>',
      title: this._host.engine.i18n("ui.build"),
    }).addClass("ks-icon-button");
    const spaceButton = $("<div/>", {
      id: "toggle-reset-space",
      html: '<svg style="width: 15px; height: 15px;" viewBox="0 0 48 48"><path fill="currentColor" d="m9.35 20.45 5.3 2.25q.9-1.8 1.925-3.55Q17.6 17.4 18.75 15.8L14.8 15Zm7.7 4.05 6.65 6.65q2.85-1.3 5.35-2.95 2.5-1.65 4.05-3.2 4.05-4.05 5.95-8.3 1.9-4.25 2.05-9.6-5.35.15-9.6 2.05t-8.3 5.95q-1.55 1.55-3.2 4.05-1.65 2.5-2.95 5.35Zm11.45-4.8q-1-1-1-2.475t1-2.475q1-1 2.475-1t2.475 1q1 1 1 2.475t-1 2.475q-1 1-2.475 1t-2.475-1Zm-.75 19.15 5.45-5.45-.8-3.95q-1.6 1.15-3.35 2.175T25.5 33.55Zm16.3-34.7q.45 6.8-1.7 12.4-2.15 5.6-7.1 10.55l-.1.1-.1.1 1.1 5.5q.15.75-.075 1.45-.225.7-.775 1.25l-8.55 8.6-4.25-9.9-8.5-8.5-9.9-4.25 8.6-8.55q.55-.55 1.25-.775.7-.225 1.45-.075l5.5 1.1q.05-.05.1-.075.05-.025.1-.075 4.95-4.95 10.55-7.125 5.6-2.175 12.4-1.725Zm-36.6 27.6Q9.2 30 11.725 29.975 14.25 29.95 16 31.7q1.75 1.75 1.725 4.275Q17.7 38.5 15.95 40.25q-1.3 1.3-4.025 2.15Q9.2 43.25 3.75 44q.75-5.45 1.575-8.2.825-2.75 2.125-4.05Zm2.1 2.15q-.7.75-1.25 2.35t-.95 4.1q2.5-.4 4.1-.95 1.6-.55 2.35-1.25.95-.85.975-2.125.025-1.275-.875-2.225-.95-.9-2.225-.875-1.275.025-2.125.975Z"/></svg>',
      title: this._host.engine.i18n("ui.space"),
    }).addClass("ks-icon-button");
    const resourcesButton = $("<div/>", {
      id: "toggle-reset-resources",
      html: '<svg style="width: 15px; height: 15px;" viewBox="0 0 48 48"><path fill="currentColor" d="M38.4 42 25.85 29.45l2.85-2.85 12.55 12.55ZM9.35 42 6.5 39.15 21 24.65l-5.35-5.35-1.15 1.15-2.2-2.2v4.25l-1.2 1.2L5 17.6l1.2-1.2h4.3L8.1 14l6.55-6.55q.85-.85 1.85-1.15 1-.3 2.2-.3 1.2 0 2.2.425 1 .425 1.85 1.275l-5.35 5.35 2.4 2.4-1.2 1.2 5.2 5.2 6.1-6.1q-.4-.65-.625-1.5-.225-.85-.225-1.8 0-2.65 1.925-4.575Q32.9 5.95 35.55 5.95q.75 0 1.275.15.525.15.875.4l-4.25 4.25 3.75 3.75 4.25-4.25q.25.4.425.975t.175 1.325q0 2.65-1.925 4.575Q38.2 19.05 35.55 19.05q-.9 0-1.55-.125t-1.2-.375Z"/></svg>',
      title: this._host.engine.i18n("ui.craft.resources"),
    }).addClass("ks-icon-button");
    const religionButton = $("<div/>", {
      id: "toggle-reset-religion",
      html: '<svg style="width: 15px; height: 15px;" viewBox="0 0 48 48"><path fill="currentColor" d="M2 42V14q0-2.3 1.6-3.9t3.9-1.6q2.3 0 3.9 1.6T13 14v1.55L24 6l11 9.55V14q0-2.3 1.6-3.9t3.9-1.6q2.3 0 3.9 1.6T46 14v28H26.5V32q0-1.05-.725-1.775Q25.05 29.5 24 29.5q-1.05 0-1.775.725Q21.5 30.95 21.5 32v10Zm36-25.5h5V14q0-1.05-.725-1.775-.725-.725-1.775-.725-1.05 0-1.775.725Q38 12.95 38 14Zm-33 0h5V14q0-1.05-.725-1.775Q8.55 11.5 7.5 11.5q-1.05 0-1.775.725Q5 12.95 5 14ZM5 39h5V19.5H5Zm8 0h5.5v-7q0-2.3 1.6-3.9t3.9-1.6q2.3 0 3.9 1.6t1.6 3.9v7H35V19.5L24 9.95 13 19.5Zm25 0h5V19.5h-5ZM24 22.75q-1.15 0-1.95-.8t-.8-1.95q0-1.15.8-1.95t1.95-.8q1.15 0 1.95.8t.8 1.95q0 1.15-.8 1.95t-1.95.8Z"/></svg>',
      title: this._host.engine.i18n("ui.faith"),
    }).addClass("ks-icon-button");
    const timeButton = $("<div/>", {
      id: "toggle-reset-time",
      html: '<svg style="width: 15px; height: 15px;" viewBox="0 0 48 48"><path fill="currentColor" d="m31.35 33.65 2.25-2.25-7.95-8V13.35h-3V24.6ZM24 44q-4.1 0-7.75-1.575-3.65-1.575-6.375-4.3-2.725-2.725-4.3-6.375Q4 28.1 4 24t1.575-7.75q1.575-3.65 4.3-6.375 2.725-2.725 6.375-4.3Q19.9 4 24 4t7.75 1.575q3.65 1.575 6.375 4.3 2.725 2.725 4.3 6.375Q44 19.9 44 24t-1.575 7.75q-1.575 3.65-4.3 6.375-2.725 2.725-6.375 4.3Q28.1 44 24 44Zm0-20Zm0 17q7 0 12-5t5-12q0-7-5-12T24 7q-7 0-12 5T7 24q0 7 5 12t12 5Z"/></svg>',
      title: this._host.engine.i18n("ui.time"),
    }).addClass("ks-icon-button");

    buildButton.on("click", () => {
      resetBuildList.element.toggle();
      resetSpaceList.element.toggle(false);
      resetResourcesList.element.toggle(false);
      resetReligionList.element.toggle(false);
      resetTimeList.element.toggle(false);
    });
    spaceButton.on("click", () => {
      resetBuildList.element.toggle(false);
      resetSpaceList.element.toggle();
      resetResourcesList.element.toggle(false);
      resetReligionList.element.toggle(false);
      resetTimeList.element.toggle(false);
    });
    resourcesButton.on("click", () => {
      resetBuildList.element.toggle(false);
      resetSpaceList.element.toggle(false);
      resetResourcesList.element.toggle();
      resetReligionList.element.toggle(false);
      resetTimeList.element.toggle(false);
    });
    religionButton.on("click", () => {
      resetBuildList.element.toggle(false);
      resetSpaceList.element.toggle(false);
      resetResourcesList.element.toggle(false);
      resetReligionList.element.toggle();
      resetTimeList.element.toggle(false);
    });
    timeButton.on("click", () => {
      resetBuildList.element.toggle(false);
      resetSpaceList.element.toggle(false);
      resetResourcesList.element.toggle(false);
      resetReligionList.element.toggle(false);
      resetTimeList.element.toggle();
    });

    element.element.append(
      buildButton,
      spaceButton,
      resourcesButton,
      religionButton,
      timeButton,
      resetBuildList.element,
      resetSpaceList.element,
      resetResourcesList.element,
      resetReligionList.element,
      resetTimeList.element
    );

    return element;
  }

  private _getOptionAccelerateTime(
    option: TimeControlSettings["accelerateTime"],
    label: string
  ): SettingTriggerListItem {
    return new SettingTriggerListItem(this._host, label, option, {
      onCheck: () => this._host.engine.imessage("status.auto.enable", [label]),
      onUnCheck: () => this._host.engine.imessage("status.auto.disable", [label]),
    });
  }

  private _getCycle(
    index: CycleIndices,
    option: TimeControlSettings["timeSkip"]
  ): JQuery<HTMLElement> {
    const cycle = this._host.gamePage.calendar.cycles[index];

    const element = $("<li/>");

    const label = $("<label/>", {
      text: cycle.title,
    });

    const input = $("<input/>", {
      type: "checkbox",
    });
    option[`$${index}` as const] = input;

    input.on("change", () => {
      if (input.is(":checked") && option[index] === false) {
        this._host.updateOptions(() => (option[index] = true));
        this._host.engine.imessage("time.skip.cycle.enable", [cycle.title]);
      } else if (!input.is(":checked") && option[index] === true) {
        this._host.updateOptions(() => (option[index] = false));
        this._host.engine.imessage("time.skip.cycle.disable", [cycle.title]);
      }
    });

    label.prepend(input);
    element.append(input);

    return element;
  }

  private _getResetOption(
    option: SettingTrigger,
    i18nName: string,
    delimiter = false,
    upgradeIndicator = false
  ): JQuery<HTMLElement> {
    return new SettingTriggerListItem(
      this._host,
      i18nName,
      option,
      {
        onCheck: () => this._host.engine.imessage("status.reset.check.enable", [i18nName]),
        onUnCheck: () => this._host.engine.imessage("status.reset.check.disable", [i18nName]),
      },
      delimiter,
      upgradeIndicator
    ).element;
  }

  private _getSeasonForTimeSkip(
    season: Season,
    option: TimeControlTimeSkipSettings
  ): JQuery<HTMLElement> {
    const iseason = ucfirst(this._host.engine.i18n(`$calendar.season.${season}` as const));

    const element = $("<li/>");

    const label = $("<label/>", {
      text: ucfirst(iseason),
    });

    const input = $("<input/>", {
      type: "checkbox",
    });
    option[`$${season}` as const] = input;

    input.on("change", () => {
      if (input.is(":checked") && option[season] === false) {
        this._host.updateOptions(() => (option[season] = true));
        this._host.engine.imessage("time.skip.season.enable", [iseason]);
      } else if (!input.is(":checked") && option[season] === true) {
        this._host.updateOptions(() => (option[season] = false));
        this._host.engine.imessage("time.skip.season.disable", [iseason]);
      }
    });

    label.prepend(input);
    element.append(label);

    return element;
  }

  /**
   * Creates a UI element that reflects stock values for a given resource.
   * This is currently only used for the time/reset section.
   *
   * @param title The title to apply to the option.
   * @param setting The option that is being controlled.
   * @returns A new option with stock value.
   */
  private _addNewResourceOption(
    title: string,
    setting: TimeControlResourcesSettingsItem
  ): JQuery<HTMLElement> {
    const stock = setting.stock;

    // The overall container for this resource item.
    const container = new SettingListItem(this._host, title, setting, {
      onCheck: () => this._host.engine.imessage("status.sub.enable", [title]),
      onUnCheck: () => this._host.engine.imessage("status.sub.disable", [title]),
    });

    // How many items to stock.
    const stockElement = $("<div/>", {
      text: this._host.engine.i18n("resources.stock", [this._renderLimit(stock)]),
    })
      .addClass("ks-text-button")
      .addClass("ks-label");

    container.element.append(stockElement);

    stockElement.on("click", () => {
      const value = SettingsSectionUi.promptLimit(
        this._host.engine.i18n("resources.stock.set", [title]),
        setting.stock.toFixed(0)
      );
      if (value !== null) {
        setting.enabled = true;
        setting.stock = value;
        stockElement.text(this._host.engine.i18n("resources.stock", [this._renderLimit(value)]));
        this._host.updateOptions();
      }
    });

    setting.$stock = stockElement;

    return container.element;
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

    for (const [name, option] of objectEntries(state.resources)) {
      option.enabled = state.resources[name].enabled;
      option.stock = state.resources[name].stock;
    }
  }

  refreshUi(): void {
    this.setState(this._settings);

    mustExist(this._settings.$enabled).refreshUi();

    mustExist(this._settings.accelerateTime.$enabled).refreshUi();
    mustExist(this._settings.accelerateTime.$trigger).refreshUi();

    mustExist(this._settings.reset.$enabled).refreshUi();

    mustExist(this._settings.timeSkip.$enabled).refreshUi();
    mustExist(this._settings.timeSkip.$trigger).refreshUi();
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
      mustExist(option.$enabled).refreshUi();
      mustExist(option.$trigger).element.text(
        this._host.engine.i18n("ui.min", [
          this._renderLimit(this._settings.buildItems[name].trigger),
        ])
      );
    }
    for (const [name, option] of objectEntries(this._settings.religionItems)) {
      mustExist(option.$enabled).refreshUi();
      mustExist(option.$trigger).element.text(
        this._host.engine.i18n("ui.min", [
          this._renderLimit(this._settings.religionItems[name].trigger),
        ])
      );
    }
    for (const [name, option] of objectEntries(this._settings.spaceItems)) {
      mustExist(option.$enabled).refreshUi();
      mustExist(option.$trigger).element.text(
        this._host.engine.i18n("ui.min", [
          this._renderLimit(this._settings.spaceItems[name].trigger),
        ])
      );
    }
    for (const [name, option] of objectEntries(this._settings.timeItems)) {
      mustExist(option.$enabled).refreshUi();
      mustExist(option.$trigger).element.text(
        this._host.engine.i18n("ui.min", [
          this._renderLimit(this._settings.timeItems[name].trigger),
        ])
      );
    }

    for (const [name, option] of objectEntries(this._settings.resources)) {
      mustExist(option.$stock).text(
        this._host.engine.i18n("resources.stock", [
          this._renderLimit(mustExist(this._settings.resources[name]).stock),
        ])
      );
    }
  }
}
