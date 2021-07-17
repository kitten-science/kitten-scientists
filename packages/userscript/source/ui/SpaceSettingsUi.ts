import { SpaceSettings, SpaceSettingsItem } from "../options/SpaceSettings";
import { objectEntries } from "../tools/Entries";
import { ucfirst } from "../tools/Format";
import { mustExist } from "../tools/Maybe";
import { UserScript } from "../UserScript";
import { SettingsSectionUi } from "./SettingsSectionUi";

export class SpaceSettingsUi extends SettingsSectionUi<SpaceSettings> {
  readonly element: JQuery<HTMLElement>;

  private readonly _options: SpaceSettings;

  private readonly _itemsButton: JQuery<HTMLElement>;
  private _itemsExpanded = false;
  private readonly _triggerButton: JQuery<HTMLElement>;

  private readonly _optionButtons = new Array<JQuery<HTMLElement>>();

  constructor(host: UserScript, options: SpaceSettings = host.options.auto.space) {
    super(host);

    this._options = options;

    const toggleName = "space";

    const itext = ucfirst(this._host.i18n("ui.space"));

    // Our main element is a list item.
    const element = $("<li/>", { id: "ks-" + toggleName });

    const label = $("<label/>", {
      text: itext,
    });
    label.on("click", () => this._itemsButton.trigger("click"));

    const input = $("<input/>", {
      id: "toggle-" + toggleName,
      type: "checkbox",
    });
    this._options.$enabled = input;

    input.on("change", () => {
      if (input.is(":checked") && this._options.enabled === false) {
        this._options.enabled = true;

        this._host.imessage("status.auto.enable", [itext]);
        //saveToKittenStorage();
      } else if (!input.is(":checked") && this._options.enabled === true) {
        this._options.enabled = false;
        this._host.imessage("status.auto.disable", [itext]);
        //saveToKittenStorage();
      }
    });

    element.append(input, label);

    // Create "trigger" button in the item.
    this._triggerButton = $("<div/>", {
      id: "trigger-" + toggleName,
      text: this._host.i18n("ui.trigger"),
      //title: this._options.trigger,
      css: {
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        paddingRight: "5px",
        textShadow: "3px 3px 4px gray",
      },
    });
    this._options.$trigger = this._triggerButton;

    this._triggerButton.on("click", () => {
      const value = window.prompt(
        this._host.i18n("ui.trigger.set", [itext]),
        this._options.trigger.toString()
      );

      if (value !== null) {
        this._options.trigger = parseFloat(value);
        //this._host.saveToKittenStorage();
        this._triggerButton[0].title = this._options.trigger.toString();
      }
    });

    // Create build items.
    // We create these in a list that is displayed when the user clicks the "items" button.
    const list = this.getOptionHead(toggleName);

    // Add a border on the element
    element.css("borderBottom", "1px  solid rgba(185, 185, 185, 0.7)");

    this._itemsButton = $("<div/>", {
      id: "toggle-items-" + toggleName,
      text: "+",
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

      this._itemsExpanded = !this._itemsExpanded;

      this._itemsButton.text(this._itemsExpanded ? "-" : "+");
      this._itemsButton.prop(
        "title",
        this._itemsExpanded ? this._host.i18n("ui.itemsHide") : this._host.i18n("ui.itemsShow")
      );
    });

    this._optionButtons = [
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

      this._getLimitedOption(
        "cryostation",
        this._options.items.cryostation,
        this._host.i18n("$space.planet.terminus.cryostation.label"),
        true
      ),

      this._getLimitedOption(
        "spaceBeacon",
        this._options.items.spaceBeacon,
        this._host.i18n("$space.planet.kairo.spaceBeacon.label"),
        true
      ),

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

      this._getLimitedOption(
        "hrHarvester",
        this._options.items.hrHarvester,
        this._host.i18n("$space.planet.umbra.hrHarvester.label"),
        true
      ),

      this._getLimitedOption(
        "entangler",
        this._options.items.entangler,
        this._host.i18n("$space.planet.charon.entangler.label"),
        true
      ),

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

    list.append(...this._optionButtons);

    element.append(this._itemsButton);
    element.append(this._triggerButton);
    element.append(list);

    this.element = element;
  }

  private _getLimitedOption(
    name: string,
    option: SpaceSettingsItem,
    i18nName: string,
    delimiter = false
  ): JQuery<HTMLElement> {
    const element = this.getOption(name, option, i18nName, delimiter, {
      onCheck: () => {
        option.enabled = true;
        this._host.imessage("status.auto.enable", [i18nName]);
      },
      onUnCheck: () => {
        option.enabled = false;
        this._host.imessage("status.auto.disable", [i18nName]);
      },
    });

    const maxButton = $("<div/>", {
      id: "set-" + name + "-max",
      text: this._host.i18n("ui.max", [option.max]),
      //title: option.max,
      css: {
        cursor: "pointer",
        display: "inline-block",
        float: "right",
        paddingRight: "5px",
        textShadow: "3px 3px 4px gray",
      },
    }).data("option", option);
    option.$max = maxButton;

    maxButton.on("click", () => {
      const value = window.prompt(this._host.i18n("ui.max.set", [i18nName]), option.max.toString());

      if (value !== null) {
        option.max = parseInt(value);
        //kittenStorage.items[maxButton.attr("id")] = option.max;
        //this._host.saveToKittenStorage();
        maxButton[0].title = option.max.toString();
        maxButton[0].innerText = this._host.i18n("ui.max", [option.max]);
      }
    });

    element.append(maxButton);

    return element;
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
    mustExist(this._options.$trigger)[0].title = this._options.trigger.toFixed(2);

    for (const [name, option] of objectEntries(this._options.items)) {
      mustExist(option.$enabled).prop("checked", this._options.items[name].enabled);
      mustExist(option.$max).text(this._host.i18n("ui.max", [this._options.items[name].max]));
    }
  }
}
