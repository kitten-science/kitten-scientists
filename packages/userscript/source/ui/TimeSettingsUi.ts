import { TimeSettings } from "../options/TimeSettings";
import { objectEntries } from "../tools/Entries";
import { ucfirst } from "../tools/Format";
import { mustExist } from "../tools/Maybe";
import { UserScript } from "../UserScript";
import { SettingsSectionUi } from "./SettingsSectionUi";

export class TimeSettingsUi extends SettingsSectionUi<TimeSettings> {
  readonly element: JQuery<HTMLElement>;

  private readonly _options: TimeSettings;

  private readonly _itemsButton: JQuery<HTMLElement>;
  private _itemsExpanded = false;
  private readonly _triggerButton: JQuery<HTMLElement>;

  private readonly _optionButtons = new Array<JQuery<HTMLElement>>();

  constructor(host: UserScript, options: TimeSettings = host.options.auto.time) {
    super(host);

    this._options = options;

    const toggleName = "time";

    const itext = ucfirst(this._host.i18n("ui.time"));

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
        this._options.trigger.toFixed(2)
      );

      if (value !== null) {
        this._options.trigger = parseFloat(value);
        //this._host.saveToKittenStorage();
        this._triggerButton[0].title = this._options.trigger.toFixed(2);
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
      this.getOption(
        "temporalBattery",
        this._options.items.temporalBattery,
        this._host.i18n("$time.cfu.temporalBattery.label")
      ),
      this.getOption(
        "blastFurnace",
        this._options.items.blastFurnace,
        this._host.i18n("$time.cfu.blastFurnace.label")
      ),
      this.getOption(
        "timeBoiler",
        this._options.items.timeBoiler,
        this._host.i18n("$time.cfu.timeBoiler.label")
      ),
      this.getOption(
        "temporalAccelerator",
        this._options.items.temporalAccelerator,
        this._host.i18n("$time.cfu.temporalAccelerator.label")
      ),
      this.getOption(
        "temporalImpedance",
        this._options.items.temporalImpedance,
        this._host.i18n("$time.cfu.temporalImpedance.label")
      ),
      this.getOption(
        "ressourceRetrieval",
        this._options.items.ressourceRetrieval,
        this._host.i18n("$time.cfu.ressourceRetrieval.label"),
        true
      ),

      this.getOption(
        "cryochambers",
        this._options.items.cryochambers,
        this._host.i18n("$time.vsu.cryochambers.label")
      ),
      this.getOption(
        "voidHoover",
        this._options.items.voidHoover,
        this._host.i18n("$time.vsu.voidHoover.label")
      ),
      this.getOption(
        "voidRift",
        this._options.items.voidRift,
        this._host.i18n("$time.vsu.voidRift.label")
      ),
      this.getOption(
        "chronocontrol",
        this._options.items.chronocontrol,
        this._host.i18n("$time.vsu.chronocontrol.label")
      ),
      this.getOption(
        "voidResonator",
        this._options.items.voidResonator,
        this._host.i18n("$time.vsu.voidResonator.label")
      ),
    ];

    list.append(...this._optionButtons);

    element.append(this._itemsButton);
    element.append(this._triggerButton);
    element.append(list);

    this.element = element;
  }

  setState(state: TimeSettings): void {
    this._options.enabled = state.enabled;
    this._options.trigger = state.trigger;

    for (const [name, option] of objectEntries(this._options.items)) {
      option.enabled = state.items[name].enabled;
    }
  }

  refreshUi(): void {
    mustExist(this._options.$enabled).prop("checked", this._options.enabled);
    mustExist(this._options.$trigger)[0].title = this._options.trigger.toFixed(2);

    for (const [name, option] of objectEntries(this._options.items)) {
      mustExist(option.$enabled).prop("checked", this._options.items[name].enabled);
    }
  }
}
