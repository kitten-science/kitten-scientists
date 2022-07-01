import { SpaceSettings } from "../options/SpaceSettings";
import { objectEntries } from "../tools/Entries";
import { ucfirst } from "../tools/Format";
import { mustExist } from "../tools/Maybe";
import { UserScript } from "../UserScript";
import { SettingsSectionUi } from "./SettingsSectionUi";

export class SpaceSettingsUi extends SettingsSectionUi<SpaceSettings> {
  readonly element: JQuery<HTMLElement>;

  private readonly _options: SpaceSettings;

  private _itemsExpanded = false;

  constructor(host: UserScript, options: SpaceSettings = host.options.auto.space) {
    super(host);

    this._options = options;

    const toggleName = "space";

    const itext = ucfirst(this._host.i18n("ui.space"));

    // Our main element is a list item.
    const element = this._getSettingsPanel(toggleName, itext);

    this._options.$enabled = element.checkbox;

    element.checkbox.on("change", () => {
      if (element.checkbox.is(":checked") && this._options.enabled === false) {
        this._host.updateOptions(() => (this._options.enabled = true));
        this._host.imessage("status.auto.enable", [itext]);
      } else if (!element.checkbox.is(":checked") && this._options.enabled === true) {
        this._host.updateOptions(() => (this._options.enabled = false));
        this._host.imessage("status.auto.disable", [itext]);
      }
    });

    // Create "trigger" button in the item.
    this._options.$trigger = this._registerTriggerButton(toggleName, itext, this._options);

    // Create build items.
    // We create these in a list that is displayed when the user clicks the "items" button.
    const list = this._getOptionList(toggleName);

    element.items.on("click", () => {
      list.toggle();

      this._itemsExpanded = !this._itemsExpanded;

      element.items.text(this._itemsExpanded ? "-" : "+");
      element.items.prop(
        "title",
        this._itemsExpanded ? this._host.i18n("ui.itemsHide") : this._host.i18n("ui.itemsShow")
      );
    });

    const optionButtons = [
      this._getHeader(this._host.i18n("$space.planet.cath.label")),
      this._getLimitedOption(
        "spaceElevator",
        this._options.items.spaceElevator,
        this._host.i18n("$space.planet.cath.spaceElevator.label")
      ),
      this._getLimitedOption(
        "sattelite",
        this._options.items.sattelite,
        this._host.i18n("$space.planet.cath.sattelite.label")
      ),
      this._getLimitedOption(
        "spaceStation",
        this._options.items.spaceStation,
        this._host.i18n("$space.planet.cath.spaceStation.label"),
        true
      ),

      this._getHeader(this._host.i18n("$space.planet.moon.label")),
      this._getLimitedOption(
        "moonOutpost",
        this._options.items.moonOutpost,
        this._host.i18n("$space.planet.moon.moonOutpost.label")
      ),
      this._getLimitedOption(
        "moonBase",
        this._options.items.moonBase,
        this._host.i18n("$space.planet.moon.moonBase.label"),
        true
      ),

      this._getHeader(this._host.i18n("$space.planet.dune.label")),
      this._getLimitedOption(
        "planetCracker",
        this._options.items.planetCracker,
        this._host.i18n("$space.planet.dune.planetCracker.label")
      ),
      this._getLimitedOption(
        "hydrofracturer",
        this._options.items.hydrofracturer,
        this._host.i18n("$space.planet.dune.hydrofracturer.label")
      ),
      this._getLimitedOption(
        "spiceRefinery",
        this._options.items.spiceRefinery,
        this._host.i18n("$space.planet.dune.spiceRefinery.label"),
        true
      ),

      this._getHeader(this._host.i18n("$space.planet.piscine.label")),
      this._getLimitedOption(
        "researchVessel",
        this._options.items.researchVessel,
        this._host.i18n("$space.planet.piscine.researchVessel.label")
      ),
      this._getLimitedOption(
        "orbitalArray",
        this._options.items.orbitalArray,
        this._host.i18n("$space.planet.piscine.orbitalArray.label"),
        true
      ),

      this._getHeader(this._host.i18n("$space.planet.helios.label")),
      this._getLimitedOption(
        "sunlifter",
        this._options.items.sunlifter,
        this._host.i18n("$space.planet.helios.sunlifter.label")
      ),
      this._getLimitedOption(
        "containmentChamber",
        this._options.items.containmentChamber,
        this._host.i18n("$space.planet.helios.containmentChamber.label")
      ),
      this._getLimitedOption(
        "heatsink",
        this._options.items.heatsink,
        this._host.i18n("$space.planet.helios.heatsink.label")
      ),
      this._getLimitedOption(
        "sunforge",
        this._options.items.sunforge,
        this._host.i18n("$space.planet.helios.sunforge.label"),
        true
      ),

      this._getHeader(this._host.i18n("$space.planet.terminus.label")),
      this._getLimitedOption(
        "cryostation",
        this._options.items.cryostation,
        this._host.i18n("$space.planet.terminus.cryostation.label"),
        true
      ),

      this._getHeader(this._host.i18n("$space.planet.kairo.label")),
      this._getLimitedOption(
        "spaceBeacon",
        this._options.items.spaceBeacon,
        this._host.i18n("$space.planet.kairo.spaceBeacon.label"),
        true
      ),

      this._getHeader(this._host.i18n("$space.planet.yarn.label")),
      this._getLimitedOption(
        "terraformingStation",
        this._options.items.terraformingStation,
        this._host.i18n("$space.planet.yarn.terraformingStation.label")
      ),
      this._getLimitedOption(
        "hydroponics",
        this._options.items.hydroponics,
        this._host.i18n("$space.planet.yarn.hydroponics.label"),
        true
      ),

      this._getHeader(this._host.i18n("$space.planet.umbra.label")),
      this._getLimitedOption(
        "hrHarvester",
        this._options.items.hrHarvester,
        this._host.i18n("$space.planet.umbra.hrHarvester.label"),
        true
      ),

      this._getHeader(this._host.i18n("$space.planet.charon.label")),
      this._getLimitedOption(
        "entangler",
        this._options.items.entangler,
        this._host.i18n("$space.planet.charon.entangler.label"),
        true
      ),

      this._getHeader(this._host.i18n("$space.planet.centaurusSystem.label")),
      this._getLimitedOption(
        "tectonic",
        this._options.items.tectonic,
        this._host.i18n("$space.planet.centaurusSystem.tectonic.label")
      ),
      this._getLimitedOption(
        "moltenCore",
        this._options.items.moltenCore,
        this._host.i18n("$space.planet.centaurusSystem.moltenCore.label")
      ),
    ];

    list.append(...optionButtons);

    element.panel.append(this._options.$trigger);
    element.panel.append(list);

    this.element = element.panel;
  }

  getState(): SpaceSettings {
    return {
      enabled: this._options.enabled,
      trigger: this._options.trigger,
      items: this._options.items,
    };
  }

  setState(state: SpaceSettings): void {
    this._options.enabled = state.enabled;
    this._options.trigger = state.trigger;

    for (const [name, option] of objectEntries(this._options.items)) {
      option.enabled = state.items[name].enabled;
      option.max = state.items[name].max;
    }
  }

  refreshUi(): void {
    mustExist(this._options.$enabled).prop("checked", this._options.enabled);
    mustExist(this._options.$trigger)[0].title = this._options.trigger.toFixed(3);

    for (const [name, option] of objectEntries(this._options.items)) {
      mustExist(option.$enabled).prop("checked", this._options.items[name].enabled);
      mustExist(option.$max).text(this._host.i18n("ui.max", [this._options.items[name].max]));
    }
  }
}
